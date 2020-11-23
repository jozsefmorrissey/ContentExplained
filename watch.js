const fs = require('fs');
const shell = require('shelljs');

const env = process.argv[2];

shell.exec('cat ./src/index/ExprDef.js ./src/index/services/\\$t.js > ./bin/builder.js')
shell.exec(`curl -X GET --insecure 'https://localhost:3001/content-explained/EPNTS/${env}' > ./bin/EPNTS.js`, {silent: true});

const $t = require('./bin/builder.js').$t;
const CssFile = require('./src/index/css.js').CssFile;
const multiRunBuffer = 2000;
const fileDumpLoc = './bin/$templates.js';
const cssDumpLoc = './bin/$css.js';

class Watcher {
  constructor(func) {
    const directories = [];
    const isFile = {};
    function readFile(filename) {
      function read(err, contents) {
        if (err) {
          console.error(err);
        }
        console.log('ran file: ', `${filename}`)
        func(filename, contents);
      }
      fs.readFile(filename, 'utf8', read);
    }

    function runAllFiles(watchDir) {
      const files = shell.exec(`find ${watchDir} -type f`, {silent: true}).split('\n');
      for (let index = 0; index < files.length; index += 1) {
        if (files[index]) {
          readFile(files[index]);
        }
      }
    }

    const pending = {};
    function watch(fileOdir) {
      pending[fileOdir] = {};
      directories.push(fileOdir);
      console.log(`Watching: ${fileOdir}`);
      fs.watch(fileOdir, { encoding: 'utf8' }, (eventType, filename) => {
        function wait() {
          pending[fileOdir][filename] = false;
          watchDirectories(fileOdir);
          const filePath = isFile[fileOdir] ? fileOdir : `${fileOdir}/${filename}`;
          readFile(filePath);
        }
        if (!pending[fileOdir][filename]) {
          pending[fileOdir][filename] = true;
          setTimeout(wait, 500);
        }
      });
    }

    function watchDirectories(fileOdir) {
      if (!isFile[fileOdir]) {
        const dirs = shell.exec(`find ${fileOdir} -type d`, {silent: true}).split('\n');
        for (let index = 0; index < dirs.length; index += 1) {
          const dir = dirs[index];
          if (dir && directories.indexOf(dir) === -1) {
            directories.push(dir);
            watch(dir);
          }
        }
      }
    }

    this.add = function (fileOdir) {
      fileOdir = fileOdir.trim().replace(/^(.*?)\/*$/, '$1');
      isFile[fileOdir] = shell.exec(`[ -f '${fileOdir}' ] && echo true`, {silent: true}).stdout
      runAllFiles(fileOdir);
      watch(fileOdir);
      watchDirectories(fileOdir);
      return this;
    }
  }
}

const jsFiles = {};
const afterFiles = {};
const allJsFiles = {};
let position = 0;
const refRegex = /(class|function)\s{1}([\$a-zA-Z][a-zA-Z0-9\$]*)/g;
class JsFile {
  constructor(filename, contents) {
    allJsFiles[filename] = this;
    const instance = this;
    this.filename = filename;
    this.contents = contents;
    this.position = position++;
    let after;
    function updateAfter () {
      let firstLine = instance.contents.split('\n')[0];
      if (after) {
        afterFiles[after] = [after].splice(afterFiles[after].indexOf(instance), 1);
      }
      after = firstLine.replace(/^\s*\/\/\s*(.*)\s*$/, '$1');
      if (after && after !== firstLine) {
          if (afterFiles[after] === undefined) afterFiles[after] = [];
          afterFiles[after].push(instance);
          delete jsFiles[instance.filename];
      } else {
        after = undefined;
        jsFiles[instance.filename] = instance;
      }
    }
    this.updateContents = function (cont) {
      this.contents = cont;
      const newRefs = {};

      const matches = contents.match(refRegex);
      if (matches) {
        matches.map(function (elem) {
          const name = elem.replace(refRegex, '$2');
          newRefs[name] = true;
        });
      }
      updateAfter();
      this.references = newRefs;
    }
    this.replace = function () {
      this.overwrite = true;
    }
    this.updateContents(contents);
  }
}

function fileExistes(filename) {
  return shell.exec(`[ -f '${filename}' ] && echo true`, {silent: true}).stdout.trim() === 'true';
}

function dummy() {};
function jsBundler(filename, contents) {
  let bundle = 'let CE = function () {\nconst afterLoad = []\n';
  if (!fileExistes(filename)) {
    delete jsFiles[filename];
    delete allJsFiles[filename];
    delete afterFiles[filename];
  } else if (allJsFiles[filename]) {
    allJsFiles[filename].updateContents(contents);
  } else {
    new JsFile(filename, contents);
  }

  function addAfterFiles(filename) {
    if (afterFiles[filename]) {
      afterFiles[filename].forEach((child, i) => {
        bundle += child.contents;
        addAfterFiles(child.filename);
      });
    }
  }
  Object.values(jsFiles).sort(function (jsF1, jsF2) {
    return jsF1.filename.match(/[^.]{2,}?\//g).length -
          jsF2.filename.match(/[^.]{2,}?\//g).length;
  }).forEach((item, i) => {
    bundle += item.contents;
    addAfterFiles(item.filename);
  });
  const exposed = '{afterLoad, $t, Request, EPNTS, User, Form, Expl, HoverResources, properties}';
  bundle += `\nreturn ${exposed};\n}\nCE = CE()\nCE.afterLoad.forEach((item) => {item();});`;
  fs.writeFile('./index.js', bundle, dummy);
}

function compHtml(filename, contents) {
  if (!filename) return;
  new $t(contents, filename.replace(/^.\/html\/(.*)\.html$/, '$1'));
  try {
    shell.touch(fileDumpLoc);
    console.log('writing file', filename)
    fs.writeFileSync(fileDumpLoc, '// ./src/index/services/$t.js\n' + $t.dumpTemplates());
  } catch (e) {
    console.log(e);
  }
}

function compCss(filename, contents) {
  if (!filename) return;
  new CssFile(filename, contents);
  fs.writeFileSync(cssDumpLoc, '// ./src/index/css.js\n' + CssFile.dump());
}

new Watcher(compHtml).add('./html');
new Watcher(compCss).add('./css/');
new Watcher(jsBundler).add('./constants/global.js')
                      .add('./src/index/')
                      .add('./bin/$css.js')
                      .add('./bin/$templates.js')
                      .add('./bin/EPNTS.js');

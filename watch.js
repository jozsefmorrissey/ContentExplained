const fs = require('fs');
const shell = require('shelljs');
const { Mutex, Semaphore } = require('async-mutex');

const { EPNTS } = require('./bin/EPNTS');
const env = process.argv[2];
const host = EPNTS._envs[env];


shell.cat('./src/index/ExprDef.js', './src/index/services/\\$t.js')
    .to('./bin/builder.js');

function HachyImport(url, dest) {
  const curlCmd = `curl -X GET --insecure '${url}'`;
  const code = shell.exec(curlCmd, {silent: true}).stdout;
  if (code !== '') {
    fs.writeFile(dest, code, () =>
        console.warn(`HackyImport: \n\t${dest}\n\t${url}`));
  }
}

HachyImport(`${host}/EPNTS/${env}`, './bin/EPNTS.js');
HachyImport('https://localhost:3001/debug-gui/js/debug-gui-client.js', './bin/debug-gui-client.js');
HachyImport('https://localhost:3001/debug-gui/js/debug-gui.js', './bin/debug-gui.js');
HachyImport('https://localhost:3001/js/short-cut-container.js', './bin/short-cut-container.js');


const $t = require('./bin/builder.js').$t;
const CssFile = require('./src/index/css.js').CssFile;
const multiRunBuffer = 2000;
const fileDumpLoc = './bin/$templates.js';
const cssDumpLoc = './bin/$css.js';

class Watcher {
  constructor(onChange, onUpdate) {
    const largNumber = Number.MAX_SAFE_INTEGER;
    const semaphore = new Semaphore(largNumber);
    const mutex = new Mutex();
    function readFile(file) {
      semaphore.acquire().then(function([value, release]) {

        function notify() {
          value--;
          release();
          if (value === largNumber - 1 && onUpdate) onUpdate();
        }

        function read(err, contents) {
          if (err) {
            console.error(err);
          }
          console.log('ran file: ', `${file.name}`)
          onChange(file.name, contents);
          setTimeout(notify, 300);
        }
        fs.readFile(file.name, 'utf8', read);
      });
    }

    function runAllFiles(watchDir) {
      watchDir = `${watchDir}/`.replace(/\/{2,}/g, '/');
      const files = shell.ls('-ld', `${watchDir}*`);
      // const files = shell.find(watchDir, {silent: true});
      for (let index = 0; index < files.length; index += 1) {
        const item = files[index];
        if (item.isFile()) {
          readFile(item);
        } else if (item.isDirectory() && !dirs[item.name]) {
          dirs[item.name] = true;
          watch(item, watchDir);
        }
      }
    }

    const pending = {};
    const dirs = {};
    function watch(item, parent) {
      const path = item.isDirectory() || parent === undefined ?
            item.name : `${parent}${item.name}`.replace(/\/{2,}/g, '/');
      pending[path] = {};
      console.log(`Watching: ${path}`);
      fs.watch(path, { encoding: 'utf8' }, (eventType, filename) => {
        function wait(release) {
          if (pending[path][filename]) {release();return;}
          pending[path][filename] = true;
          release();
          const filePath = item.isFile() ? path : `${path}/${filename}`.replace(/\/{2,}/g, '/');
          fs.stat(filePath, function (err, stat) {
            stat.name = filePath;
            if (stat.isDirectory() && !dirs[stat.name]) {
              dirs[stat.name] = true;
              watch(stat);
            } else if (stat.isFile()) {
              readFile(stat);
            }
            mutex.acquire().then((release) => {
                pending[path][filename] = false;release();})
          });
        }

        mutex.acquire().then(wait);
      });
      if (item.isDirectory()) {
        runAllFiles(path);
      } else if (item.isFile()) {
        readFile(item);
      }
    }

    this.add = function (fileOdir) {
      const stat = fs.stat(fileOdir, function(err, stats) {
        stats.name = fileOdir;
        if (stats.isDirectory()) {
          fileOdir = fileOdir.trim().replace(/^(.*?)\/*$/, '$1');
          runAllFiles(fileOdir);
          watch(stats);
        } else if (stats.isFile()){
          watch(stats);
        }
      });
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
      if (after && after !== firstLine && after.trim().match(/^\.\/.*$/)) {
          if (afterFiles[after.trim()] === undefined) afterFiles[after] = [];
          afterFiles[after.trim()].push(instance);
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
  return shell.test('-f', filename, {silent: true});
}

function jsBundler(filename, contents) {
  if (!fileExistes(filename)) {
    delete jsFiles[filename];
    delete allJsFiles[filename];
    delete afterFiles[filename];
  } else if (allJsFiles[filename]) {
    allJsFiles[filename].updateContents(contents);
  } else {
    new JsFile(filename, contents);
  }
}

function writeIndexJs() {
  let bundle = 'let CE = function () {\nconst afterLoad = []\n';

  function addAfterFiles(filename) {
    if (afterFiles[filename]) {
      afterFiles[filename].forEach((child, i) => {
        if (child && child.contents) {
          bundle += child.contents;
          addAfterFiles(child.filename);
        }
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
  const exposed = '{safeInnerHtml, textToHtml, dg, KeyShortCut, afterLoad, $t, Request, EPNTS, User, Form, Expl, HoverResources, properties}';
  bundle += `\nreturn ${exposed};\n}\nCE = CE()\nCE.afterLoad.forEach((item) => {item();});`;
  console.log('Writing ./index.js');
  fs.writeFile('./index.js', bundle, () => {});
}

function compHtml(filename, contents) {
  if (!filename) return;
  new $t(contents, filename.replace(/^.\/html\/(.*)\.html$/, '$1'));
}

function updateTemplates() {
  try {
    shell.touch(fileDumpLoc);
    console.log('Writing file', fileDumpLoc)
    fs.writeFileSync(fileDumpLoc, '// ./src/index/services/$t.js\n' + $t.dumpTemplates());
  } catch (e) {
    console.log(e);
  }
}


function compCss(filename, contents) {
  if (!filename) return;
  new CssFile(filename, contents);
}

function updateCss() {
  console.log('Writing', cssDumpLoc);
  fs.writeFileSync(cssDumpLoc, '// ./src/index/css.js\n' + CssFile.dump());
}

new Watcher(compHtml, updateTemplates).add('./html');
new Watcher(compCss, updateCss).add('./css/');
new Watcher(jsBundler, writeIndexJs).add('./constants/global.js')
                      .add('./bin/debug-gui-client.js')
                      .add('./src/index/')
                      .add('./bin/$css.js')
                      .add('./bin/$templates.js')
                      .add('./bin/EPNTS.js');

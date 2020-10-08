const fs = require('fs');
const shell = require('shelljs');
const $t = require('./src/index/$t.js').$t;
const RegArr = require('./src/index/reg-arr.js').RegArr;
console.log(RegArr);
const multiRunBuffer = 2000;
const fileDumpLoc = './bin/$templates.js';

class Watcher {
  constructor(func) {
    const directories = [];
    const isFile = {};
    function readFile(filename) {
      function read(err, contents) {
        if (err) {
          console.error(err);
        } else {
          console.log('ran file: ', `${filename}`)
          func(filename, contents);
        }
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
      isFile[fileOdir] = shell.exec(`[ -f '${fileOdir}' ] && echo true`, {silent: true}).stdout
      runAllFiles(fileOdir);
      watch(fileOdir);
      watchDirectories(fileOdir);
      return this;
    }
  }
}

const jsFiles = {};
class JsFile {
  constructor(filename, contents) {
    this.filename = filename;
    this.contents = contents;
    jsFiles[this.filename] = this;
  }
}
function dummy() {};
function jsBundler(filename, contents) {
  new JsFile(filename, contents);
  let bundle = 'let CE = function () {\nconst afterLoad = []\n';
  Object.values(jsFiles).forEach((item, i) => {
    bundle += item.contents;
  });
  bundle += '\nafterLoad.forEach((item) => {item();});\n}\nCE = CE()';
  fs.writeFile('./index.js', bundle, dummy);
}

function compHtml(filename, contents) {
  if (!filename) return;
  new $t(contents, filename.replace(/^.\/html\/(.*)\.html$/, '$1'));
  try {
    shell.touch(fileDumpLoc);
    console.log('writing file', filename)
    fs.writeFileSync(fileDumpLoc, $t.dumpTemplates());
  } catch (e) {
    console.log(e);
  }
}

new Watcher(compHtml).add('./html');
new Watcher(jsBundler).add('./src/index/')
                      .add('./bin/$templates.js')
                      .add('./json/test-words.js')
                      .add('./constants/global.js');

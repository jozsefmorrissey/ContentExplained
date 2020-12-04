const fs = require('fs');
const shell = require('shelljs');
const { Mutex, Semaphore } = require('async-mutex');

const { EPNTS } = require('./bin/EPNTS');
const env = process.argv[2];
const host = EPNTS._envs[env];


shell.cat('./src/index/ExprDef.js', './src/index/services/\\$t.js')
    .to('./building/bin/builder.js');

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


class Watcher {
  constructor(onChange, onUpdate) {
    const largNumber = Number.MAX_SAFE_INTEGER;
    const semaphore = new Semaphore(largNumber);
    const mutex = new Mutex();
    const positions = {};
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

    let position = 0;
    this.add = function (fileOdir) {
      const stat = fs.stat(fileOdir, function(err, stats) {
        stats.name = fileOdir;
        if (stats.isDirectory() || stats.isFile()){
          fileOdir = fileOdir.trim().replace(/^(.*?)\/*$/, '$1');
          positions[fileOdir] = position++;
          watch(stats);
        }
      });
      return this;
    }
  }
}

const { HtmlBundler } = require('./building/bundlers/html.js');
const { CssBundler } = require('./building/bundlers/css.js');
const { JsBundler } = require('./building/bundlers/js.js');

const htmlDumpLoc = './bin/$templates.js';
const cssDumpLoc = './bin/$css.js';

const htmlBundler = new HtmlBundler(htmlDumpLoc);
const cssBundler = new CssBundler(cssDumpLoc);
const ceJsBundler = new JsBundler('CE', [])
const settingJsBundler = new JsBundler('Settings', [])
const appMenuJsBundler = new JsBundler('AppMenu', [])



new Watcher(htmlBundler.change, htmlBundler.write).add('./html');
new Watcher(cssBundler.change, cssBundler.write).add('./css/');
new Watcher(ceJsBundler.change, ceJsBundler.write).add('./constants/global.js')
                      .add('./bin/debug-gui-client.js')
                      .add('./src/index/')
                      .add('./bin/$css.js')
                      .add('./bin/$templates.js')
                      .add('./bin/EPNTS.js');

new Watcher(settingJsBundler.change, settingJsBundler.write)
                            .add('./src/index/properties.js')
                            .add('./bin/EPNTS.js')
                            .add('./src/index/key-short-cut.js')
                            .add('./src/index/services/user.js')
                            .add('./src/index/request.js')
                            .add('./src/index/services/form.js')
                            .add('./src/index/ExprDef.js')
                            .add('./src/index/services/$t.js')
                            .add('./bin/$templates.js')
                            .add('./src/index/dom-tools.js')
                            .add('./src/settings');

new Watcher(appMenuJsBundler.change, appMenuJsBundler.write)
                            .add('./src/index/properties.js')
                            .add('./src/index/ExprDef.js')
                            .add('./src/index/services/$t.js')
                            .add('./bin/$templates.js')
                            .add('./src/index/dom-tools.js')
                            .add('./src/app-menu/state.js');

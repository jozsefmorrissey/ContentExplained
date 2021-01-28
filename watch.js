const fs = require('fs');
const shell = require('shelljs');
const { Mutex, Semaphore } = require('async-mutex');

const { EPNTS } = require('./bin/hacky/EPNTS');
const env = process.argv[2];
const host = EPNTS._envs[env];


shell.cat('./src/index/ExprDef.js', './src/index/services/\\$t.js')
    .to('./building/bin/builder.js');

function HachyImport(url, dest) {
  const curlCmd = `curl -X GET --insecure '${url}'`;
  console.log(curlCmd)
  const code = shell.exec(curlCmd, {silent: true}).stdout;
  if (code !== '') {
    fs.writeFile(`./bin/hacky/${dest}`, code, () =>
        console.warn(`HackyImport: \n\t./bin/hacky/${dest}\n\t${url}`));
  }
}

HachyImport(`${host}/EPNTS/${env}`, 'EPNTS.js');
HachyImport('https://localhost:3001/debug-gui/js/debug-gui-client.js', 'debug-gui-client.js');
HachyImport('https://localhost:3001/debug-gui/js/debug-gui.js', 'debug-gui.js');
HachyImport('https://localhost:3001/js/short-cut-container.js', 'short-cut-container.js');


class Watcher {
  constructor(onChange, onUpdate) {
    const largNumber = Number.MAX_SAFE_INTEGER;
    const semaphore = new Semaphore(largNumber);
    const mutex = new Mutex();
    const positions = {};
    function readFile(file, position) {
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
          console.log('ran file: ', `${file.name} - ${position}`);
          onChange(file.name, contents, position);
          setTimeout(notify, 300);
        }
        fs.readFile(file.name, 'utf8', read);
      });
    }

    function runAllFiles(watchDir, position) {
      watchDir = `${watchDir}/`.replace(/\/{2,}/g, '/');
      const files = shell.ls('-ld', `${watchDir}*`);
      for (let index = 0; index < files.length; index += 1) {
        const item = files[index];
        if (item.isFile()) {
          readFile(item, position);
        } else if (item.isDirectory() && !dirs[item.name]) {
          dirs[item.name] = true;
          positions[item.name] = position;
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
      console.log(`Watching: ${path} - ${positions[item.name]}`);
      fs.watch(path, { encoding: 'utf8' }, (eventType, filename) => {
        function wait(release) {
          if (pending[path][filename]) {release();return;}
          pending[path][filename] = true;
          release();
          const filePath = item.isFile() ? path : `${path}/${filename}`.replace(/\/{2,}/g, '/');
          fs.stat(filePath, function (err, stat) {
            if (err) {console.log(err); return;}
            stat.name = filePath;
            if (stat.isDirectory() && !dirs[stat.name]) {
              dirs[stat.name] = true;
              positions[stat.name] = positions[item.name];
              watch(stat);
            } else if (stat.isFile()) {
              readFile(stat, positions[item.name]);
            }
            mutex.acquire().then((release) => {
                pending[path][filename] = false;release();})
          });
        }

        mutex.acquire().then(wait);
      });
      if (item.isDirectory()) {
        runAllFiles(path, positions[item.name]);
      } else if (item.isFile()) {
        readFile(item, positions[item.name]);
      }
    }

    let position = 0;
    this.add = function (fileOdir) {
      fileOdir = fileOdir.trim().replace(/^(.*?)\/*$/, '$1');
      positions[fileOdir] = position++;
      const stat = fs.stat(fileOdir, function(err, stats) {
        console.log(fileOdir)
        stats.name = fileOdir;
        if (stats.isDirectory() || stats.isFile()){
          watch(stats);
        }
      });
      return this;
    }
    this.positions = positions;
  }
}

const { HtmlBundler } = require('./building/bundlers/html.js');
const { CssBundler } = require('./building/bundlers/css.js');
const { JsBundler } = require('./building/bundlers/js.js');

const htmlDumpLoc = './bin/dump/$templates.js';
const cssDumpLoc = './bin/dump/$css.js';

const htmlBundler = new HtmlBundler(htmlDumpLoc);
const cssBundler = new CssBundler(cssDumpLoc);
const ceJsBundler = new JsBundler('bin/CE', []);
const backgroundJsBundler = new JsBundler('bin/Background', []);
const settingJsBundler = new JsBundler('bin/Settings', []);
const appMenuJsBundler = new JsBundler('bin/AppMenu', []);



new Watcher(htmlBundler.change, htmlBundler.write).add('./html');
new Watcher(cssBundler.change, cssBundler.write).add('./bin/css/');
new Watcher(backgroundJsBundler.change, backgroundJsBundler.write)
                      .add('./src/manual/background.js');
new Watcher(ceJsBundler.change, ceJsBundler.write)
                      .add('./src/global.js')
                      .add('./bin/hacky/debug-gui-client.js')
                      .add('./constants/global.js')
                      .add('./bin/hacky/EPNTS.js')
                      .add('./src/index/')
                      .add('./bin/dump/$css.js')
                      .add('./bin/dump/$templates.js');

new Watcher(settingJsBundler.change, settingJsBundler.write)
                            .add('./src/global.js')
                            .add('./bin/hacky/debug-gui-client.js')
                            .add('./constants/global.js')
                            .add('./src/index/properties.js')
                            .add('./src/index/request.js')
                            .add('./bin/hacky/EPNTS.js')
                            .add('./src/index/key-short-cut.js')
                            .add('./src/index/services/user.js')
                            .add('./src/index/services/form.js')
                            .add('./src/index/ExprDef.js')
                            .add('./src/index/services/$t.js')
                            .add('./bin/dump/$templates.js')
                            .add('./src/index/dom-tools.js')
                            .add('./src/index/custom-event.js')
                            .add('./src/index/events/events.js')
                            .add('./src/settings');

new Watcher(appMenuJsBundler.change, appMenuJsBundler.write)
                            .add('./src/global.js')
                            .add('./bin/hacky/debug-gui-client.js')
                            .add('./src/index/properties.js')
                            .add('./src/index/ExprDef.js')
                            .add('./src/index/services/$t.js')
                            .add('./bin/dump/$templates.js')
                            .add('./src/index/dom-tools.js')
                            .add('./src/app-menu/state.js');

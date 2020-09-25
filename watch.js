const fs = require('fs');
const shell = require('shelljs');
const $t = require('./src/$t.js').$t;

const directories = [];
const multiRunBuffer = 2000;
const fileDumpLoc = './bin/$templates.js';

let lastRun = new Date().getTime();
let waiting = false;
function run(filename) {
  return function () {
    if (!filename) return;
    $t(undefined, shell.cat(filename), filename.replace(/^.\/html\/(.*)\.html$/, '$1'));
    if (lastRun < new Date().getTime() - multiRunBuffer) {
      try {
        shell.touch(fileDumpLoc);
        fs.writeFileSync(fileDumpLoc, $t.dumpTemplates());
      } catch (e) {
        console.log(e);
      }
      lastRun = new Date().getTime();
      waiting = false;
      console.log('ran1')
    } else if (!waiting) {
      waiting = true;
      setTimeout(run(filename), multiRunBuffer);
    }
  }
}

function runAllFiles(watchDir) {
  const files = shell.exec(`find ${watchDir} -type f`, {silent: true}).split('\n');
  for (let index = 0; index < files.length; index += 1) {
    run(files[index])();
  }
}

function watchDirectory(watchDir) {
  fs.watch(watchDir, { encoding: 'utf8' }, (eventType, filename) => {
    console.log(filename)
    watchDirectories();
    run(`${watchDir}/${filename}`)();
  });
}

function watchDirectories(watchDir) {
  const dirs = shell.exec(`find ${watchDir} -type d`, {silent: true}).split('\n');
  for (let index = 0; index < dirs.length; index += 1) {
    const dir = dirs[index];
    if (dir && directories.indexOf(dir) === -1) {
      directories.push(dir);
      console.log('watching ' + dir);
      watchDirectory(dir);
    }
  }
}

runAllFiles('./html');
watchDirectories('./html');

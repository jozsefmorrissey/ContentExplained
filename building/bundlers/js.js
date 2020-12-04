
const fs = require('fs');
const shell = require('shelljs');
const { Bundler } = require('../bundler');

class JsBundler extends Bundler {
  constructor(id, externals) {
    super();
    externals.push('afterLoad');
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
            afterFiles[after][instance.filename] = undefined;
          }
          after = firstLine.replace(/^\s*\/\/\s*(.*)\s*$/, '$1');
          if (after && after !== firstLine && after.trim().match(/^\.\/.*$/)) {
              after = after.trim();
              if (afterFiles[after] === undefined) afterFiles[after] = {};
              afterFiles[after][instance.filename] = instance;
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

    function change(filename, contents) {
      if (!fileExistes(filename)) {
        delete jsFiles[filename];
        delete allJsFiles[filename];
      } else if (allJsFiles[filename]) {
        allJsFiles[filename].updateContents(contents);
      } else {
        new JsFile(filename, contents);
      }
    }

    function sortFileNames (jsF1, jsF2) {
      return jsF1.filename.match(/[^.]{2,}?\//g).length -
        jsF2.filename.match(/[^.]{2,}?\//g).length;
    }

    function write() {
      let bundle = `let ${id} = function () {\nconst afterLoad = []\n`;

      function addAfterFiles(filename) {
        if (afterFiles[filename]) {
          Object.values(afterFiles[filename]).forEach((child, i) => {
            if (child && child.contents) {
              console.log(filename, child.filename)
              bundle += child.contents;
              addAfterFiles(child.filename);
            }
          });
        }
      }
      Object.values(jsFiles).sort(sortFileNames).forEach((item, i) => {
            bundle += item.contents;
            console.log(item.filename)
            addAfterFiles(item.filename);
      });
      bundle += `\nreturn {${externals.join()}};\n}\n${id} = ${id}()\n${id}.afterLoad.forEach((item) => {item();});`;
      console.log(`Writing ./${id}.js`);
      fs.writeFile(`./${id}.js`, bundle, () => {});
    }

    this.write = write;
    this.change = change;
  }
}

exports.JsBundler = JsBundler;

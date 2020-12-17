
class Css {
  constructor(identifier, value) {
    this.identifier = identifier.trim().replace(/\s{1,}/g, ' ');
    this.string = value.trim().replace(/\s{1,}/g, ' ');
    this.properties = [];
    const addProp = (match, key, value) => this.properties.push({key, value});
    this.string.replace(Css.propReg, addProp);
    this.apply = function () {
      const matchingElems = document.querySelectorAll(this.identifier);
      for (let index = 0; index < matchingElems.length; index += 1) {
        const elem = matchingElems[index];
        for (let pIndex = 0; pIndex < this.properties.length; pIndex += 1) {
          const prop = this.properties[pIndex];
          elem.style[prop.key] = prop.value;
        }
      }
    }
  }
}
Css.propReg = /([a-zA-Z-0-9]{1,}):\s*([a-zA-Z-0-9%\(\),.\s]{1,})/g;

class CssFile {
  constructor(filename, string) {
    string = string.replace(/\/\/.*/g, '')
                  .replace(/\n/g, ' ')
                  .replace(/\/\*.*?\*\//, '');
    const reg = /([^{]*?)\s*?\{([^}]*)\}/;
    CssFile.files[filename] = this;
    this.elems = [];
    this.filename = filename.replace(/(\.\/|\/|)css\/(.{1,})\.css/g, '$2');
    this.rawElems = string.match(new RegExp(reg, 'g'));
    for (let index = 0; index < this.rawElems.length; index += 1) {
      const rawElem = this.rawElems[index].match(reg);
      this.elems.push(new Css(rawElem[1], rawElem[2]));
    }

    this.apply = function () {
      for (let index = 0; index < this.elems.length; index += 1) {
        this.elems[index].apply();
      }
    }

    this.dump = function () {
      return `new CssFile('${this.filename}', '${string.replace(/'/, '\\\'')}');\n\n`;
    }
  }
}

CssFile.files = {};

CssFile.apply = function () {
  const args = Array.from(arguments);
  const ids = Object.keys(CssFile.files);
  for (let index = 0; index < ids.length; index += 1) {
    const cssFile = CssFile.files[ids[index]];
    if (args.length === 0 || args.indexOf(cssFile.filename) !== -1) {
      cssFile.apply();
    }
  }
}

CssFile.dump = function () {
  let dumpStr = '';
  const args = Array.from(arguments);
  const files = Object.values(CssFile.files);
  for (let index = 0; index < files.length; index += 1) {
    const cssFile = files[index];
    if (args.length === 0 || args.indexOf(cssFile.filename) !== -1) {
      dumpStr += cssFile.dump();
    }
  }
  return dumpStr;
}

function cssAfterLoad() {
  applyCss = CssFile.apply;
}

try {
  afterLoad.push(cssAfterLoad);
} catch (e) {}

try{
	exports.CssFile = CssFile;
} catch (e) {}

class Css {
  constructor(identifier, value) {
    this.identifier = identifier.trim().replace(/\s{1,}/g, ' ');
    this.value = value.trim().replace(/\s{1,}/g, ' ');
    this.apply = function () {
      const matchingElems = document.querySelectorAll(this.identifier);
      for (let index = 0; index < matchingElems.length; index += 1) {
        matchingElems[index].style = this.value + matchingElems[index].style;
      }
    }
  }
}

class CssFile {
  constructor(filename, string) {
    string = string.replace(/\/\/.*/g, '')
                  .replace(/\n/g, ' ')
                  .replace(/\/\*.*?\*\//, '');
    const reg = /([^{]*?)\s*?\{([^}]*)\}/;
    CssFile.files.push(this);
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

CssFile.files = [];

CssFile.apply = function () {
  for (let index = 0; index < CssFile.files.length; index += 1) {
    const cssFile = CssFile.files[index];
    if (arguments.length === 0 || arguments.indexOf(cssFile.filename) !== -1) {
      cssFile.apply();
    }
  }
}

CssFile.dump = function () {
  let dumpStr = '';
  for (let index = 0; index < CssFile.files.length; index += 1) {
    const cssFile = CssFile.files[index];
    if (arguments.length === 0 || arguments.indexOf(cssFile.filename) !== -1) {
      dumpStr += cssFile.dump();
    }
  }
  return dumpStr;
}

function cssAfterLoad() {
  CE.applyCss = CssFile.apply;
}

try {
  afterLoad.push(cssAfterLoad);
} catch (e) {}

try{
	exports.CssFile = CssFile;
} catch (e) {}

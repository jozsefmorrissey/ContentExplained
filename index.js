let CE = function () {
const afterLoad = []
const UI_ID = 'ce-ui';
const UI = new ShortCutCointainer(UI_ID, ['c', 'e'], '<h1>Hello ContentExplained</h1>');

const MERRIAM_WEB_DEF_CNT_ID = 'ce-merriam-webster-def-cnt';
const MERRIAM_WEB_SUG_CNT_ID = 'ce-merriam-webster-suggestion-cnt';
const HISTORY_CNT_ID = 'ce-history-cnt';
const ADD_EDITOR_ID = 'ce-add-editor-id';
const CONTEXT_EXPLANATION_CNT_ID = 'ce-content-explanation-cnt';
const WIKI_CNT_ID = 'ce-wikapedia-cnt';
const RAW_TEXT_CNT_ID = 'ce-raw-text-cnt';

const CE_HOST = 'https://localhost:3001';

const URL_MERRIAM_REQ = `${CE_HOST}/content-explained/merriam/webster/`;

const URL_USER_LOGIN = `${CE_HOST}/content-explained/user/login/`;
const URL_USER_ADD = `${CE_HOST}/content-explained/user/add/`;
const URL_USER_GET = `${CE_HOST}/content-explained/user/get/`;
const URL_USER_SYNC = `${CE_HOST}/content-explained/user/sync/`;

const URL_IMAGE_LOGO = `${CE_HOST}/images/icons/logo.png`;
const URL_IMAGE_MERRIAM = `${CE_HOST}/images/icons/Merriam-Webster.png`;
const URL_IMAGE_WIKI = `${CE_HOST}/images/icons/wikapedia.png`;
const URL_IMAGE_TXT = `${CE_HOST}/images/icons/txt.png`;

const URL_CE_GET = `${CE_HOST}/content-explained/`;
const URL_CE_LIKE = `${CE_HOST}/content-explained/like/`;
const URL_CE_DISLIKE = `${CE_HOST}/content-explained/dislike/`;
const data = {
  "this": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "the person, thing, or idea that is present or near in place, time, or thought or that has just been mentioned "
  	}],
  "page": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "the block of information found at a single World Wide Web address"
  	}],
  "is": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "present tense third-person singular of be"
  	}],
  "created": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "to produce or bring about by a course of action or behavior"
  	}],
  "from": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "used as a function word to indicate a starting point of a physical movement or a starting point in measuring or reckoning or in a statement of limits"
  	}],
  "http": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "hypertext transfer protocol; hypertext transport protocol"
  	}],
  "status": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "state or condition with respect to circumstances"
  	}],
  "information": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "the attribute inherent in and communicated by one of two or more alternative sequences or arrangements of something (such as nucleotides in DNA or binary digits in a computer program) that produce specific effects"
  	}],
  "found": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "having all usual, standard, or reasonably expected equipment"
  	}],
  "at": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "used as a function word to indicate the goal of an indicated or implied action"
  	}],
  "ietf.org": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "A website not for the faint of heart"
  	}],
  "and": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "used as a function word to indicate connection or addition especially of items within the same class or type —used to join sentence elements of the same grammatical rank or function"
  	}],
  "wikipedia": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "croud sourced information, thats all linked up"
  	}],
  "click": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "to change or move through (channels) especially by pushing buttons on a remote control"
  	}],
  "on": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "used as a function word to indicate position in contact with and supported"
  	}],
  "category heading": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "a division within a system of classification "
  	}],
  "or": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "the equivalent or substitutive character of two words or phrases"
  	}],
  "the": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "used as a function word to indicate that a following noun or noun equivalent is definite or has been previously specified by context or by circumstance"
  	}],
  "code": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "coded language : a word or phrase chosen in place of another word or phrase in order to communicate an attitude or meaning without stating it explicitly"
  },{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "a system of symbols (such as letters or numbers) used to represent assigned and often secret meanings"
	},{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "a system of signals or symbols for communication"
	},{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "a system of principles or rules"
	},{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "a systematic statement of a body of law "
	},{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "instructions for a computer (as within a piece of software)"
	}],
  "link": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "one of the standardized divisions of a surveyor's chain that is 7.92 inches (20.1 centimeters) long and serves as a measure of length"
  	}],
  "to": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "used as a function word to indicate movement or an action or condition suggestive of movement toward a place, person, or thing reached"
  	}],
  "read": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "to receive or take in the sense of (letters, symbols, etc.) especially by sight or touch"
  	}],
  "more": [{
  	"likes": 0,
  	"dislikes": 0,
  	"text": "to a greater or higher degree —often used with an adjective or adverb to form the comparative"
  	}],
}
Request = {
    onStateChange: function (success, failure) {
      return function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            var data = JSON.parse(this.responseText);
            if (success) {
              success(data);
            }
          } else if (failure) {
            failure(this);
          }
        }
      }
    },

    get: function (url, success, failure) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange =  Request.onStateChange(success, failure);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
      return xhr;
    },

    post: function (url, body, success, failure) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange =  Request.onStateChange(success, failure);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(body));
      return xhr;
    }
}

class Properties {
  constructor () {
    const properties = {};
    const updateFuncs = {};
    const instance = this;

    function notify(key) {
      const funcList = updateFuncs[key];
      for (let index = 0; funcList && index < funcList.length; index += 1) {
        funcList[index](properties[key]);
      }
    }

    this.set = function (key, value, storeIt) {
        properties[key] = value;
        if (storeIt) {
          const storeObj = {};
          storeObj[key] = value;
          chrome.storage.local.set(storeObj);
        } else {
          notify(key);
        }
    };

    this.get = function (key) {
      if (arguments.length === 1) {
        return properties[key]
      }
      const retObj = {};
      for (let index = 0; index < arguments.length; index += 1) {
        key = arguments[index];
        retObj[key] = properties[key];
      }
    };

    function storageUpdate (values) {
      const keys = Object.keys(values);
      for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];
        const value = values[key];
        if (value.newValue) {
          instance.set(key, values[key].newValue);
        } else {
          instance.set(key, value);
        }
      }
    }

    function keyDefinitionCheck(key) {
      if (key === undefined) {
        throw new Error('key must be defined');
      }
    }

    this.onUpdate = function (key, func) {
      keyDefinitionCheck(key);
      if ((typeof func) !== 'function') throw new Error('update function must be defined');
      if (updateFuncs[key] === undefined) {
        updateFuncs[key] = [];
      }
      updateFuncs[key].push(func);
      func(properties[key])
    }

    chrome.storage.local.get(null, storageUpdate);
    chrome.storage.onChanged.addListener(storageUpdate);
  }
}

afterLoad.push(function () {CE.properties = new Properties();})
var SHORT_CUT_CONTAINERS;

function ShortCutCointainer(id, keys, html, config) {
  var SPACER_ID = 'ssc-html-spacer';
  var OPEN = 'ssc-open';
  var CLOSE = 'ssc-close';
  var currentKeys = {};
  var size = 200;
  var container;
  var resizeBar;

  function resizeBarId() {
    return 'ssc-resizeBar-' + id;
  }
  function htmlContainerId() {
    return 'ssc-html-container-' + id;
  }

  function getResizeBarCss() {
    return 'border-top-style: double;' +
      'border-top-width: 10px;' +
      'cursor: row-resize;' +
      'border-color: rgb(22, 44, 166);';
  }

  function createResizeBar() {
    resizeBar = document.createElement('div');
    resizeBar.id = resizeBarId();
    resizeBar.style.cssText = getResizeBarCss();
    return resizeBar;
  }

  function createContainer(html) {
    container = document.createElement('div');
    container.id = htmlContainerId();
    container.innerHTML = html;
    container.style.cssText = 'max-height: ' + size + 'px; overflow: scroll;';
    return container;
  }

  function padBottom(height) {
    var spacer = document.getElementById(SPACER_ID);
    if (spacer) {
      spacer.remove();
    }
    spacer = document.createElement('div');
    spacer.id = SPACER_ID;
    spacer.style = 'height: ' + height;
    document.querySelector('body').append(spacer);
  }

  var noHeight = 'display: block;' +
    'width: 100%;' +
    'margin: 0;' +
    'padding: 0;' +
    'position: fixed;' +
    'width: 100%;' +
    'bottom: 0;' +
    'z-index: 10000;' +
    'left: 0;' +
    'background-color: white;';


    function resize(event) {
      if (shouldResize > 0) {
        var minHeight = 80;
        var maxHeight = window.innerHeight - 50;
        let dx = window.innerHeight - event.clientY;
        dx = dx < minHeight ? minHeight : dx;
        dx = dx > maxHeight ? maxHeight : dx;
        var height = dx + 'px;';
        container.style.cssText = 'overflow: scroll; max-height: ' + height;
        ssc.style.cssText  = noHeight + 'height: ' + height;
        padBottom(height);
      }
      // return event.target.height;
    }

  var shouldResize = 0;
  function mouseup(e) {
    shouldResize = 0;
    e.stopPropagation();
  }

  function mousedown(e) {
    var barPos = resizeBar.getBoundingClientRect().top;
    let mPos = e.clientY;
    if (barPos > mPos - 10 && barPos < mPos + 10) {
      shouldResize++;
    }
  }

  function show() {
    var ce = document.getElementById(id);
    ce.style.display = 'block';
    var height = ce.style.height;
    padBottom(height);
    triggerEvent(OPEN, id);
    isShowing = true;
  }

  function hide() {
    var ce = document.getElementById(id);
    ce.style.display = 'none';
    padBottom('0px;');
    triggerEvent(CLOSE, id);
    isShowing = false;
  }

  let isShowing = false;
  function toggleContentEditor() {
        if (isShowing) {
          hide();
        } else {
          show();
        }
  }

  function isOpen() {
    return isShowing;
  }

  function keyDownListener(e) {
      currentKeys[e.key] = true;
      if (shouldToggle()){
        toggleContentEditor();
      }
  }

  function shouldToggle() {
    for (let index = 0; index < keys.length; index += 1) {
      if (!currentKeys[keys[index]]) {
        return false;
      }
    }
    return true;
  }

  function onOpen(id) {
    console.log(id);
  }


  function triggerEvent(name, id) {
    var event; // The custom event that will be created

    if (document.createEvent) {
      event = document.createEvent("HTMLEvents");
      event.initEvent(name, true, true);
    } else {
      event = document.createEventObject();
      event.eventType = name;
    }

    event.eventName = name;

    if (document.createEvent) {
      ssc.dispatchEvent(event);
    } else {
      ssc.fireEvent("on" + event.eventType, event);
    }
  }

  function onLoad() {
    document.body.append(ssc);
  }

  function keyUpListener(e) {
    delete currentKeys[e.key];
  }

  function innerHtml(html) {
    container.innerHTML = html;
  }

  function mouseupOnRandDescendents(e, count) {
    var mouseupEvent = new MouseEvent('mouseup', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });

    function click(elem) {
      return function () {
        console.log('triggering mouseup event: ', elem)
        elem.dispatchEvent(mouseupEvent);
      };
    }
    const decendents = e.querySelectorAll('*');
    for (let c = 0; c < count; c += 1) {
       const index = Math.floor(Math.random() * decendents.length + 1);
       if (index === decendents.length) {
         setTimeout(click(e), 5 * c);
       } else {
         setTimeout(click(decendents[index]), 5 * c);
       }
    }
  }

  var ssc = document.createElement('div');
  ssc.id = id;
  ssc.append(createResizeBar());
  ssc.append(createContainer(html));
  ssc.style.cssText = noHeight + 'height: ' + size + 'px;';
  if (!config || config.open !== true) {
    ssc.style.display = 'none';
  }
  ssc.addEventListener(OPEN, onOpen);
  ssc.addEventListener('mouseup', mouseup);
  ssc.addEventListener('mousedown', mousedown);
  onLoad();
  retObject = { innerHtml, mouseup, mousedown, resize, keyUpListener, keyDownListener,
                show, hide, isOpen };
  if (SHORT_CUT_CONTAINERS === undefined) SHORT_CUT_CONTAINERS = [];
  SHORT_CUT_CONTAINERS.push(retObject);
  window.onmouseup = hide;
  return retObject;
}

function callOnAll(func, e) {
  for (let index = 0; index < SHORT_CUT_CONTAINERS.length; index += 1) {
    SHORT_CUT_CONTAINERS[index][func](e);
  }
}

function resize(e) { callOnAll('resize', e); }
function keyUpListener(e) { callOnAll('keyUpListener', e); }
function keyDownListener(e) { callOnAll('keyDownListener', e); }

window.onmousemove = resize;
window.onkeyup = keyUpListener;
window.onkeydown = keyDownListener;

function onLoad() {
  let containers = document.querySelectorAll('short-cut-container');
  for (let index = 0; index < containers.length; index += 1) {
    var elem = containers[index];
    if (elem.getAttribute('keys'))
    var keys = elem.getAttribute('keys').split(',')
    id = elem.id || 'ssc-' + index;
    html = elem.innerHTML;
    ShortCutCointainer(id, keys, html);
    elem.parentNode.removeChild(elem);
  }
}

afterLoad.push(onLoad);
class Css {
  constructor(identifier, value) {
    this.identifier = identifier.trim().replace(/\s{1,}/g, ' ');
    this.value = value.trim().replace(/\s{1,}/g, ' ');
    this.apply = function () {
      console.log('here')
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
// ./src/index/css.js
new CssFile('hover-resource', 'hover-resource {     background-color:     #fde66d;     border-radius: 2pt; }  hover-resource:hover {   font-weight: bolder; }  .arrow-up {   width: 0;   height: 0;   border-left: 10px solid transparent;   border-right: 10px solid transparent;    border-bottom: 15px solid black; }  .arrow-down {   width: 0;   height: 0;   border-left: 20px solid transparent;   border-right: 20px solid transparent;    border-top: 20px solid #f00; }  .arrow-right {   width: 0;   height: 0;   border-top: 60px solid transparent;   border-bottom: 60px solid transparent;    border-left: 60px solid green; }  .arrow-left {   width: 0;   height: 0;   border-top: 10px solid transparent;   border-bottom: 10px solid transparent;    border-right:10px solid blue; }    .pop-out {   border: 1px solid;   border-radius: 5pt;   padding: 10px;   box-shadow: 3px 3px 6px black, 3px 3px 6px grey, 3px 3px 6px lightgrey; } ');

new CssFile('text-to-html', '#raw-text-input {   min-height: 100vh;   width: 100%;   -webkit-box-sizing: border-box;    -moz-box-sizing: border-box;    /* Firefox, other Gecko */   box-sizing: border-box; } ');

new CssFile('settings', ' body {   height: 100%;   position: absolute;   margin: 0;   width: 100%; }  .ce-setting-cnt {   display: inline-flex;   height: 100%;   width: 100%; } #ce-setting-list {   list-style-type: none;   padding: 5pt; }  #ce-setting-list-cnt {   background-color: blue;   position: fixed;   height: 100vh; }  .ce-setting-list-item {   font-weight: 600;   font-size: medium;   color: aliceblue;   margin: 10pt;   padding: 0; } ');

new CssFile('lookup', '.ce-tab-ctn {   text-align: center;   display: inline-flex;   width: 100%; }  .ce-lookup-cnt {   width: 100%; }  .ce-tab-list{   display: block;   list-style-type: none;   width: max-content;   margin: auto;   padding: 0;   margin: 0; }  .ce-tab-list > li {   padding: 10pt;   border-style: solid;   border-width: 1px;   border-radius: 10px;   margin: 2pt;   font-weight: bolder;   border-color: gray;   box-shadow: 1px 1px 2px black;   }  .ce-tab-list > .active {     background-color: gainsboro;     box-shadow: 0 0 0 black;   }  .ce-tab-ctn > div {   display: none; }  .ce-expl-card {   width: 90%;   display: flex;   position: relative;   border: solid;   text-align: left;   border-width: 1px;   border-radius: 10px;   margin: 5px 20px;   border-color: grey;   box-shadow: 1px 1px 1px grey; }  .ce-expl-rating-column {   position: relative;   width: 50pt;   min-height: 70pt;   float: left;   padding: 2pt;   border-right: ridge;   border-color: black;   border-width: 1pt; }  .ce-expl-rating-cnt {   transform: translateY(-50%);   position: absolute;   top: 50%; }  .ce-expl-voteup-button {   border-radius: 30pt 30pt 2pt 2pt!important;   font-weight: bold;   width: -webkit-fill-available;   background-color: #76ff76;   border-color: green; }  .ce-expl-votedown-button {   border-radius: 2pt 2pt 30pt 30pt;   font-weight: bold;   width: -webkit-fill-available;   background-color: #ff6565;   border-color: red; }  .ce-expl-author-cnt {   float: right;   padding: 2pt;   border-left: ridge;   border-color: black;   border-width: 1pt; }  .ce-expl {   padding: 2pt;   width: inherit;   overflow-wrap: break-word; }  .ce-expl-card > .tags {   font-size: small;   color: grey; }    .ce-wiki-frame {      width: -webkit-fill-available;        height: -webkit-fill-available;   }    #ce-tag-input {       width: 50%;     margin-bottom: 10pt;     padding: 2pt;     border-radius: 10pt;     border-width: 1px;     border-color: gainsboro;   }    .ce-btn {     box-shadow: 1px 1px 1px grey;     border-style: solid;     border-width: 1px;     margin: 10px;     border-radius: 20px;     padding: 5px 15px;     background-color: white; }  .ce-key-cnt {   display: inline-flex; }  .ce-add-btn {     padding: 0 8px;     font-weight: bolder;     font-size: x-large;     color: green;     border-color: green;     box-shadow: 1px 1px 1px green; }  .lookup-img {   width: 40pt; }  .ce-merriam-expl-card {   width: 90%;   position: relative;   border: solid;   border-width: 1px;   border-radius: 10px;   margin: auto;   border-color: grey;   box-shadow: 1px 1px 1px grey; }  .ce-merriam-expl {   text-align: left; }  .ce-merriam-expl-cnt {   width: fit-content;   margin: auto; }  .ce-margin {   margin: 3pt; }  .ce-linear-tab {   font-size: 12pt;   padding: 0pt 5pt;   border-style: ridge;   border-radius: 10pt;   margin: 1pt 1pt;   display: inline-block;   white-space: nowrap; }  .ce-inline-flex {   display: inline-flex; }  #merriam-webster-submission-cnt {   margin: 2pt;   text-align: center;   display: flex;   overflow: scroll; } ');

new CssFile('popup', '.ce-popup {   border: 1px solid;   border-radius: 5pt;   padding: 10px;   box-shadow: 3px 3px 6px black, 3px 3px 6px grey, 3px 3px 6px lightgrey; }  .ce-popup-shadow {  } ');

new CssFile('menu', 'menu {   display: grid;   padding: 5px; }  menuitem:hover {   background-color: #d8d8d8; } ');

function up(selector, node) {
    if (node.matches(selector)) {
        return node;
    } else {
        return lookUp(selector, node.parentNode);
    }
}


function down(selector, node) {
    function recurse (currNode, distance) {
      if (currNode.matches(selector)) {
        return { node: currNode, distance };
      } else {
        let found = { distance: Number.MAX_SAFE_INTEGER };
        for (let index = 0; index < currNode.children.length; index += 1) {
          distance++;
          const child = currNode.children[index];
          const maybe = recurse(child, distance);
          found = maybe && maybe.distance < found.distance ? maybe : found;
        }
        return found;
      }
    }
    return recurse(node, 0).node;
}

function closest(selector, node) {
  const visited = [];
  function recurse (currNode, distance) {
    let found = { distance: Number.MAX_SAFE_INTEGER };
    if (!currNode || (typeof currNode.matches) !== 'function') {
      return found;
    }
    visited.push(currNode);
    console.log('curr: ' + currNode);
    if (currNode.matches(selector)) {
      return { node: currNode, distance };
    } else {
      for (let index = 0; index < currNode.children.length; index += 1) {
        const child = currNode.children[index];
        if (visited.indexOf(child) === -1) {
          const maybe = recurse(child, distance + index + 1);
          found = maybe && maybe.distance < found.distance ? maybe : found;
        }
      }
      if (visited.indexOf(currNode.parentNode) === -1) {
        const maybe = recurse(currNode.parentNode, distance + 1);
        found = maybe && maybe.distance < found.distance ? maybe : found;
      }
      return found;
    }
  }

  return recurse(node, 0).node;
}

let idCount = 0;
class ExprDef {
  constructor(name, options, notify, stages, alwaysPossible) {
    this.id = idCount++;
    let id = this.id;
    let string;
    let modified = '';
    let start;
    let end;
    alwaysPossible = alwaysPossible ? alwaysPossible : [];
    stages = stages ? stages : {};
    let currStage = stages;

    function getRoutes(prefix, stage) {
      let routes = [];
      let keys = Object.keys(stage);
      for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];
        if (key !== '_meta') {
          let newPrefix;
          if (prefix) {
            newPrefix = `${prefix}.${key}`;
          } else {
            newPrefix = key;
          }
          const deepRoutes = getRoutes(newPrefix, stage[key]);
          if (deepRoutes.length > 0) {
            routes = routes.concat(deepRoutes);
          }
          if (stage[key]._meta && stage[key]._meta.end) {
            routes.push(newPrefix + '.end');
          }
          if (stage[key]._meta && stage[key]._meta.repeat) {
            routes.push(newPrefix + '.repeat');
          }
        }
      }
      return routes;
    }

    this.always = function () {
      for (let index = 0; index < arguments.length; index += 1) {
        alwaysPossible.push(arguments[index]);
      }
    };
    this.getAlways = function (exprDef) {return alwaysPossible;};

    this.allRoutes = function () {
      return getRoutes(null, stages);
    }

    function getNotice (exprDef) {
      let isInAlways = false;
      alwaysPossible.map(function (value) {if (value.getName() === exprDef.getName()) isInAlways = true;});
      if (isInAlways) return;
      if (!exprDef.closed()) {
        if (currStage[exprDef.getName()] === undefined) {
          throw new Error(`Invalid Stage Transition ${currStage._meta.expr.getName()} -> ${exprDef.getName()}\n${currStage._meta.expr.allRoutes()}`)
        }
        currStage = currStage[exprDef.getName()];
      }
    }
    this.getNotice = getNotice;

    function getName () {return name;};
    this.getName = getName;
    this.onClose = function (start, end) {
      return function (str, start, end) {
        if (notify) notify(this);
        options.onClose(str, start, end);
      }
    }

    function setMeta(targetNodes, attr, value) {
      return function () {
        for (let lIndex = 0; lIndex < targetNodes.length; lIndex += 1) {
          targetNodes[lIndex]._meta[attr] = value;
        }
      }
    }

    function then (targetNodes) {
      return function () {
        const createdNodes = [];
        for (let lIndex = 0; lIndex < targetNodes.length; lIndex += 1) {
          const targetNode = targetNodes[lIndex];
          for (let index = 0; index < arguments.length; index += 1) {
            const exprDef = arguments[index];
            if (!exprDef instanceof ExprDef) {
              throw new Error(`Argument is not an instanceof ExprDef`);
            }
            const nextExpr = exprDef.clone(getNotice);
            if (targetNode[nextExpr.getName()] === undefined) {
              targetNode[nextExpr.getName()] = {
                _meta: {
                  expr: nextExpr
                }
              };
            }
            createdNodes.push(targetNode[nextExpr.getName()]);
          }
        }
        return {
          then: then(createdNodes),
          repeat: setMeta(createdNodes, 'repeat', true),
          end: setMeta(createdNodes, 'end', true),
        };
      }
    }

    this.if = function () {return then([stages]).apply(this, arguments);}

    function isEscaped(str, index) {
      if (options.escape === undefined) {
        return false;
      }
      let count = -1;
      let firstIndex, secondIndex;
      do {
        count += 1;
        firstIndex = index - (options.escape.length * (count + 1));
        secondIndex = options.escape.length;
      } while (str.substr(firstIndex, secondIndex) === options.escape);
      return count % 2 == 0;
    }

    function foundCall(onFind, sub) {
      if ((typeof notify) === 'function') {
        notify(this);
      }
      if ((typeof onFind) === 'function') {
        return onFind(sub);
      } else {
        return sub;
      }
    }

    this.find = function (str, index) {
      let startedThisCall = false;
      let needle = options.closing;
      let starting = false;
      if (start === undefined) {
        needle = options.opening;
        starting = true;
      }
      const sub = str.substr(index);
      let needleLength;
      if (needle instanceof RegExp) {
        const match = sub.match(needle);
        if (match && match.index === 0) {
          needleLength = match[0].length;
        }
      } else if ((typeof needle) === 'string') {
        if (sub.indexOf(needle) === 0 && !isEscaped(str, index))
          needleLength = needle.length;
      } else if (needle === undefined || needle === null) {
        needleLength = 0;
      } else {
        throw new Error('Opening or closing type not supported. Needs to be a RegExp or a string');
      }
      needleLength += options.tailOffset ? options.tailOffset : 0;
      let changes = '';
      if (start === undefined && starting && (needleLength || needle === null)) {
        string = str;
        start = index;
        startedThisCall = true;
        if (needle === null) {
          if ((typeof notify) === 'function') {
            notify(this);
          }          return {index, changes}
        } else {
          changes += foundCall.apply(this, [options.onOpen, str.substr(start, needleLength)]);
        }
      }
      if ((!startedThisCall && needleLength) ||
            (startedThisCall && options.closing === undefined) ||
            (!startedThisCall && options.closing === null)) {
        if (str !== string) {
          throw new Error ('Trying to apply an expression to two different strings.');
        }
        end = index + needleLength;
        if (options.closing === null) {
          return {index, changes}
        }
        if (!startedThisCall) {
          changes += foundCall.apply(this, [options.onClose, str.substr(end - needleLength, needleLength)]);
        }
        return { index: end, changes };
      }

      return start !== undefined ? { index: start + needleLength, changes } :
                      { index: -1, changes };
    }

    this.clone = function (notify) {
      return new ExprDef(name, options, notify, stages, alwaysPossible);
    };
    this.name = this.getName();
    this.canEnd = function () {return (currStage._meta && currStage._meta.end) || options.closing === null};
    this.endDefined = function () {return options.closing !== undefined && options.closing !== null};
    this.location = function () {return {start, end, length: end - start}};
    this.closed = function () {return end !== undefined;}
    this.open = function () {return start !== undefined;}
    this.next =  function () {
      const expressions = [];
      if (currStage._meta && currStage._meta.repeat) {
        currStage = stages;
      }
      Object.values(currStage).map(
        function (val) {if (val._meta) expressions.push(val._meta.expr);}
      )
      return alwaysPossible.concat(expressions);
    };
  }
}

function parse(exprDef, str) {
  exprDef = exprDef.clone();
  let index = 0;
  let modified = '';
  const breakDown = [];
  const stack = [];

  function topOfStack() {
    return stack[stack.length - 1];
  }

  function closeCheck(exprDef) {
    if (exprDef && (exprDef.canEnd() || exprDef.endDefined())) {
      let result = exprDef.find(str, index);
      if (result.index) {
        modified += result.changes;
        return result.index;
      }
    }
  }

  function checkArray(exprDef, array) {
    if (exprDef.endDefined()) {
      let nextIndex = closeCheck(exprDef);
      if (nextIndex) return nextIndex;
    }
    for (let aIndex = 0; aIndex < array.length; aIndex += 1) {
      const childExprDef = array[aIndex].clone(exprDef.getNotice);
      const result = childExprDef.find(str, index);
      if (result.index !== -1) {
        modified += result.changes;
        if (childExprDef.closed()) {
          breakDown.push(childExprDef);
        } else {
          stack.push(childExprDef);
        }
        return result.index;
      }
    }
    if (exprDef.canEnd()) {
      nextIndex = closeCheck(exprDef);
      if (nextIndex) return nextIndex;
    }
    throw new Error(`Invalid string @ index ${index}\n'${str.substr(0, index)}' ??? '${str.substr(index)}'`);
  }

  function open(exprDef, index) {
    const always = exprDef.getAlways();
    while (!exprDef.open()) {
      let result = exprDef.find(str, index);
      modified += result.changes;
      if(result.index === -1) {
        let newIndex = checkArray(exprDef, always);
        index = newIndex;
      } else {
        if (exprDef.closed()) {
          breakDown.push(exprDef);
        } else {
          stack.push(exprDef);
        }
        index = result.index;
      }
    }
    return index;
  }

  let loopCount = 0;
  index = open(exprDef, index);
  progress = [-3, -2, -1];
  while (topOfStack() !== undefined) {
    const tos = topOfStack();
    if (progress[0] === index) {
      throw new Error(`ExprDef stopped making progress`);
    }
    let stackIds = '';
    let options = '';
    stack.map(function (value) {stackIds+=value.getName() + ','});
    tos.next().map(function (value) {options+=value.getName() + ','})
    // console.log(stackIds)
    // console.log(options)
    index = checkArray(tos, tos.next());
    if (tos.closed()) {
      stack.pop();
    }
    loopCount++;
  }
  // if (index < str.length) {
  //   throw new Error("String not fully read");
  // }
  return modified;
}


ExprDef.parse = parse;
try {
  exports.ExprDef = ExprDef;
} catch (e) {}

class CustomEvent {
  constructor(name) {
    const watchers = {};
    this.on = function (func) {
      if ((typeof func) === 'function') {
        if (watchers[name] === undefined) {
          watchers[name] = [];
        }
        watchers[name].push(func);
      } else {
        throw new Error(`CustomEvent.on called without a function argument\n\t${func}`);
      }
    }

    this.trigger = function (element) {
      element = element === undefined ? window : element;
      if(document.createEvent){
          element.dispatchEvent(this.event);
      } else {
          element.fireEvent("on" + this.event.eventType, this.event);
      }
    }
//https://stackoverflow.com/questions/2490825/how-to-trigger-event-in-javascript
    this.event;
    if(document.createEvent){
        this.event = document.createEvent("HTMLEvents");
        this.event.initEvent(name, true, true);
        this.event.eventName = name;
    } else {
        this.event = document.createEventObject();
        this.event.eventName = name;
        this.event.eventType = name;
    }
  }
}
class RegArr {
  constructor(string, array) {
    const newLine = 'akdiehtpwksldjfurioeidu';
    const noNewLines = string.replace(/\n/g, newLine);
    const stack = [{str: noNewLines, index: 0}];
    const details = {};
    let finalStr = '';
    const obj = {};
    array = array.concat({name: 'untouched', regex: /(.*)/g, actionM: null});

    obj.original = function () {return string;};
    obj.result = function () {return finalStr};
    obj.details = function () {return details};

    function split(str, array) {
      const splitted = [];
      for (let index = 0; array && index < array.length; index += 1) {
        const elem = array[index];
        const startIndex = str.indexOf(elem);
        if (startIndex !== -1) {
          const length = elem.length;
          if (startIndex !== 0 ) {
            splitted.push(str.substring(0, startIndex));
          }
          str = str.substring(startIndex + length);
        }
      }
      if (str.length > 0) {
          splitted.push(str);
      }
      return splitted;
    }

    function next(str, action, regex) {
      if (str === null) return;
      console.log(action, action === null);
      if (action !== undefined) {
        if (Number.isInteger(action)) {
          stack.push({str, index: action})
        } else if (action !== null) {
          stack.push({str: str.replace(regex, action), index: array.length - 1});
        } else {
          finalStr += str;
        }
      } else {
        stack.push({str, index: array.length - 1});
      }
    }

    function idk(arr1, arr1Action, arr2, arr2Action, regex) {
      for (let index = arr1.length - 1; index > -1; index -= 1) {
        if (arr2 && arr2[index]) {
          next(arr2[index], arr2Action, regex);
        }
        next(arr1[index], arr1Action, regex);
      }
    }

    function addDetails(name, attr, array) {
      if (!array) return;
      array = array.map(function (value) {return value.replace(new RegExp(newLine, 'g'), '\n')});
      if (!details[name]) details[name] = {};
      if (!details[name][attr]) details[name][attr] = [];
      details[name][attr] = details[name][attr].concat(array);
    }

    function construct(str, index) {
      if (str === undefined) return;
      const elem = array[index];
      const matches = str.match(elem.regex);
      const splitted = split(str, matches);
      addDetails(elem.name, 'matches', matches);
      addDetails(elem.name, 'splitted', splitted);
      let finalStr = '';
      if (matches && matches[0] && str.indexOf(matches[0]) === 0) {
        idk(matches, elem.actionM, splitted, elem.actionS, elem.regex);
      } else {
        idk(splitted, elem.actionS, matches, elem.actionM, elem.regex);
      }
    }

    function process() {
      while (stack.length > 0) {
        const curr = stack.pop();
        construct(curr.str, curr.index);
      }
      finalStr = finalStr.replace(new RegExp(newLine, 'g'), '\n');
    }
    process();
    return obj;
  }
}

try{
	exports.RegArr = RegArr;
} catch (e) {}


function search() {
  const explanations = new Explanations();
  const merriamWebster = new MerriamWebster()
  const rawText = new RawText()

  let definitions = {
    if: "conditional",
    is: "to be or not to be",
    the: "come on man"
  };

  let word;

  function addDefinition(definition) {
    definitions[word] = definition;
  }

  function topNodeText(el) {
    child = el.firstChild,
    texts = [];

    while (child) {
      if (child.nodeType == 3) {
        texts.push(child.data);
      }
      child = child.nextSibling;
    }

    return texts.join("");
  }

  function findWord(word) {
    return Array.from(document.querySelectorAll('*'))
    .filter(el => topNodeText(el).match(new RegExp(word, 'i')));
  }

  let built = false;
  function buildUi() {
    built = true;
    document.onmouseup = onHighlight;
    new HoverResources(data);
    UI.id = UI_ID;
    UI.style = `position: fixed;
                width: 100%;
                height: 30%;
                top: 0px;
                left: 0px;
                text-align: center;
                display: none;
                z-index: 999;
                background-color: whitesmoke;
                overflow: auto;
                border-style: outset;
                border-width: 1pt;`;
  }

  function goTo(word) {
    return function() {
      lookup(word);
    }
  }

  const historyTemplate = new $t('popup-cnt/linear-tab');
  let history = [];
  function setHistory(word) {
    history = history.filter((value) => value !== word);
    const sugCnt = document.getElementById(HISTORY_CNT_ID);
    sugCnt.innerHTML = historyTemplate.render(history.reverse());
    const spans = sugCnt.querySelectorAll('span');
    for (let index = 0; index < spans.length; index += 1) {
      spans[index].addEventListener('click', goTo(spans[index].innerText.trim().substr(0, 20)));
    }
    history.reverse();
    history.push(word);
  }

  function lookup(word) {
    setHistory(word);
    const trimmed = word.trim().toLowerCase();
    if (trimmed) {
      explanations.get(trimmed);
      merriamWebster.update(trimmed);
    }
    UI.show();
  }

  function onHighlight(e) {
    const selection = window.getSelection().toString()
    // Google Doc selection.
    // document.querySelector('.kix-selection-overlay')
    if (CE.properties.get('enabled') && selection) {
      lookup(selection);
      e.stopPropagation();
    }
  }

  function enableToggled(enabled) {
    if (enabled) {
      if (!built) {
        buildUi()
      }
    }
  }

  function refresh() {
    let hoverResources = document.getElementsByTagName('hover-resource');
    for (let index = 0; index < hoverResources.length; index += 1) {
      hoverResources[index].outerHTML = hoverResources[index].innerText;
    }

    new HoverResources(data);
  }

  CE.properties.onUpdate('enabled', enableToggled);
  CE.lookup = lookup;
  CE.refresh = refresh;
  CE.show = UI.show;
  CE.hide = UI.hide;
}

afterLoad.push(search);
class User {
  constructor() {
    let user = undefined;

    function successfullAdd(user) {
      user = data;
      const secret = user.secret;
      delete user.secret;
      chrome.storage.local.set({ secret, user });
      USER_ADD_CALL_SUCCESS.trigger();
    }

    function loginSuccess(data) {
      user = data;
      CE.properties.set('loggedIn', true, true);
    }

    function loginFailure() {
      CE.properties.set('loggedIn', false, true);
      console.error('Failed to login');
    }

    function login(props) {
      const username = props[username];
      const secret = props[secret];
      if (username && secret) {
        const url = `${URL_USER_LOGIN}${username}/${secret}`;
        Request.get(url, loginSuccess, loginFailure);
      }
    }

    function failedAdd(err) {
      USER_ADD_CALL_FAILURE.trigger(err);
    }


    this.add = function (username) {
      const url = `${URL_USER_ADD}${username}`;
      Request.get(url, successfullAdd, failedAdd);
    }

    this.get = function (username, success, failure) {
      const url = `${URL_USER_GET}${username}`
      Request.get(url, success, failure);
    }

    this.sync = function (username, code) {
      const url = `${URL_USER_SYNC}${username}/${code}`
      Request.get(url, success, failure);
    }

    if (user === undefined) {
      chrome.storage.local.get(['username', 'secret'], login);
    }
  }
}

class $t {
	constructor(template, id) {
		function varReg(prefix, suffix) {
		  const vReg = '([a-zA-Z_\\$][a-zA-Z0-9_.\\$]*)';
		  prefix = prefix ? prefix : '';
		  suffix = suffix ? suffix : '';
		  return new RegExp(`${prefix}${vReg}${suffix}`)
		};

		function replace(needleRegEx, replaceStr, exceptions) {
		  return function (sub) {
		    if (!exceptions || exceptions.indexOf(sub) === -1) {
		      return sub.replace(needleRegEx, replaceStr)
		    } else {
		      return sub;
		    }
		  }
		}

		const signProps = {opening: /([-+\!])/};
		const relationalProps = {opening: /((\<|\>|\<\=|\>\=))/};
		const ternaryProps = {opening: /\?/};
		const keyWordProps = {opening: /(new|null|undefined|NaN|true|false)[^a-z^A-Z]/, tailOffset: -1};
		const ignoreProps = {opening: /new \$t\('.*?'\).render\(get\('scope'\), '(.*?)', get\)/};
		const commaProps = {opening: /,/};
		const colonProps = {opening: /:/};
		const multiplierProps = {opening: /([-+=*\/](=|)|===)/};
		const stringProps = {opening: /('|"|`)(\1|.*?([^\\]((\\\\)*?|[^\\])(\1)))/};
		const spaceProps = {opening: /\s{1}/};
		const numberProps = {opening: /[0-9]*((\.)[0-9]*|)/};
		const objectProps = {opening: '{', closing: '}'};
		const objectLabelProps = {opening: varReg(null, '\\:')};
		const groupProps = {opening: /\(/, closing: /\)/};
		const expressionProps = {opening: null, closing: null};

		const funcProps = {
		  opening: varReg(null, '\\('),
		  onOpen: replace(varReg(null, '\\('), 'get("$1")('),
		  closing: /\)/
		};
		const arrayProps = {
		  opening: varReg(null, '\\['),
		  onOpen: replace(varReg(null, '\\['), 'get("$1")['),
		  closing: /\]/
		};
		const variableProps = {
		  opening: varReg(),
		  onOpen: replace(varReg(), 'get("$1")'),
		};
		const objectShorthandProps = {
		  opening: varReg(),
		  onOpen: replace(varReg(), '$1: get("$1")'),
		};


		const expression = new ExprDef('expression', expressionProps);
		const ternary = new ExprDef('ternary', ternaryProps);
		const relational = new ExprDef('relational', relationalProps);
		const comma = new ExprDef('comma', commaProps);
		const colon = new ExprDef('colon', colonProps);
		const func = new ExprDef('func', funcProps);
		const string = new ExprDef('string', stringProps);
		const space = new ExprDef('space', spaceProps);
		const keyWord = new ExprDef('keyWord', keyWordProps);
		const group = new ExprDef('group', groupProps);
		const object = new ExprDef('object', objectProps);
		const array = new ExprDef('array', arrayProps);
		const number = new ExprDef('number', numberProps);
		const multiplier = new ExprDef('multiplier', multiplierProps);
		const sign = new ExprDef('sign', signProps);
		const ignore = new ExprDef('ignore', ignoreProps);
		const variable = new ExprDef('variable', variableProps);
		const objectLabel = new ExprDef('objectLabel', objectLabelProps);
		const objectShorthand = new ExprDef('objectShorthand', objectShorthandProps);

		expression.always(space, ignore, keyWord);
		expression.if(string, number, func, array, variable, group)
		      .then(multiplier, sign, relational)
		      .repeat();
		expression.if(sign)
		      .then(expression)
		      .then(multiplier, sign, relational)
		      .repeat();
		expression.if(string, number, func, array, variable, group)
		      .then(ternary)
		      .then(expression)
		      .then(colon)
		      .then(expression)
		      .end();
		expression.if(object, string, number, func, array, variable, group)
		      .end();
		expression.if(sign)
		      .then(number)
		      .end();

		object.always(space, ignore, keyWord);
		object.if(objectLabel).then(expression).then(comma).repeat();
		object.if(objectShorthand).then(comma).repeat();
		object.if(objectLabel).then(expression).end();
		object.if(objectShorthand).end();

		group.always(space, ignore, keyWord);
		group.if(expression).end();

		array.always(space, ignore, keyWord);
		array.if(expression).then(comma).repeat();
		array.if(expression).end();

		func.always(space, ignore, keyWord);
		func.if(expression).then(comma).repeat();
		func.if(expression).end();

		function getter(scope, parentScope) {
			parentScope = parentScope || function () {return undefined};
			function get(name) {
				if (name === 'scope') return scope;
				const split = new String(name).split('.');
				let currObj = scope;
				for (let index = 0; currObj != undefined && index < split.length; index += 1) {
					currObj = currObj[split[index]];
				}
				const value = currObj || parentScope(name) || '';
				return value;
			}
			return get;
		}

		function defaultArray(elemName, get) {
			let resp = '';
			for (let index = 0; index < get('scope').length; index += 1) {
				if (elemName) {
					const obj = {};
					obj[elemName] = get(index);
					resp += new $t(template).render(obj, undefined, get);
				} else {
					resp += new $t(template).render(get(index), undefined, get);
				}
			}
			return `${resp}`;
		}

		function arrayExp(itExp, get) {
			const match = itExp.match($t.arrayItExpReg);
			const varName = match[1];
			const array = get(match[2]);
			let built = '';
			for (let index = 0; index < array.length; index += 1) {
				const obj = {};
				obj[varName] = array[index];
				obj.$index = index;
				built += new $t(template).render(obj, undefined, get);
			}
			return built;
		}

		function itOverObject(itExp, get) {
			const match = itExp.match($t.objItExpReg);
			const keyName = match[1];
			const valueName = match[2];
			const obj = get(match[3]);
			const keys = Object.keys(obj);
			let built = '';
			for (let index = 0; index < keys.length; index += 1) {
				const key = keys[index];
				const childScope = {};
				childScope[keyName] = {key};
				childScope[valueName] = obj[key];
				childScope.$index = index;
				built += new $t(template).render(obj, undefined, get);
			}
		}

		function rangeExp(itExp, get) {
			const match = itExp.match($t.rangeItExpReg);
			const elemName = match[1];
			let startIndex = (typeof match[2]) === 'number' ||
						match[2].match(/^[0-9]*$/) ?
						match[2] : get(`${match[2]}`);
			let endIndex = (typeof match[3]) === 'number' ||
						match[3].match(/^[0-9]*$/) ?
						match[3] : get(`${match[3]}`);
			if (((typeof startIndex) !== 'string' &&
							(typeof	startIndex) !== 'number') ||
								(typeof endIndex) !== 'string' &&
								(typeof endIndex) !== 'number') {
									throw Error(`Invalid range '${itExp}' evaluates to '${startIndex}..${endIndex}'`);
			}

			try {
				startIndex = Number.parseInt(startIndex);
			} catch (e) {
				throw Error(`Invalid range '${itExp}' evaluates to '${startIndex}..${endIndex}'`);
			}
			try {
				endIndex = Number.parseInt(endIndex);
			} catch (e) {
				throw Error(`Invalid range '${itExp}' evaluates to '${startIndex}..${endIndex}'`);
			}

			let index = startIndex;
			let built = '';
			while (true) {
				let increment = 1;
				if (startIndex > endIndex) {
					if (index <= endIndex) {
						break;
					}
					increment = -1;
				} else if (index >= endIndex) {
					break;
				}
				const obj = {$index: index};
				obj[elemName] = index;
				built += new $t(template).render(obj, undefined, get);
				index += increment;
			}
			return built;
		}

		function evaluate(get) {
			if ($t.functions[id]) {
				return $t.functions[id](get);
			} else {
				return eval($t.templates[id])
			}
		}

		function type(scope, itExp) {
			if ((typeof itExp) === 'string' && itExp.match($t.rangeAttemptExpReg)) {
				if (itExp.match($t.rangeItExpReg)) {
					return 'rangeExp'
				}
				return 'rangeExpFormatError';
			} else if (Array.isArray(scope)) {
				if (itExp === undefined) {
					return 'defaultArray';
				} else if (itExp.match($t.nameScopeExpReg)) {
					return 'nameArrayExp';
				} else {
					return 'invalidArray';
				}
			} else if ((typeof scope) === 'object') {
				if (itExp === undefined) {
					return 'defaultObject';
				} else if (itExp.match($t.objItExpReg)){
					return 'itOverObject';
				} else if (itExp.match($t.arrayItExpReg)){
					return 'arrayExp';
				} else {
					return 'invalidObject';
				}
			} else {
				return 'defaultObject';
			}
		}

		function render(scope, itExp, parentScope) {
			let rendered = '';
			const get = getter(scope, parentScope);
			switch (type(scope, itExp)) {
				case 'rangeExp':
					rendered = rangeExp(itExp, get);
					break;
				case 'rangeExpFormatError':
					throw new Error(`Invalid range itteration expression "${itExp}"`);
				case 'defaultArray':
					rendered = defaultArray(itExp, get);
					break;
				case 'nameArrayExp':
					rendered = defaultArray(itExp, get);
					break;
				case 'arrayExp':
					rendered = arrayExp(itExp, get);
					break;
				case 'invalidArray':
					throw new Error(`Invalid iterative expression for an array "${itExp}"`);
				case 'defaultObject':
					rendered = evaluate(get);
					break;
				case 'itOverObject':
					rendered = itOverObject(itExp, get);
					break;
				case 'invalidObject':
					throw new Error(`Invalid iterative expression for an object "${itExp}"`);
				default:
					throw new Error(`Programming error defined type '${type()}' not implmented in switch`);
			}
			return rendered;
		}


//---------------------  Compile Functions ---------------//

		function stringHash(string) {
			let hashString = string;
			let hash = 0;
			for (let i = 0; i < hashString.length; i += 1) {
				const character = hashString.charCodeAt(i);
				hash = ((hash << 5) - hash) + character;
				hash &= hash; // Convert to 32bit integer
			}
			return hash;
		}

		function isolateBlocks(template) {
			let inBlock = false;
			let openBracketCount = 0;
			let block = '';
			let blocks = [];
			let str = template;
			for (let index = 0; index < str.length; index += 1) {
				if (inBlock) {
					block += str[index];
				}
				if (!inBlock && index > 0 &&
					str[index] == '{' && str[index - 1] == '{') {
					inBlock = true;
				} else if (inBlock && str[index] == '{') {
					openBracketCount++;
				} else if (openBracketCount > 0 && str[index] == '}') {
					openBracketCount--;
				} else if (str[index + 1] == '}' && str[index] == '}' ) {
					inBlock = false;
					blocks.push(`${block.substr(0, block.length - 1)}`);
					block = '';
				}
			}
			return blocks;
		}

		function compile() {
			const blocks = isolateBlocks(template);
			let str = template;
			for (let index = 0; index < blocks.length; index += 1) {
				const block = blocks[index];
				const parced = ExprDef.parse(expression, block);
				str = str.replace(`{{${block}}}`, `\` + (${parced}) + \``);
			}
			return `\`${str}\``;
		}

		const repeatReg = /<([a-zA-Z-]*):t( ([^>]* |))repeat=("|')([^>^\4]*?)\4([^>]*>((?!(<\1:t[^>]*>|<\/\1:t>)).)*<\/)\1:t>/;
		function formatRepeat(string) {
			// tagname:1 prefix:2 quote:4 exlpression:5 suffix:6
			// string = string.replace(/<([^\s^:^-^>]*)/g, '<$1-ce');
			let match;
			while (match = string.match(repeatReg)) {
				let tagContents = match[2] + match[6];
				let template = `<${match[1]}${tagContents}${match[1]}>`.replace(/\\'/g, '\\\\\\\'').replace(/([^\\])'/g, '$1\\\'').replace(/''/g, '\'\\\'');
				let templateName = tagContents.replace(/.*\$t-id=('|")([a-zA-Z-_\/]*?)(\1).*/, '$2');
				template = templateName !== tagContents ? templateName : template;
				string = string.replace(match[0], `{{new $t('${template}').render(get('scope'), '${match[5]}', get)}}`);
				console.log('\n\n\nformrepeat: ', string, '\n\n\n')
				eval(`new $t(\`${template}\`)`);
			}
			return string;
		}

		if (id) {
			$t.templates[id] = undefined;
			$t.functions[id] = undefined;
		}
		template = template.replace(/\s{1,}/g, ' ');
		id = $t.functions[template] ? template : id || stringHash(template);
		if (!$t.functions[id]) {
			if (!$t.templates[id]) {
				template = template.replace(/\s{2,}|\n/g, ' ');
				template = formatRepeat(template);
				$t.templates[id] = compile();
			}
		}
		this.compiled = function () { return $t.templates[id];}
		this.render = render;
		this.type = type;
		this.isolateBlocks = isolateBlocks;
	}
}

$t.templates = {};//{"-1554135584": '<h1>{{greeting}}</h1>'};
$t.functions = {};
$t.arrayItExpReg = /^\s*([a-zA-Z][a-z0-9A-Z]*)\s*in\s*([a-zA-Z][a-z0-9A-Z\.]*)\s*$/;
$t.objItExpReg = /^\s*([a-zA-Z][a-z0-9A-Z]*)\s*,\s*([a-zA-Z][a-z0-9A-Z]*)\s*in\s*([a-zA-Z][a-z0-9A-Z]*)\s*$/;
$t.rangeAttemptExpReg = /^\s*([a-z0-9A-Z]*)\s*in\s*(.*\.\..*)\s*$/;
$t.rangeItExpReg = /^\s*([a-z0-9A-Z]*)\s*in\s*([a-z0-9A-Z]*)\.\.([a-z0-9A-Z]*)\s*$/;
$t.nameScopeExpReg = /^\s*([a-zA-Z][a-z0-9A-Z]*)\s*$/;
$t.quoteStr = function (str) {
		str = str.replace(/\\`/g, '\\\\\\`')
		str = str.replace(/([^\\])`/g, '$1\\\`')
		return `\`${str.replace(/``/g, '`\\`')}\``;
	}
$t.formatName = function (string) {
    function toCamel(whoCares, one, two) {return `${one}${two.toUpperCase()}`;}
    return string.replace(/([a-z])[^a-z^A-Z]{1,}([a-zA-Z])/g, toCamel);
}
$t.dumpTemplates = function () {
	let templateFunctions = '';
	let tempNames = Object.keys($t.templates);
	for (let index = 0; index < tempNames.length; index += 1) {
		const tempName = tempNames[index];
		if (tempName) {
			const template = $t.templates[tempName];
			templateFunctions += `\n$t.functions['${tempName}'] = function (get) {\n\treturn ${template}\n}`;
		}
	}
	return templateFunctions;
}

try{
	exports.$t = $t;
} catch (e) {}
// ./src/index/services/$t.js

$t.functions['467442134'] = function (get) {
	return `<span > <label>` + (get("tag")) + `</label> <input type='checkbox' value='` + (get("tag")) + `'> </span>`
}
$t.functions['863427587'] = function (get) {
	return `<li class='ce-tab-list-item' ` + (get("elem.show")() ? '' : 'hidden') + `> <img class="lookup-img" src="` + (get("elem.imageSrc")()) + `"> </li>`
}
$t.functions['1870015841'] = function (get) {
	return `<div class='ce-margin'> <div class='ce-merriam-expl-card'> <div class='ce-merriam-expl-cnt'> <h3>` + (get("item.hwi.hw")) + `</h3> ` + (new $t('<div class=\'ce-merriam-expl\'> {{def}} <br><br> </div>').render(get('scope'), 'def in item.shortdef', get)) + ` </div> </div> </div>`
}
$t.functions['popup-cnt/explanation'] = function (get) {
	return `<div class='ce-expl-card'> <span class='ce-expl-rating-column'> <div class='ce-expl-rating-cnt'> <div class='like-ctn'> <button class='ce-expl-voteup-button'>Like<br>` + (get("explanation.likes")) + `</button> </div> <div class='like-ctn'> <button class='ce-expl-votedown-button'>Dislike<br>` + (get("explanation.dislikes")) + `</button> </div> </div> </span> <span class='ce-expl'> ` + (get("explanation.explanation")) + ` </span> <span class='ce-expl-author-cnt'> <div class='ce-expl-author'> ` + (get("explanation.author")) + ` </div> </span> </div> `
}
$t.functions['popup-cnt/linear-tab'] = function (get) {
	return `<span class='ce-linear-tab'>` + (get("scope")) + `</span> `
}
$t.functions['popup-cnt/tab-contents/raw-text-input'] = function (get) {
	return ` <textarea id='ce-raw-text-input-id' rows="50" cols="200"></textarea> `
}
$t.functions['popup-cnt/lookup'] = function (get) {
	return `<div> <link rel="stylesheet" href="` + (get("cssUrl")) + `"> <div class='ce-inline-flex' id='` + (get("HISTORY_CNT_ID")) + `'></div> <div class='ce-inline-flex' id='` + (get("MERRIAM_WEB_SUG_CNT_ID")) + `'></div> <div class='ce-tab-ctn'> <ul class='ce-tab-list'> ` + (new $t('<li  class=\'ce-tab-list-item\' {{elem.show() ? \'\' : \'hidden\'}}> <img class="lookup-img" src="{{elem.imageSrc()}}"> </li>').render(get('scope'), 'elem in list', get)) + ` </ul> ` + (new $t('<div  class=\'ce-lookup-cnt\' id=\'{{elem.id()}}\'></div>').render(get('scope'), 'elem in list', get)) + ` </div> </div> `
}
$t.functions['-415007478'] = function (get) {
	return `<div class='ce-lookup-cnt' id='` + (get("elem.id")()) + `'></div>`
}
$t.functions['popup-cnt/tab-contents/wikapedia'] = function (get) {
	return `<iframe class='ce-wiki-frame' src="https://en.wikipedia.org/wiki/Second_Silesian_War"></iframe> `
}
$t.functions['popup-cnt/tab-contents/webster'] = function (get) {
	return `<div class='ce-merriam-expl-card'> <a href='https://www.merriam-webster.com/dictionary/` + (get("key")) + `' target='merriam-webster'> <h3>Merriam Webster '` + (get("key")) + `'</h3> </a> ` + (new $t('<div  class=\'ce-margin\'> <div class=\'ce-merriam-expl-card\'> <div class=\'ce-merriam-expl-cnt\'> <h3>{{item.hwi.hw}}</h3> {{new $t(\'<div  class=\\\'ce-merriam-expl\\\'> {{def}} <br><br> </div>\').render(get(\'scope\'), \'def in item.shortdef\', get)}} </div> </div> </div>').render(get('scope'), 'item in data', get)) + ` </div> `
}
$t.functions['-1925646037'] = function (get) {
	return `<div class='ce-merriam-expl'> ` + (get("def")) + ` <br><br> </div>`
}
$t.functions['popup-cnt/tab-contents/explanation-cnt'] = function (get) {
	return `<div> <div> ` + (new $t('<span > <label>{{tag}}</label> <input type=\'checkbox\' value=\'{{tag}}\'> </span>').render(get('scope'), 'tag in allTags', get)) + ` </div> <div class='ce-key-cnt'> <h2 class='ce-key'>` + (get("words")) + `</h2> <button class='ce-btn ce-add-btn'>+</button> </div> <div class="ce-add-cnt"> ` + (new $t('popup-cnt/explanation').render(get('scope'), 'explanation in 0..1', get)) + ` <textarea id='` + (get("ADD_EDITOR_ID")) + `' rows="8" cols="80"></textarea> </div> <div> ` + (new $t('popup-cnt/explanation').render(get('scope'), 'explanation in explanations', get)) + ` </div> </div> `
}
$t.functions['-1132695726'] = function (get) {
	return `popup-cnt/explanation`
}
$t.functions['icon-menu/settings'] = function (get) {
	return `<!DOCTYPE html> <html lang="en" dir="ltr"> <head> <meta charset="utf-8"> <title>CE Settings</title> <link rel="stylesheet" href="/css/settings.css"> <link rel="stylesheet" href="/css/lookup.css"> <link rel="stylesheet" href="/css/hover-resource.css"> </head> <body> <div class='ce-setting-cnt'> <div id='ce-setting-list-cnt'> <ul id='ce-setting-list'></ul> </div> <div id='ce-settings-cnt'><h1>Hello World</h1></div> </div> <script type="text/javascript" src='/index.js'></script> <script type="text/javascript" src='/src/manual/settings.js'></script> </body> </html> `
}
$t.functions['icon-menu/menu'] = function (get) {
	return ` <menu> <link rel="stylesheet" href="file:///home/jozsef/projects/ContextExplained/css/menu.css"> <link rel="stylesheet" href="/css/menu.css"> <menuitem id='enable-btn' ` + (get("enabled") ? 'hidden': '') + `> Enable </menuitem> <menuitem id='disable-btn' ` + (!get("enabled") ? 'hidden': '') + `> Disable </menuitem> <menuitem id='ce-settings'> Settings </menuitem> </menu> `
}
$t.functions['icon-menu/controls'] = function (get) {
	return `<!DOCTYPE html> <html> <head> </head> <body> <div id='control-ctn'> </div> <script type="text/javascript" src='/index.js'></script> <script type="text/javascript" src='/src/manual/state.js'></script> </body> </html> `
}
$t.functions['icon-menu/links/raw-text-tool'] = function (get) {
	return `<!DOCTYPE html> <html lang="en" dir="ltr"> <head> <meta charset="utf-8"> <title>Text2Html</title> </head> <body> <div id='ce-raw-text-input-cnt-id'> <h1>hash</h1> <p> This page is created from HTTP status code information found at ietf.org and Wikipedia. Click on the category heading or the status code link to read more. </p> </div> </body> <script type="text/javascript" src='/index.js'></script> </html> `
}
$t.functions['icon-menu/links/login'] = function (get) {
	return `<div> <div> <input type='text' placeholder="username"> <button type="button" onclick="register()">Register</button> </div> <div> <input type='text' placeholder="sync-key"> <button type='button' onclick="sync()">Sync</button> </div> </div> `
}
$t.functions['icon-menu/links/favorite-lists'] = function (get) {
	return `<h1>favorite lists</h1> `
}
$t.functions['icon-menu/links/profile'] = function (get) {
	return `<h1>Profile</h1> `
}

class HoverResources {
  constructor (wordExplanationObj, tag) {
    let running = false;
    const instance = this;
    running = true;
    const excludedTags = ['STYLE', 'SCRIPT', 'TITLE'];
    let count = Math.floor(Math.random() * 10000000000000000);
    tag = tag ? tag : 'hover-resource';
    const texts = {};

    console.log('HoverResources');
    const box = document.createElement('div');
    box.id = `hover-pop-up-${count}`;
    box.innerText = 'Hello World';
    box.style = 'display: none;';
    document.body.append(box);

    let killAt = -1;
    let holdOpen = false;
    function kill() {
      if (!holdOpen && killAt < new Date().getTime()) {
          box.style.display = 'none';
          killAt = -1;
      }
    }

    function onHover(event) {
      if (!CE.properties.get('enabled')) return;
      const elem = event.target;
      if (elem.tagName.toLowerCase() === tag && texts[elem.id] &&
              texts[elem.id][0].text) {
        holdOpen = true;
        positionText(elem);
      } else if (elem.id === box.id || killAt === -1){
        holdOpen = true;
        killAt = new Date().getTime() + 750;
      } else if (killAt < new Date().getTime()) {
        holdOpen = false;
        box.style.display = 'none';
        killAt = -1;
      }
    }

    function exitHover() {
      setTimeout(kill, 1000);
    }

    function positionText(elem) {
      const tbSpacing = 10;
      const rect = elem.getBoundingClientRect();
      const height = rect.height;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const calcWidth = rect.left + 10 < screenWidth / 2 ? rect.left + 10 : screenWidth / 2;
      const left = `${calcWidth}px`;

      const width = `${screenWidth - calcWidth - 10}`;
      const css = `
        cursor: pointer;
        position: fixed;
        z-index: 999999;
        background-color: white;
        display: block;
        left: ${left};
        max-height: 40%;
        max-width: ${width};
        overflow: auto;
        border: 1px solid;
        border-radius: 5pt;
        padding: 10px;
        box-shadow: 3px 3px 6px black, 3px 3px 6px grey, 3px 3px 6px lightgrey;
        `;

      box.style = css;
      box.innerHTML = texts[elem.id][0].text;

      let top = `${rect.top}px`;
      const boxHeight = box.getBoundingClientRect().height;
      if (screenHeight / 2 > rect.top) {
        top = `${rect.top + height}px`;
      } else {
        top = `${rect.top - boxHeight}px`;
      }
      box.style = `${css}top: ${top};`;

    }

    function topNodeText(el) {
        let child = el.firstChild;
        const texts = [];

        while (child) {
            if (child.nodeType == 3) {
                texts.push(child.data);
            }
            child = child.nextSibling;
        }

        return texts.join("");
    }

    function findWord(word) {
        return Array.from(document.body.querySelectorAll('*'))
          .filter(el => topNodeText(el).match(new RegExp(word, 'i')));
    }

    function getId(id) {
      return `${tag}-${id}`;
    }


    function wrapText(elem, text, hoverText) {
      const id = getId(count++);
      let textRegStr = `((^|>)([^>^<]* |))(${text}(|s|es))(([^>^<]* |)(<|$|))`;
      let textReg = new RegExp(textRegStr, 'ig');
      const replaceStr = `$1<${tag} id='${id}'>$4</${tag}>$6`;
      elem.innerHTML = elem.innerHTML.replace(textReg, replaceStr);
      texts[id] = hoverText;
    }

    let wrapList = [];
    let wrapIndex = 0;
    function wrapOne() {
        if (!CE.properties.get('enabled')) return;
        for (let index = 0; index < 50; index += 1) {
          const wrapInfo = wrapList[wrapIndex];
          if (wrapInfo) {
            wrapText(wrapInfo.elem, wrapInfo.word, wrapInfo.explainations);
            wrapInfo[wrapIndex++] = undefined;
          }
        }
        setTimeout(wrapOne, 1);
    }
    this.wrapOne = wrapOne;

    function getDepth(elem){
    	var depth = 0
    	while(null!==elem.parentElement){
    		elem = elem.parentElement
    		depth++
    	}
    	return depth
    }

    function sortDepth(info1, info2) {
      return info2.depth - info1.depth;
    }

    function buildWrapList() {
      const wordList = Object.keys(wordExplanationObj);
      for (let index = 0; index < wordList.length; index += 1) {
        const word = wordList[index];
        const elems = findWord(word);
        for(let eIndex = 0; eIndex < elems.length; eIndex += 1) {
          const elem = elems[eIndex];
          if (excludedTags.indexOf(elem.tagName) === -1) {
            const explainations = wordExplanationObj[word];
            const depth = getDepth(elem);
            wrapList.push({ elem, word, explainations, depth });
          }
        }
      }
      wrapList.sort(sortDepth);
    }

    buildWrapList();
    setTimeout(wrapOne, 1);

    document.addEventListener('mouseover', onHover);
    document.addEventListener('mouseout', exitHover);
    this.wrapText = wrapText;

    function enableToggled(enabled) {
      instance.wrapOne();
    }

    CE.properties.onUpdate('enabled', enableToggled);
  }
}

const USER_ADD_CALL_SUCCESS = new CustomEvent('user-add-call-success');
const USER_ADD_CALL_FAILURE = new CustomEvent('user-add-call-failure');
const CE_LOADED = new CustomEvent('user-add-call-failure');
const CE_UI_BUILT = new CustomEvent('ce-ui-built');

class AddInterface {
  constructor () {
    const instance = this;
    instance.inputElem = document.getElementById(ADD_EDITOR_ID);
    instance.inputCnt = document.querySelector('.ce-add-cnt');
    instance.toggleButton = document.querySelector('.ce-add-btn');
    let updatePending = false;
    function updateDisplay (value) {
      value = value === undefined ? '' : value;
      value = value.replace(/\n/g, '<br>')
                    .replace(/\(([^\(^\)]*?)\)\s*\[([^\]\[]*?)\]/g,
                        '<a target=\'blank\' href="$2">$1</a>');
      instance.inputElem.parentNode.querySelector('.ce-expl').innerHTML = value;
    }
    instance.updateDisplay = updateDisplay;

    function onChange(e) {
      updateDisplay(e.target.value);
    }

    let show;
    function toggleDisplay(value) {
      show = (typeof value) === "boolean" ? value : !show;
      if (show) {
        instance.inputCnt.style.display = 'block';
      } else {
        instance.inputCnt.style.display = 'none';
      }
    }

    toggleDisplay(false);
    this.toggleDisplay = toggleDisplay;
    instance.inputElem.addEventListener('keyup', onChange);
    instance.toggleButton.addEventListener('click', toggleDisplay);
  }
}

class Tab {
  constructor(imageSrc, id, template, show) {
    const t = new $t(template);
    show = show || function () {return true;};

    this.imageSrc = function () {return imageSrc};
    this.id = function () {return id;}
    this.template = function () {return template;}
    this.show = show;
    this.update = function (scope) {
      document.getElementById(id).innerHTML = t.render(scope);
    }

    Tab.tabs.push(this);
  }
}

Tab.tabs = [];
Tab.updateAll = function () {
  for (let index = 0; index < Tab.tabs.length; index += 1) {
    Tab.tabs[index].update();
  }
}

function lookup() {
  let lookupTemplate = new $t('popup-cnt/lookup');
  let activeIndex = 0;

  function buildLookupHtml() {
    UI.innerHtml(lookupTemplate.render({
      MERRIAM_WEB_SUG_CNT_ID, HISTORY_CNT_ID,
      cssUrl: chrome.runtime.getURL('css/lookup.css'),
      list: Tab.tabs,
      openTab: 0
    }));
    Tab.updateAll();
  }

  function switchTo(elem, div) {
      const childs = elem.closest('.ce-tab-ctn').children;
      const lis = childs[0].children;
      for (let index = 0; index < lis.length; index += 1) {
          lis[index].className = lis[index].className.replace(/(^| )active($| )/g, ' ');
          childs[index + 1].style.display = 'none';
      }
      elem.className = elem.className + ' active';
      div.style.display = 'block';
  }

  function call(func) {
    const args = [];
    for (let i = 1; i < arguments.length; i++) args.push(arguments[i]);
    return function () {
      func.apply(null, args);
    }
  }

  function updateTabVisibility() {
    const elems = document.getElementsByClassName('ce-tab-list-item ');
    for (let index = 0; index < elems.length; index += 1) {
      const elem = elems[index];
      if (Tab.tabs[index].show()) {
        elem.style.display = 'block';
      } else {
        elem.style.display = 'none';
      }
    }
  }
  CE.updateTabVisibility = updateTabVisibility;

  function showTab(index) {
    updateTabVisibility();
    const elem = document.getElementsByClassName('ce-tab-list-item ')[index];
    const div = document.getElementById(Tab.tabs[index].id());
    switchTo(elem, div);
  }

  function updateDisplayFunc(div) {
    console.log('lookup');
    return function (event) {
      const elem = event.target.closest('.ce-tab-list-item');
      switchTo(elem, div);
    }
  }

  function initTabs() {
    buildLookupHtml();
      const tabCtns = document.getElementsByClassName('ce-tab-ctn');
      const tabItems = document.getElementsByClassName('ce-tab-ctn')[0]
                      .querySelectorAll('li');
      for (let index = 0; index < tabItems.length; index += 1) {
        tabItems[index].onclick = call(showTab, index);
      }
      // for (let index = 0; index < tabCtns.length; index += 1) {
      //   const tabCtn = tabCtns[index];
      //   const childs = tabCtn.children;
      //   const lis = childs[0].children;
      //     for (let lIndex = 0; lIndex < lis.length; lIndex += 1) {
      //       const li = lis[lIndex];
      //       const div = childs[lIndex + 1];
      //       li.onclick = updateDisplayFunc(div);
      //         if (li.className.split(' ').indexOf('active') !== -1) {
      //             div.style.display = 'block';
      //         }
      //     }
      // }
      showTab(activeIndex);
      CE.showTab = showTab;
  }
  initTabs();
}

afterLoad.push(lookup);
class Explanations {
  constructor(list) {
    const tab = new Tab(URL_IMAGE_LOGO, CONTEXT_EXPLANATION_CNT_ID,
            'popup-cnt/tab-contents/explanation-cnt');
    this.list = list ? list : [];
    this.add = function (expl) {
      this.list.push(expl);
    }

    function setExplanation(explanations) {
      const scope = {};
      const tagObj = {}
      explanations.forEach(function (expl) {
        expl.tags.forEach(function (tag) {
          tagObj[tag] = true;
        });
      });
      scope.allTags = Object.keys(tagObj);
      scope.words = explanations[0].words;
      scope.explanations = explanations;
      scope.ADD_EDITOR_ID = ADD_EDITOR_ID;
      console.log(explanations)
      console.log(scope);
      tab.update(scope);
      new AddInterface();
    }

    function setAddition(words) {
      return function (request) {
        const scope = {};
        scope.words = words;
        scope.ADD_EDITOR_ID = ADD_EDITOR_ID;
        tab.update(scope);
        new AddInterface().toggleDisplay(true);
      }
    }

    this.get = function (words, success, failure) {
      const url = `${URL_CE_GET}${words}`;
      Request.get(url, setExplanation, setAddition(words));
    }

    this.like = function (words, index, success, failure) {
      const currUrl = window.location.href;
      const callUrl = `${URL_CE_LIKE}${words}/${index}?url=${currUrl}`;
      Request.get(callUrl, successfullOpinion, failedOpinion);
    }
    this.dislike = function (words, index, success, failure) {
      const currUrl = window.location.href;
      const callUrl = `${URL_CE_DISLIKE}${words}/${index}?url=${currUrl}`;
      Request.get(callUrl, successfullOpinion, failedOpinion);
    }
  }
}

console.log("HERE!!!!! ", chrome.runtime.getURL('./html/text-to-html.html'));

class RawText {
  constructor () {
    // TODO: implement only show when on proper edit page.
    function show() {return true;}
    let text = '';



    const tab = new Tab(URL_IMAGE_TXT, RAW_TEXT_CNT_ID,
            'popup-cnt/tab-contents/raw-text-input', show);

    const space = new Array(4).fill('&nbsp;').join('');
    const tabSpacing = new Array(16).fill('&nbsp;').join('');
    function textToHtml(text) {
      return text.replace(/\n/g, '<br>').replace(/\s/g, space)
                  .replace(/\t/g, tabSpacing);
    }

    function writeChanges() {
      const container = document.getElementById('ce-raw-text-input-cnt-id')
      container.innerHTML = textToHtml(text);
    }

    function onKeyup (event) {
      if (event.target.id === 'ce-raw-text-input-id') {
        text = event.target.value;
        writeChanges();
      }
    }
    function onChange (event) {
      if (event.target.id === 'ce-raw-text-input-id') {
        text = event.target.value;
        writeChanges();
        CE.refresh();
      }
    }

    function settingsPageChange (settingsPage) {
      if (settingsPage === 'Raw Text Tool') {
        writeChanges();
      }
    }

    CE.properties.onUpdate('settingsPage', settingsPageChange);
    document.addEventListener('keyup', onKeyup);
    document.addEventListener('paste', onKeyup);
    document.addEventListener('change', onChange);
  }
}

class MerriamWebster {
  constructor() {
    let hideTab = false;
    const instance = this;

    function showTab () {
      return !hideTab;
    }

    const merriamTab = new Tab(URL_IMAGE_MERRIAM, MERRIAM_WEB_DEF_CNT_ID,
            'popup-cnt/tab-contents/webster', showTab);
    const meriamSugTemplate = new $t('popup-cnt/linear-tab');


    function openDictionary(word) {
      return function() {
        CE.lookup(word);
      }
    }

    function updateSuggestions(suggestionHtml) {
      const sugCnt = document.getElementById(MERRIAM_WEB_SUG_CNT_ID);
      sugCnt.innerHTML = suggestionHtml || '';
      const spans = sugCnt.querySelectorAll('span');
      for (let index = 0; index < spans.length; index += 1) {
        spans[index].addEventListener('click', openDictionary(spans[index].innerText.trim()));
      }
    }

    function callbacks(selection) {
      function success (data) {
        const elem = data[0];
        if (elem.meta && elem.meta.stems) {
          hideTab = false;
          CE.updateTabVisibility();
          data = data.filter(elem => elem.meta.stems.indexOf(selection) !== -1);;
          merriamTab.update({data: data, key: selection});
          updateSuggestions(meriamSugTemplate.render([]))
        } else {
          hideTab = true;
          CE.showTab(0);
          updateSuggestions(meriamSugTemplate.render(data))
        }
      }

      function failure () {
        console.error('Call to Meriam Webster failed');
        hideTab = true;
        CE.updateTabVisibility();
      }
      return {success, failure};
    }

    this.update = function (selection) {
      if ((typeof selection) === 'string') {
        const url = `${URL_MERRIAM_REQ}${selection}`;
        const call = callbacks(selection);
        Request.get(url, call.success, call.failure);
      }
    }
  }
}

return {afterLoad, $t};
}
CE = CE()
CE.afterLoad.forEach((item) => {item();});
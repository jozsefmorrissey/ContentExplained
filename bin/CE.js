let CE = function () {
const afterLoad = []

function DebugGuiClient(config, root, debug) {
  config = config || {};
  var instance = this;
  var host = config.host;
  var httpHost = config.httpHost;
  var httpsHost = config.httpsHost;
  var id = config.id;
  var logWindow = config.logWindow || 25;

  debug = debug || config.debug || config.debug === 'true' || false;

  this.getId = function () {return id;}
  this.setId = function (value) {id = value; createCookie();}
  this.setHost = function (value) {host = value; createCookie();}

  function secure() {host = httpsHost;}
  function insecure() {host = httpHost;}
  function getHost() {return host;}
  function setRoot(r) {root = r;}
  function getRoot() {return root;}

  function path(str) {
    if (str) {
      return str + "/";
    }
    return "";
  }

  function prefixRoot(group) {
    return root + "." + group;
  }

  function softUpdate(config) {
    config.id = id || config.id;
    config.host = host || config.host;
    config.httpHost = httpHost || config.httpHost;
    config.httpsHost = httpsHost || config.httpsHost;
    updateConfig(config);
  }

  var guiAdded = false;
  function updateConfig(config) {
    id = config.id !== undefined ? config.id : id;
    httpHost = config.httpHost || httpHost;
    httpsHost = config.httpsHost || httpsHost;
    config.debug = String(config.debug);
    debug = config.debug.trim().match(/^(true|false)$/) ? config.debug : debug;
    debug = debug === true || debug === 'true';
    host = config.host !== undefined ? config.host : host;
    if (host !== undefined) host = host.replace(/^(.*?)\/$/, "$1");
    logWindow = logWindow != 25 ? logWindow : config.logWindow;
    createCookie();
  }

  function getUrl(host, ext, id, group) {
    host = path(host);
    ext = path(ext);
    id = path(id);
    group = group ? group.replace(/\//g, '%2F').replace(/\s/g, '%20') : undefined;
    group = path(group);

    var url = host + ext + id + group;
    return url.substr(0, url.length - 1);
  }

  function exception(group, exception, soft) {
    const exObj = {id: id, msg: exception.toString(), stacktrace: exception.stack}
    var xhr = new DebugGuiClient.xmlhr();
    xhr.open("POST", getUrl(host, 'exception', id, prefixRoot(group)), true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (soft !== true) {
      console.error(group + ' - threw the following exception\n\t' + exception);
    }
    xhr.send(JSON.stringify(exObj));
  }

  function data(onSuccess) {
    var xhr = new DebugGuiClient.xmlhr();
    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;

        console.error('dg resp', this.responseText);
        if (this.status == 200) {
            var data = JSON.parse(this.responseText);
            if (onSuccess) {
              onSuccess(data);
            }
        }
    };

    xhr.open('GET', getUrl(host, id), true);
    xhr.send();
  }

  function link(group, label, url) {
    if (debug) {
      var xhr = new DebugGuiClient.xmlhr();
      xhr.open("POST", getUrl(host, "link", id, prefixRoot(group)), true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({label, url}));
    }
    return instance;
  }

  function value(group, key, value) {
    if (debug) {
      var xhr = new DebugGuiClient.xmlhr();
      xhr.open("POST", getUrl(host, "value", id, prefixRoot(group)), true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      if ((typeof value) === 'object') value = JSON.stringify(value, null, 2);
      xhr.send(JSON.stringify({key, value}));
    }
    return instance;
  }

  function logs() {
    if (debug) {
      var log = '';
      for (let i = 0; i < arguments.length; i++) {
        if ((typeof arguments[i]) === 'object') {
          log += JSON.stringify(arguments[i], null, 6);
        } else {
          log += arguments[i];
        }
      }
      var xhr = new DebugGuiClient.xmlhr();
      var url = getUrl(host, "log", id);
      xhr.open("POST", url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({log}));
    }
    return instance;
  }

  function log(log) {
    logs(log);
  }


  function isDebugging() {
    return debug;
  }

  this.toString = function () {
    var id = instance.getId() || '';
    var host = instance.getHost() || '';
    noProtocol=host.replace(/^(http|https):\/\//, "")
    var portReg = /([^:]*?:[0-9]{4})(\/.*)$/;
    var httpHost;
    var httpsHost;
    var portMatch = noProtocol.match(portReg);
    if (portMatch) {
      // localhost
      var rootValue = portMatch[1].substr(0, portMatch[1].length - 1);
      httpHost = "http://" + rootValue + 0 + portMatch[2];
      httpsHost = "https://" + rootValue + 1 + portMatch[2];
    } else {
      // production
      httpHost = host.replace(/https/, 'http');
      httpsHost = host.replace(/http/, 'https');
    }
    var cookie = "id=" + id;
    return cookie + "|host=" +
        host + "|httpHost="  + httpHost + "|httpsHost=" + httpsHost + "|debug=" + isDebugging();
  }

  this.addHeaderXhr = function (xhr) {
    if (debug) {
      xhr.setRequestHeader('debug-gui', instance.toString());
    }
  }

  function createCookie() {
    if (!instance.getId() || !instance.getHost()) return;
    if (DebugGuiClient.inBrowser) {
      var cookie;
      if (instance.isDebugging()) {
        cookie = 'DebugGui=' + instance.toString() + ";";
      } else {
        cookie = 'DebugGui=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
      document.cookie = cookie;
      return cookie;
    }
  }

  this.link = link;
  this.value = value;
  this.exception = exception;
  this.getHost = getHost;
  this.logs = logs;
  this.log = log;
  this.updateConfig = updateConfig;
  this.softUpdate = softUpdate;
  this.isDebugging = isDebugging;
  this.secure = secure;
  this.insecure = insecure;
  this.setRoot = setRoot;
  this.getRoot = getRoot;
  this.cache = () => DebugGuiClient.clients[id] = this;
  this.trash = () => DebugGuiClient.clients[id] = undefined;
  this.createCookie = createCookie;
}

{

  DebugGuiClient.EXISTANCE_ID = 'debug-gui-exists-globally-unique-id';

  const dummyClient = new DebugGuiClient();
  function staticCall(funcName) {
    return (id) => {
      const args = Array.from(arguments).splice(1);
      const realClient = DebugGuiClient.clients[id];
      realClient ? realClient[funcName].apply(realClient, args) :
          dummyClient[funcName].apply(dummyClient, args);
    }
  }

  DebugGuiClient.clients = {};
  function createStaticInterface() {
    const funcNames = Object.keys(dummyClient);
    for (var index = 0; index < funcNames.length; index += 1) {
      const funcName = funcNames[index];
      DebugGuiClient[funcName] = staticCall(funcName);
    }
  }

  // Copied from https://jozsefmorrissey.com/js/ju.js
  function parseSeperator (str, seperator, isRegex) {
    if ((typeof str) !== 'string') {
      return {};
    }
    if (isRegex !== true) {
      seperator = seperator.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, '\\$&');
    }
    var keyValues = str.match(new RegExp('.*?=.*?(' + seperator + '|$)', 'g'));
    var json = {};
    for (let index = 0; keyValues && index < keyValues.length; index += 1) {
      var split = keyValues[index].match(new RegExp('\\s*(.*?)\\s*=\\s*(.*?)\\s*(' + seperator + '|$)'));
      if (split) {
        json[split[1]] = split[2];
      }
    }
    return json;
  }

  // Copied from https://jozsefmorrissey.com/js/ju.js
  function arrayMatches(array, regExp) {
    var matches = [];
    for (var index = 0; index < array.length; index += 1) {
      var elem = new String(array[index]);
      var match = elem.match(regExp);
      if (match) {
        if (arguments.length > 2) {
          var obj = {};
          for (var aIndex = 2; aIndex < arguments.length; aIndex += 1) {
              if ((typeof arguments[aIndex]) === 'string' ) {
                obj[arguments[aIndex]] = match[aIndex - 1];
              }
          }
          matches.push(obj);
        } else {
          matches.push(array[index]);
        }
      }
    }
    return matches;
  }

  function getParameter(params) {
    if ((typeof params) === 'string') {
      params = parseSeperator(params, '&');
    }
    if ((typeof params) === 'object') {
      var id = params['DebugGui.id'];
      var debug = params['DebugGui.debug'];
      var host = params['DebugGui.host'];
      return {id, debug, host};
    }
    DebugGuiClient.debugger.exception('', new Error('Param value must be a string or object'));
    return {};
  }

  function getCookie(cookies) {
    if (cookies === undefined) {
      return {};
    } else if ((typeof cookies) === 'string') {
      var cookieObj = parseSeperator(cookies, ';');
      return parseSeperator(cookieObj.DebugGui, '|');
    }
    DebugGuiClient.debugger.exception('', new Error('Cookies should be expressed as a string'));
  }

  function getCookieFromValue(value) {
    return parseSeperator(value, '|');
  }

  function getHeaderOrCookie(headers) {
    if (headers['debug-gui']) {
      return parseSeperator(headers['debug-gui'], '|');
    } else if (headers.cookie) {
      return getCookie(headers.cookie);
    }
    // DebugGuiClient.debugger.exception('', new Error('Neither a cookie "DebugGui" or a header "debug-gui" are defined'));
    return {};
  }

  function express(req, root) {
    if (req === undefined) return new DebugGuiClient({}, root);
    if (req.debugGui) return req.debugGui;
    var config = getHeaderOrCookie(req.headers);
    var debugGui = new DebugGuiClient(config, root);
    config = getParameter(req.params);
    debugGui.updateConfig(config);
    return debugGui;
  }

  var tagConf = undefined;
  function tagConfig() {
    if (document.currentScript) {
      function getScriptAttr(name) {
        var attr = document.currentScript.attributes[name];
        return attr ? attr.value : undefined;
      }
      tagConf = tagConf || {
        host: getScriptAttr('host'),
        debug: getScriptAttr('debug'),
        logWindow: getScriptAttr('log-window')
      };
      return tagConf;
    }
    return {};
  }

  function browser(root, programaticConfig) {
    var debugGui = new DebugGuiClient();
    debugGui.updateConfig(tagConfig());
    if (programaticConfig) debugGui.updateConfig(programaticConfig);
    var config = getCookie(document.cookie);
    debugGui.updateConfig(config);
    var params = window.location.href.replace(/^.*?\?(.*?)(#|)$|^.*$()/, '$1');
    config = getParameter(params);
    debugGui.updateConfig(config);
    debugGui.createCookie();
    debugGui.setRoot(root);
    return debugGui;
  }

  function node(args) {
    var config = require(global.__basedir + '/.debug-gui.json');
    var argMatches = arrayMatches.apply(undefined, [args, new RegExp(config.debugArg), undefined, 'id']);
    if (argMatches.length > 0) {
      config.debug = true;
      if (argMatches[0].id) {
        config.id = argMatches[0].id;
      }
    }
    var debugGui = new DebugGuiClient(config);

    return debugGui;
  }


  DebugGuiClient.debugger = new DebugGuiClient({id: 'DebugGui' });
  DebugGuiClient.getParameter = getParameter;
  DebugGuiClient.getCookie = getCookie;
  DebugGuiClient.getCookieFromValue = getCookieFromValue;
  DebugGuiClient.getHeaderOrCookie = getHeaderOrCookie;
  DebugGuiClient.express = express;
  DebugGuiClient.browser = browser;
  DebugGuiClient.node = node;
}

try {
  DebugGuiClient.xmlhr = XMLHttpRequest;
  DebugGuiClient.inBrowser = true;
} catch (e) {
  DebugGuiClient.inBrowser = false;
  DebugGuiClient.xmlhr = require('xmlhttprequest').XMLHttpRequest;
}

if (!DebugGuiClient.inBrowser) {
  exports.DebugGuiClient = DebugGuiClient;
} else {
  DebugGuiClient.UI_EXISTANCE_ID = 'debug-gui-ui-exists-globally-unique-id';
  if (document.currentScript &&
    document.currentScript.src.match(/^.*\/debug-gui-client.js$/)) {
    document.currentScript.id = DebugGuiClient.EXISTANCE_ID;
  }
  var dg = DebugGuiClient.browser('default');
}
;const MERRIAM_WEB_DEF_CNT_ID = 'ce-merriam-webster-def-cnt';
const MERRIAM_WEB_SUG_CNT_ID = 'ce-merriam-webster-suggestion-cnt';
const HISTORY_CNT_ID = 'ce-history-cnt';
const ADD_EDITOR_ID = 'ce-add-editor-id';
const CONTEXT_EXPLANATION_CNT_ID = 'ce-content-explanation-cnt';
const WIKI_CNT_ID = 'ce-wikapedia-cnt';
const RAW_TEXT_CNT_ID = 'ce-raw-text-cnt';
;
class Endpoints {
  constructor(config, host) {
    const instance = this;
    host = host || '';
    this.setHost = (newHost) => {
      if ((typeof newHost) === 'string') {
        host = config._envs[newHost] || newHost;
      }
    };
    this.setHost(host);
    this.getHost = (env) => env === undefined ? host : config._envs[env];

    const endPointFuncs = {setHost: this.setHost, getHost: this.getHost};
    this.getFuncObj = function () {return endPointFuncs;};


    function build(str) {
      const pieces = str.split(/:[a-zA-Z0-9]*/g);
      const labels = str.match(/:[a-zA-Z0-9]*/g) || [];
      return function () {
        let values = [];
        if (arguments[0] === null || (typeof arguments[0]) !== 'object') {
          values = arguments;
        } else {
          const obj = arguments[0];
          labels.map((value) => values.push(obj[value.substr(1)] !== undefined ? obj[value.substr(1)] : value))
        }
        let endpoint = '';
        for (let index = 0; index < pieces.length; index += 1) {
          const arg = values[index];
          let value = '';
          if (index < pieces.length - 1) {
            value = arg !== undefined ? encodeURIComponent(arg) : labels[index];
          }
          endpoint += pieces[index] + value;
        }
        return `${host}${endpoint}`;
      }
    }

    function configRecurse(currConfig, currFunc) {
      const keys = Object.keys(currConfig);
      for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];
        const value = currConfig[key];
        if (key.indexOf('_') !== 0) {
          if (value instanceof Object) {
            currFunc[key] = {};
            configRecurse(value, currFunc[key]);
          } else {
            currFunc[key] = build(value);
          }
        } else {
          currFunc[key] = value;
        }
      }
    }

    configRecurse(config, endPointFuncs);
  }
}

try {
  exports.EPNTS = new Endpoints(require('../public/json/endpoints.json')).getFuncObj();
} catch (e) {}

const EPNTS = new Endpoints({
  "_envs": {
    "local": "https://localhost:3001/content-explained",
    "dev": "https://dev.jozsefmorrissey.com/content-explained",
    "prod": "https://node.jozsefmorrissey.com/content-explained"
  },
  "user": {
    "add": "/user",
    "get": "/user/:idsOemail",
    "login": "/user/login",
    "update": "/user/update/:updateSecret",
    "requestUpdate": "/user/update/request"
  },
  "credential": {
    "add": "/credential/add/:userId",
    "activate": "/credential/activate/:id/:userId/:activationSecret",
    "delete": "/credential/:idOauthorization",
    "activationUrl": "/credential/activation/url/:activationSecret",
    "get": "/credential/:userId",
    "status": "/credential/status/:authorization"
  },
  "site": {
    "add": "/site",
    "get": "/site/get"
  },
  "explanation": {
    "add": "/explanation",
    "author": "/explanation/author/:authorId",
    "get": "/explanation/:words",
    "update": "/explanation"
  },
  "siteExplanation": {
    "add": "/site/explanation/:explanationId",
    "get": "/site/explanation"
  },
  "opinion": {
    "like": "/like/:explanationId/:siteId",
    "dislike": "/dislike/:explanationId/:siteId",
    "bySite": "/opinion/:siteId/:userId"
  },
  "endpoints": {
    "json": "/html/endpoints.json",
    "EPNTS": "/EPNTS/:env"
  },
  "images": {
    "logo": "/images/icons/logo.png",
    "wiki": "/images/icons/wikapedia.png",
    "txt": "/images/icons/txt.png",
    "merriam": "/images/icons/Merriam-Webster.png"
  },
  "merriam": {
    "search": "/merriam/webster/:searchText"
  },
  "comment": {
    "add": "/comment/add"
  },
  "question": {
    "add": "/question/add"
  },
  "notification": {
    "get": "/notifications"
  },
  "_secure": [
    "user.update",
    "credential.get",
    "credential.delete",
    "site.add",
    "explanation.add",
    "explanation.update",
    "siteExplanation.add",
    "opinion.like",
    "opinion.dislike",
    "comment.add"
  ]
}
, 'prod').getFuncObj();
try {exports.EPNTS = EPNTS;}catch(e){};
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
    this.filename = filename.replace(/(.*\/|)css\/(.{1,})\.css/g, '$2');
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
;// ./src/index/css.js
new CssFile('hover-resource', 'hover-explanation {   border-radius: 10pt;   background-color: rgba(150, 162, 249, 0.56); }  hover-explanation:hover {   font-weight: bolder; }  .ce-hover-max-min-cnt {   position: fixed; }  .ce-hover-max-min-abs-cnt {   position: absolute;   right: 22px;   z-index: 2; }  .ce-upper-right-btn {   padding: 0 5px;   border-radius: 3px;   margin: 1px;   background-color: transparent;   color: black;   border-color: gray;   border-width: .5px;   background-color: whitesmoke; }  #ce-hover-display-cnt-id {   padding: 0 10pt;   width: 100%; }  #ce-hover-switch-list-id {   margin: 0; }  .ce-hover-list {   padding: 0;   margin: 0;   margin-right: 5pt; }  .ce-hover-list-elem {   list-style: none;   font-size: medium;   color: blue;   font-weight: 600;   padding: 0 10pt; }  .ce-hover-list-elem.active {   background-color: #ada5a5;   border-radius: 10pt; }  .arrow-up {   width: 0;   height: 0;   border-left: 10px solid transparent;   border-right: 10px solid transparent;    border-bottom: 15px solid black; }  .arrow-down {   width: 0;   height: 0;   border-left: 20px solid transparent;   border-right: 20px solid transparent;    border-top: 20px solid #f00; }  .arrow-right {   width: 0;   height: 0;   border-top: 60px solid transparent;   border-bottom: 60px solid transparent;    border-left: 60px solid green; }  .arrow-left {   width: 0;   height: 0;   border-top: 10px solid transparent;   border-bottom: 10px solid transparent;    border-right:10px solid blue; }  #event-catcher-id {   position: fixed;   top: 0;   bottom: 0;   right: 0;   left: 0; }  .pop-out {   border: 1px solid;   border-radius: 5pt;   padding: 10px;   box-shadow: 3px 3px 6px black, 3px 3px 6px grey, 3px 3px 6px lightgrey; } ');

new CssFile('index', '.ce-history-list {   list-style: none;   margin: 0; here   padding: 0; }  .ce-history-list>li {   padding: 0 10pt;   font-weight: bolder; }  .ce-history-list>li.place-current-hist-loc {   border-style: solid;   border-width: .5px; }  .ce-comment-body-class {   padding: 5pt 1pt 5pt 5pt; }  .ce-comment-header-class {   padding-left: 5pt;   font-weight: bold;   border-style: solid;   border-color: #74767782;   border-width: 0 0 2px 0; } .ce-comment-cnt-class {   border-style: solid;   border-width: 2px;   border-color: #74767782;   background-color: white;   margin: 5pt 0pt 5pt 5pt;   border-radius: 5pt; }  .ce-comment-cnt-class.colored {   background-color: #2716b136; }  .ce-history-list>li:hover {   padding: 0 10pt;   background-color: #a9a9a973;   border-radius: 10pt; }  .ce-relative {   position: relative; }  .ce-width-full {   width: 100%; }  .ce-pointer {   cursor: pointer; }  .ce-pointer:hover {   background-color: #8080802e;   border-radius: 40pt; }  .ce-overflow {   overflow: auto; }  .ce-full {   width: 100%;   height: 100%; }  .ce-fixed {   position: fixed; }  .ce-error {   color: red; }  .ce-comment-control-cnt-class {   list-style: none;   padding: 0;   margin: 0;   display: inline-flex; }  .ce-comment-control-cnt-class>li {   margin-left: 10pt; }  .ce-comment-control-cnt-class>li>button {   padding: 0 5pt; }  .ce-padding {   padding: 5px; }  .ce-center {   text-align: center;   width: 100%; }  .ce-float-right {   float: right; }  .ce-no-bullet {   list-style: none; }  .ce-inline {   display: inline-flex; }  button {   background-color: blue;   color: white;   font-weight: bolder;   font-size: medium;   border-radius: 20pt;   padding: 4pt 10pt;   border-color: #7979ff; }  input {   padding: 1pt 3pt;   border-width: 1px;   border-radius: 5pt; } ');

new CssFile('lookup', '.ce-tab-ctn {   text-align: center;   display: inline-flex;   width: 100%; }  .ce-lookup-cnt {   width: 100%;   padding: 5pt;   padding-left: 50pt; }  .ce-lookup-expl-list-cnt {   min-height: 100pt;   overflow: auto; }  .ce-tabs-list {   display: block;   list-style-type: none;   width: max-content;   margin: auto;   padding: 0;   margin-right: 5pt; }  .ce-tabs-list-item {   padding: 4pt;   border-style: solid;   border-width: 1px;   border-radius: 10px;   margin: 2pt;   font-weight: bolder;   border-color: gray;   box-shadow: 1px 1px 2px black;   }  .ce-tabs-active {     background-color: gainsboro;     box-shadow: 0 0 0 black;   }  .ce-expl-card {   display: flex;   position: relative;   border: solid;   text-align: left;   border-width: 1px;   border-radius: 10px;   margin: 5px 0px;   border-color: grey;   box-shadow: 1px 1px 1px grey; }  .ce-expl-rating-column {   min-height: 70pt;   float: left;   padding: 2pt;   border-right: ridge;   border-color: black;   border-width: 1pt; }  .ce-expl-rating-cnt {   transform: translateY(-50%);   position: absolute;   top: 50%; }  .ce-like-btn {   width: 0;   height: 0;   border-color: transparent;   border-right: 10px solid transparent;   border-left: 10px solid transparent;   border-bottom: 10px solid #3dd23d;   cursor: pointer;   background-color: transparent;   border-radius: 0;   margin: 0;   padding: 0; } .ce-like-btn:disabled {   border-bottom: 10px solid grey; }  .ce-hover-expl-title-cnt {   display: inline-flex;   width: 100%;   text-align: center; }  .ce-dislike-btn {   width: 0;   height: 0;   border-color: transparent;   border-right: 10px solid transparent;   border-left: 10px solid transparent;   border-top: 10px solid #f74848;   cursor: pointer;   background-color: transparent;   border-radius: 0;   margin: 0;   padding: 0; }  .ce-dislike-btn:disabled {   border-top: 10px solid grey; }  .ce-expl-tag-cnt > span {   display: inline-flex;   margin: 0 5pt; }  .ce-small-text {     color: black;     font-size: x-small; }  .ce-add-editor-cnt {   width: 100%;   display: inline-flex; }  #ce-add-editor-id {   width: 98%;   height: 85%;   margin: 1%; }  #ce-add-editor-add-expl-btn-id {   margin: 0 0 0 10pt;   font-size: x-small;   top: 50%;   transform: translate(0, 25%); }  .ce-expls-cnt {   border: solid;   border-width: 1px;   border-radius: 10px;   margin: 5px 0px;   border-color: grey;   box-shadow: 1px 1px 1px grey;   padding: 5pt; }  .ce-apply-expl-btn-cnt {   position: relative;   width: 5%; }  .ce-expl-apply-btn {   position: relative;   top: 50%;   transform: translate(0, -50%); }  .ce-expl-apply-btn:disabled {     background-color: grey;     border-color: darkgray; }  .ce-expl-apply-cnt {   position: relative;   padding: 5px;   text-align: center;   border-right: black;   border-style: solid;   border-width: 0 1px 0 0; }  .ce-expl-cnt {   float: right;   padding: 0;   width: 100%;   display: inline-flex; }  .ce-expl {   padding: 2pt;   display: inline-flex;   width: inherit;   overflow-wrap: break-word; }  .ce-expl-card > .tags {   font-size: small;   color: grey; }    .ce-wiki-frame {      width: -webkit-fill-available;        height: -webkit-fill-available;   }    #ce-tag-input {       width: 50%;     margin-bottom: 10pt;     padding: 2pt;     border-radius: 10pt;     border-width: 1px;     border-color: gainsboro;   }    .ce-btn {     box-shadow: 1px 1px 1px grey;     border-style: solid;     border-width: 1px;     margin: 10px;     border-radius: 20px;     padding: 5px 15px;     background-color: white; }  #ce-lookup-header-padding-id {   padding-top: 60pt; }  .ce-merriam-header-cnt {   background-color: white;   min-height: 25px;   text-align: center;   width: 100%; }  .ce-lookup-expl-heading-cnt {   background-color: white;   z-index: 1000000000;   width: fit-content; }  .ce-key-cnt {   display: inline-flex; }  .ce-add-btn {     padding: 0 8px;     font-weight: bolder;     font-size: x-large;     color: green;     border-color: green;     box-shadow: 1px 1px 1px green; }  .ce-words-search-input {   font-size: x-large !important; }  .ce-words-search-btn {   padding: 0 8px;   margin: 0 20pt; }  .lookup-img {   width: 30pt; }  .ce-merriam-cnt {   text-align: center;   position: relative;   border: solid;   border-width: 1px;   border-radius: 10px;   margin: auto;   border-color: grey;   box-shadow: 1px 1px 1px grey; }  .ce-merriam-expl-card {   padding: 0 10px;   position: relative;   border: solid;   border-width: 1px;   border-radius: 10px;   margin: auto;   border-color: grey;   box-shadow: 1px 1px 1px grey; }  .ce-merriam-expl {   text-align: left; }  .ce-merriam-expl-cnt {   width: fit-content;   margin: auto; }  .ce-margin {   margin: 3pt; }  .ce-linear-tab {   font-size: 12pt;   padding: 0pt 5pt;   border-style: ridge;   border-radius: 10pt;   margin: 1pt 1pt;   display: inline-block;   white-space: nowrap; }  .ce-inline-flex {   display: inline-flex; }  #merriam-webster-submission-cnt {   margin: 2pt;   text-align: center;   display: flex;   overflow: scroll; } ');

new CssFile('menu', 'menu {   display: grid;   padding: 0;   margin: 0 0 0 10px; }  menuitem:hover {   background-color: #d8d8d8;   cursor: pointer; }  .back-btn:hover {   background-color: #d8d8d8;   cursor: pointer; }  .inline {   display: inline-flex; }  .fit {   width: fit-content; }  .right {   float:right; }  .back-btn {   background-color: transparent;   border-color: transparent;   font-size: x-large;   padding: 0;   margin: 0;   height: 100%; } ');

new CssFile('notification', '.one {   background-color: red; } .two {   background-color: white; } .three {   background-color: blue; } ');

new CssFile('place', '.place-history-cnt {   background: white;   width: fit-content;   height: fit-content;   border-style: groove;   border-radius: 10pt; }  .place-btn {   padding: 0 5px;   border-radius: 3px;   margin: 2px;   background-color: transparent;   color: black;   border-color: gray;   border-width: .5px;   background-color: whitesmoke; }  .place-right {   float: right; }  .place-max-min-cnt:hover {     opacity: 1; }  .place-max-min-cnt {     opacity: 0.1; }  .place-left {   float: left; }  .pop-out {   border: 1px solid;   border-radius: 5pt;   padding: 10px;   box-shadow: 3px 3px 6px black, 3px 3px 6px grey, 3px 3px 6px lightgrey; }  .place-max-min-cnt {   display: grid;   position: absolute;   top: 0;   right: 1%;   z-index: 100; }  .place-inline {   display: inline-flex; }  .place-full-width {   width: 100%; } ');

new CssFile('popup', '.ce-popup {   border: 1px solid;   border-radius: 5pt;   padding: 10px;   box-shadow: 3px 3px 6px black, 3px 3px 6px grey, 3px 3px 6px lightgrey; }  .ce-popup-shadow {   position: fixed;   left: 0;   top: 0;   width: 100%;   height: 100%;   text-align: center;   background:rgba(0,0,0,0.6);   padding: 20pt; } ');

new CssFile('settings', ' body {   height: 100%;   position: absolute;   margin: 0;   width: 100%; }  #ce-logout-btn {   position: absolute;   right: 50%;   bottom: 50%;   transform: translate(50%, 50%); }  #ce-profile-header-ctn {   display: inline-flex;   position: relative;   width: 100%; }  #ce-setting-cnt {   display: inline-flex;   height: 100%;   width: 100%; } #ce-setting-list {   list-style-type: none;   padding: 5pt; }  #ce-setting-list-cnt {   background-color: blue;   position: fixed;   height: 100vh; }  .ce-setting-list-item {   font-weight: 600;   font-size: medium;   color: aliceblue;   margin: 5pt 0;   padding: 0 10pt;   width: max-content; }  .ce-error-msg {   color: red; }  .ce-active-list-item {   background: dodgerblue;   border-radius: 15pt; }  #ce-login-cnt {   text-align: center;   width: 100%;   height: 100vh; }  #ce-login-center {   position: relative;   top: 50%;   transform: translate(0, -50%); } ');

new CssFile('text-to-html', '#raw-text-input {   min-height: 100vh;   width: 100%;   -webkit-box-sizing: border-box;    -moz-box-sizing: border-box;    /* Firefox, other Gecko */   box-sizing: border-box; } ');

;
class CustomEvent {
  constructor(name) {
    const watchers = [];
    this.name = name;
    this.on = function (func) {
      if ((typeof func) === 'function') {
        watchers.push(func);
      } else {
        return 'on' + name;
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
;function up(selector, node) {
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

function styleUpdate(elem, property, value) {
  function set(property, value) {
    elem.style[property] = value;
  }
  switch (typeof property) {
    case 'string':
      set(property, value);
      break;
    case 'object':
      const keys = Object.keys(property);
      for (let index = 0; index < keys.length; index += 1) {
        set(keys[index], property[keys[index]]);
      }
      break;
    default:
      throw new Error('argument not a string or an object: ' + (typeof property));
  }
}

function onEnter(id, func) {
  const elem = document.getElementById(id);
  if (elem !== null) {
    elem.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') func()
    });
  }
}

function elemSpacer(elem, pad) {
  elem.setAttribute('spacer-id', elem.getAttribute('spacer-id') || `elem-spacer-${Math.floor(Math.random() * 10000000)}`);
  const spacerId = elem.getAttribute('spacer-id');
  elem.style.position = '';
  elem.style.margin = '';
  elem.style.width = 'unset'
  elem.style.height = 'unset'
  const elemRect = elem.getBoundingClientRect();
  const spacer = document.getElementById(spacerId) || document.createElement(elem.tagName);
  spacer.id = spacerId;
  spacer.style.width = (elem.scrollWidth + (pad || 0)) + 'px';
  spacer.style.height = elem.scrollHeight + 'px';
  elem.style.width = (elem.scrollWidth + (pad || 0)) + 'px';
  elem.style.height = elem.scrollHeight + 'px';
  elem.style.margin = 0;
  elem.style.backgroundColor = 'white';
  elem.style.zIndex = 1;
  elem.after(spacer);
  elem.style.position = elem.getAttribute("position");
}

// const doesntWork...??? /<([a-zA-Z]{1,}[^>]{1,})on[a-z]{1,}=('|"|`)(\1|.*?([^\\]((\\\\)*?|[^\\])(\1)))([^>]*)>/;

class JsDetected extends Error {
  constructor(orig, clean) {
      super('Java script was detected');
      this.orig = orig;
      this.clean = clean;
  }
}

const jsAttrReg = /<([a-zA-Z]{1,}[^>]{1,})(\s|'|")on[a-z]{1,}=/;
function safeInnerHtml(text, elem) {
  if (text === undefined) return undefined;
  const clean = text.replace(/<script(| [^<]*?)>/, '').replace(jsAttrReg, '<$1');
  if (clean !== text) throw new JsDetected(text, clean);
  if (elem !== undefined) elem.innerHTML = clean;
  return clean;
}

function safeOuterHtml(text, elem) {
  const clean = safeInnerHtml(text);
  if (elem !== undefined) elem.outerHTML = clean;
  return clean;
}

const tabSpacing = new Array(2).fill('&nbsp;').join('');
function textToHtml(text, tabSpacing) {
  const tab = new Array(tabSpacing || 6).fill('&nbsp;').join('');
  safeInnerHtml(text);
  return text.replace(/\n/g, '<br>')
              .replace(/\t/g, tab)
              .replace(/\(([^\(^\)]*?)\)\s*\[([^\]\[]*?)\]/g,
                      '<a target=\'blank\' href="$2">$1</a>');
}

function strToHtml(str) {
  const container = document.createElement('div');
  container.innerHTML = safeInnerHtml(str);
  return container.children[0];
}
;class RegArr {
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
;
class KeyShortCut {
  constructor(keys, func) {
    KeyShortCut.cuts.push(this);
    var currentKeys = {};

    function keysPressed() {
      for (let index = 0; index < keys.length; index += 1) {
        if (!currentKeys[keys[index]]) {
          return false;
        }
      }
      return true;
    }

    this.keyDownListener = (e) => {
        currentKeys[e.key] = true;
        if (keysPressed()) func();
    }

    this.keyUpListener = (e) => delete currentKeys[e.key];
  }
}

KeyShortCut.cuts = [];

KeyShortCut.callOnAll = function (func, e) {
  for (let index = 0; index < KeyShortCut.cuts.length; index += 1) {
    KeyShortCut.cuts[index][func](e);
  }
}

document.onkeyup = (e) => KeyShortCut.callOnAll('keyUpListener', e);
document.onkeydown = (e) => KeyShortCut.callOnAll('keyDownListener', e);
;
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
;
class Page {
  constructor() {
    this.label = function () {throw new Error('Must implement label()');};
    this.html = function() {throw new Error('Must implement template()');}
    this.header = function() {return '';}
    this.beforeOpen = function () {};
    this.afterOpen = function () {};
    this.hide = function() {return false;}
  }
}
;
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
        retObj[key] = JSON.parse(JSON.stringify(properties[key]));
      }
    };

    function storageUpdate (values) {
      const keys = Object.keys(values);
      for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];
        const value = values[key];
        if (value && value.newValue !== undefined) {
          if (value.newValue !== value.oldValue) {
            instance.set(key, value.newValue);
          }
        } else if (value !== properties[key]) {
          instance.set(key, value);
        }
      }
    }

    function keyDefinitionCheck(key) {
      if (key === undefined) {
        throw new Error('key must be defined');
      }
    }

    this.onUpdate = function (keys, func, skipInit) {
      keyDefinitionCheck(keys);
      if (!Array.isArray(keys)) {
        keys = [keys];
      }
      if ((typeof func) !== 'function') throw new Error('update function must be defined');
      keys.forEach((key) => {
        if (updateFuncs[key] === undefined) {
          updateFuncs[key] = [];
        }
        updateFuncs[key].push(func);
        if (properties[key] !== undefined) {
          func(properties[key]);
        }
      });
    }

    this.toggle = function (key, save) {
      instance.set(key, !instance.get(key), save);
    }

    chrome.storage.local.get(null, storageUpdate);
    chrome.storage.onChanged.addListener(storageUpdate);
  }
}

const properties = new Properties();
;// ./src/index/properties.js

const lengthLimit = 64;
function search() {
  function lookup(searchWords) {
    searchWords = searchWords.trim().toLowerCase();
    if (searchWords) {
      lookupHoverResource.show();
      if (searchWords !== properties.get('searchWords'))
      if(searchWords.length < lengthLimit) {
        history.push(searchWords);
        properties.set('searchWords', searchWords);
        lookupTabs.update();
      } else if (searchWords.length > lengthLimit) {
        alert('Sorry you have exceeded the character limit of ' + lengthLimit);
      }
    }
  }

  function checkHighlight(e) {
    const selection = window.getSelection().toString().replace(/&nbsp;/, '');
    // Google Doc selection.
    // document.querySelector('.kix-selection-overlay')
    if (properties.get('enabled') && selection) {
      lookup(selection);
      window.getSelection().removeAllRanges();
      e.stopPropagation();
      e.preventDefault();
    }
  }

  function toggleEnable() {
    const enabled = properties.get('enabled');
    properties.set('enabled', !enabled, true);
  }

  document.addEventListener( "contextmenu", checkHighlight);
}

afterLoad.push(search);
;// ./src/index/properties.js

dg.setRoot('ce-ui');

Request = {
    onStateChange: function (success, failure, id) {
      return function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            const serverId = this.getResponseHeader('ce-server-id');
            const savedServerId = properties.get('ceServerId');
            if (serverId && serverId !== savedServerId) {
              properties.set('ceServerId', serverId, true);
              console.log('triggerededede')
              CE_SERVER_UPDATE.trigger();
            }

            try {
              resp = JSON.parse(this.responseText);
            } catch (e){
              resp = this.responseText;
            }
            if (success) {
              success(resp);
            }
          } else if (failure) {
            const errorMsgMatch = this.responseText.match(Request.errorMsgReg);
            if (errorMsgMatch) {
              this.errorMsg = errorMsgMatch[1].trim();
            }
            const errorCodeMatch = this.responseText.match(Request.errorCodeReg);
            if (errorCodeMatch) {
              this.errorCode = errorCodeMatch[1];

            }
            failure(this);
          }
          var resp = this.responseText;
          dg.value(id || Request.id(), 'response url', this.responseURL);
          dg.value(id || Request.id(), 'response', resp);
        }
      }
    },

    id: function (url, method) {
      return `request.${method}.${url.replace(/\./g, ',')}`;
    },

    get: function (url, success, failure) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      const id = Request.id(url, 'GET');
      dg.value(id, 'url', url);
      dg.value(id, 'method', 'get');
      dg.addHeaderXhr(xhr);
      xhr.onreadystatechange =  Request.onStateChange(success, failure, id);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', properties.get('user.credential'));
      xhr.send();
      return xhr;
    },

    hasBody: function (method) {
      return function (url, body, success, failure) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        const id = Request.id(url, method);
        dg.value(id, 'url', url);
        dg.value(id, 'method', method);
        dg.value(id, 'body', body);
        dg.addHeaderXhr(xhr);
        xhr.onreadystatechange =  Request.onStateChange(success, failure, id);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', properties.get('user.credential'));
        xhr.send(JSON.stringify(body));
        return xhr;
      }
    },

    post: function () {Request.hasBody('POST')(...arguments)},
    delete: function () {Request.hasBody('DELETE')(...arguments)},
    options: function () {Request.hasBody('OPTIONS')(...arguments)},
    head: function () {Request.hasBody('HEAD')(...arguments)},
    put: function () {Request.hasBody('PUT')(...arguments)},
    connect: function () {Request.hasBody('CONNECT')(...arguments)},
}

Request.errorCodeReg = /Error Code:([a-zA-Z0-9]*)/;
Request.errorMsgReg = /[a-zA-Z0-9]*?:([a-zA-Z0-9 ]*)/;

properties.onUpdate(['env', 'debug'], () => {
  const env = properties.get('env');
  if (properties.get('debug')) EPNTS.setHost(env);
});
properties.onUpdate(['debug', 'debugGuiHost', 'enabled'], () => {
  const debug = properties.get('debug');
  const enabled = properties.get('enabled');
  const host = properties.get('debugGuiHost') || 'https://localhost:3001/debug-gui';
  const id = properties.get('debugGuiId');
  if (debug && enabled) {
    const root = 'context-explained-ui';
    const cookieExists = document.cookie.match(/DebugGui=/);
    dg.updateConfig({root, host, id, debug: true});
  } else if (dg) {
    dg.updateConfig({debug: false});
  }
});
;
class CatchAll {
  constructor(container) {
    const instance = this;
    container = container || document.body;
    let events = Array.from(arguments).splice(1);
    events = events.length > 0 ? events : CatchAll.allMouseEvents;

    // const zIndex = 1000008;
    const backdrop = document.createElement('DIV');

    this.hide = () => backdrop.hidden = true;
    this.show = () => {
      backdrop.hidden = false
      instance.updateZindex();
    };

    this.updateZindex = (zIndex) => backdrop.style.zIndex = zIndex || CatchAll.findHigestZindex() + 1;

    this.on = (eventName, func) => backdrop.addEventListener(eventName, func);

    backdrop.style.position = 'fixed';
    backdrop.style.backgroundColor = 'transparent';

    // backdrop.style.cursor = 'none';
    backdrop.style.top = 0;
    backdrop.style.bottom = 0;
    backdrop.style.right = 0;
    backdrop.style.left = 0;
    const stopPropagation = (e) => e.stopPropagation();
    events.forEach((eventName) => instance.on(eventName, stopPropagation));
    container.append(backdrop);

    this.updateZindex();
    this.hide();
  }
}


CatchAll.allMouseEvents = ['auxclick', 'click', 'contextmenu', 'dblclick',
                        'mousedown', 'mouseenter', 'mouseleave', 'mousemove',
                        'mouseover', 'mouseout', 'mouseup', 'pointerlockchange',
                        'pointerlockerror', 'select', 'wheel'];

// Ripped off of: https://stackoverflow.com/a/1120068
CatchAll.findHigestZindex = function () {
  var elems = document.querySelectorAll('*');
  var highest = Number.MIN_SAFE_INTEGER || -(Math.pow(2, 53) - 1);
  for (var i = 0; i < elems.length; i++)
  {
    var zindex = Number.parseInt(
      document.defaultView.getComputedStyle(elems[i], null).getPropertyValue("z-index"),
      10
    );
    if (zindex > highest && zindex !== 2147483647)
    {
      highest = zindex;
    }
  }
  return highest;
}
;// ./src/index/popup-utils/catch-all.js

class Resizer {
  constructor (elem, axisObj, cursor) {
    const instance = this;
    const minimumSize = 40;
    let resizeId = elem.getAttribute(Resizer.resizeAttr);
    let sizeLocked = false;

    if (!resizeId) {
      resizeId = 'resize-' + Math.floor(Math.random() * 1000000);
      elem.setAttribute(Resizer.resizeAttr, resizeId);
    }

    this.show = () => {this.container.hidden = false; this.position()};
    this.hide = () => this.container.hidden = true;

    function updateZindex(zIndex) {
      if (instance.container.hidden === false) {
        instance.container.style.zIndex = zIndex;
        elem.style.zIndex = zIndex;
        Resizer.backdrop.updateZindex(zIndex + 1);
        instance.position();
      }
    }
    this.updateZindex = updateZindex;
    elem.addEventListener('click', () => Resizer.updateZindex(elem));


    if (resizeId) {
      if (!Resizer.collections[resizeId]) {
        Resizer.collections[resizeId] = [];
      }
      Resizer.collections[resizeId].push(this);
    }
    const padding = 8;
    let resize = false;
    let lastPosition;
    this.getPadding = () => padding;

    const attrs = Object.values(axisObj);
    const top = attrs.indexOf('top') !== -1;
    const bottom = attrs.indexOf('bottom') !== -1;
    const left = attrs.indexOf('left') !== -1;
    const right = attrs.indexOf('right') !== -1;

    this.container = document.createElement('DIV');
    this.container.style.cursor = cursor;
    this.container.style.padding = padding/2 + 'px';
    this.container.style.position = axisObj.position || 'absolute';
    this.container.style.backgroundColor = 'transparent';
    Resizer.container.append(this.container);

    function getComputedSize(element, property) {
      return Number.parseInt(window.getComputedStyle(element).getPropertyValue(property));
    }

    function resizeCnt (event) {
      if (resize) {
        Resizer.updateZindex(elem);
        let dy = resize.clientY - event.clientY;
        let dx = resize.clientX - event.clientX;
        let minHeight = getComputedSize(elem, 'min-height');
        let minWidth = getComputedSize(elem, 'min-width');
        if (axisObj.x) {
          if (left) dx *= -1;
          const newWidth = lastPosition.width - dx;
          if (newWidth > minWidth) {
            if (left) {
              elem.style.left = lastPosition.left + dx + 'px';
            }
            elem.style.width = newWidth + 'px'
          }
        }
        if (axisObj.y) {
          if (top) dy *= -1;
          const newHeight = lastPosition.height - dy;
          if (newHeight > minHeight) {
            if (top) {
              elem.style.top = lastPosition.top + window.scrollY + dy + 'px';
            }
            elem.style.height = newHeight + 'px'
          }
        }
      }
    }

    this.container.onmousedown = (e) => {
      resize = e;
      Resizer.backdrop.show();
      lastPosition = elem.getBoundingClientRect();
      e.stopPropagation();
      e.preventDefault();
    }

    function stopResizing() {
      if (resize) {
        resize = undefined;
        Resizer.position(elem);
        Resizer.backdrop.hide();
        Resizer.events.resize.trigger(elem);
      }
    }

    function isFixed() {
      return axisObj.position && axisObj.position === 'fixed';
    }

    this.container.addEventListener('click',
    (e) =>
    e.stopPropagation()
    );
    Resizer.backdrop.on('mouseup', stopResizing);
    this.container.onmouseup = stopResizing;

    this.container.onmousemove = resizeCnt;
    Resizer.backdrop.on('mousemove', resizeCnt);
    this.position = function () {
      const height = document.documentElement.clientHeight;
      const width = document.documentElement.clientWidth;
      const rect = elem.getBoundingClientRect();
      const cntStyle = instance.container.style;
      const scrollY =  isFixed() ? 0 : window.scrollY;
      const scrollX =  isFixed() ? 0 : window.scrollX;
      if (top) {
        cntStyle.top = rect.top - padding + scrollY + 'px';
      } else if (!bottom) {
        cntStyle.top = rect.top + scrollY + 'px';
      }

      if (bottom) {
        cntStyle.bottom = (height - rect.bottom) - padding - scrollY + 'px';
      } else if (!top) {
        cntStyle.bottom = (height - rect.bottom) - scrollY + 'px';
      }

      if (right) {
        cntStyle.right = (width - rect.right) - padding - scrollX + 'px';
      } else if (!left) {
        cntStyle.right = (width - rect.right) - scrollX + 'px';
      }

      if (left) {
        cntStyle.left = rect.left - padding + scrollX + 'px';
      } else if (!right) {
        cntStyle.left = rect.left + scrollX + 'px';
      }
    }
  }
}

Resizer.container = document.createElement('div');
document.body.append(Resizer.container);

Resizer.lastZindexSearch = new Date().getTime();
Resizer.zIndex = (zindex) => {
  const time = new Date().getTime();
  if (time > Resizer.lastZindexSearch + 500) {
    Resizer.zed = CatchAll.findHigestZindex();
    lastZindexSearch = time;
  }
  return Resizer.zed;
}
Resizer.container.id = 'resize-id-id';
Resizer.container.addEventListener('click', (e) => e.stopPropagation());
Resizer.events = {};
Resizer.events.resize = new CustomEvent ('resized')

Resizer.backdrop = new CatchAll(Resizer.container);

Resizer.resizeAttr = 'resizer-id'
Resizer.collections = {};
Resizer.position = function (elem) {
  const resizeId = elem.getAttribute(Resizer.resizeAttr);
  const collection = Resizer.collections[resizeId];
  if (collection) {
    collection.forEach((item) => item.position());
  }
}
Resizer.onEach = function (elem, func) {
  const callArgs = Array.from(arguments).splice(2);
  const resizeId = elem.getAttribute(Resizer.resizeAttr);
  const collection = Resizer.collections[resizeId];
  if (collection) {
    collection.forEach((item) => item[func](...callArgs));
  }
}
Resizer.hide = (elem) => Resizer.onEach(elem, 'hide');
Resizer.show = (elem) => {
    if (!Resizer.isLocked(elem)) {
      Resizer.onEach(elem, 'show');
      Resizer.updateZindex(elem);
    }
};
Resizer.updateZindex = (elem, callback) => {
  const highestZIndex = Resizer.zIndex() - 3;
  if (!elem.style.zIndex ||
      (elem.style.zIndex.match(/[0-9]{1,}/) &&
        highestZIndex > Number.parseInt(elem.style.zIndex))) {
    Resizer.onEach(elem, 'updateZindex', highestZIndex + 4);
  }
}

{
  const locked = {};
  Resizer.lock = (elem) => locked[elem.getAttribute(Resizer.resizeAttr)] = true;
  Resizer.unlock = (elem) => locked[elem.getAttribute(Resizer.resizeAttr)] = false;
  Resizer.isLocked  = (elem) => locked[elem.getAttribute(Resizer.resizeAttr)];
}

Resizer.all = (elem, position) => {
  new Resizer(elem, {y: 'top', position}, 'n-resize');
  new Resizer(elem, {y: 'bottom', position}, 's-resize');
  new Resizer(elem, {x: 'right', position}, 'e-resize');
  new Resizer(elem, {x: 'left', position}, 'w-resize', position);
  new Resizer(elem, {x: 'right', y: 'top', position}, 'ne-resize');
  new Resizer(elem, {x: 'left', y: 'top', position}, 'nw-resize');
  new Resizer(elem, {x: 'right', y: 'bottom', position}, 'se-resize');
  new Resizer(elem, {x: 'left', y: 'bottom', position}, 'sw-resize');
}
;// ./src/index/popup-utils/resizer.js

class DragDropResize {
  constructor (props) {
    props = props || {};
    const id = Math.floor(Math.random() * 1000000);
    const POPUP_CNT_ID = 'place-popup-cnt-id-' + id;
    const POPUP_CONTENT_ID = 'place-popup-content-id-' + id;
    const POPUP_CONTENT_CNT_ID = 'place-popup-content-cnt-id-' + id;
    const MAXIMIZE_BTN_ID = 'place-maximize-id-' + id;
    const POPUP_HEADER_CNT_ID = 'place-header-cnt-id-' + id;
    const MINIMIZE_BTN_ID = 'place-minimize-id-' + id;
    const MAX_MIN_CNT_ID = 'place-max-min-id-' + id;
    const CLOSE_BTN_ID = 'place-close-btn-id-' + id;
    const MOVE_BTN_ID = 'place-MOVE-btn-id-' + id;
    const BACK_BTN_ID = 'place-back-btn-id-' + id;
    const FORWARD_BTN_ID = 'place-forward-btn-id-' + id;
    const HISTORY_BTN_ID = 'place-history-btn-id-' + id;
    const position = props.position || 'absolute';
    const template = new $t('place');
    let lastMoveEvent, prevLocation, minLocation, selectElem,
        currElem, hasMoved;
    const instance = this;
    const closeFuncs = [];

    let width = '40vw';
    let height = '20vh';
    this.getDems = props.getDems || ( () => { return {width, height}; } );
    this.setDems = props.setDems || ( (w, h) => { width = w; height = h; } );

    this.hasMoved = () => hasMoved;
    function onResizeEvent() {
      const rect = popupCnt.getBoundingClientRect();
      if (!Resizer.isLocked(popupCnt)) instance.setDems({width: rect.width, height: rect.height});
    }

    const defaultStyle = `
      background-color: white;
      position: ${position};
      overflow: hidden;
      min-height: 20vh;
      min-width: 50vw;
      display: none;
      border: 1px solid;
      padding: 3pt;
      border-radius: 5pt;
      box-shadow: 3px 3px 6px black, 3px 3px 6px grey, 3px 3px 6px lightgrey;`;

    this.close = () => {
      getPopupElems().cnt.style.display = 'none';
      Resizer.hide(popupCnt);
      closeFuncs.forEach((func) => func());
      middleSize();
      histCnt.hidden = true;
    }
    this.hide = this.close;

    this.show = () => {
      if (instance.hidden()) {
        updateControls();
        const css = {display: 'block',
        height: Resizer.isLocked(popupCnt) ? undefined : instance.getDems().height,
        width: Resizer.isLocked(popupCnt) ? undefined : instance.getDems().width};
        if (Number.isFinite(css.height)) css.height = css.height + 'px';
        if (Number.isFinite(css.width)) css.width = css.width + 'px';

        setCss(css);
        if (!Resizer.isLocked(popupCnt)) Resizer.show(popupCnt);
        updateHistZindex();
      }
      return instance;
    };

    this.hidden = () => getPopupElems().cnt.style.display === 'none';

    this.withinPopup = (offset) => {
      const rect = getPopupElems().cnt.getBoundingClientRect();
      if (lastMoveEvent) {
        const withinX = lastMoveEvent.clientX < rect.right - offset && rect.left + offset < lastMoveEvent.clientX;
        const withinY = lastMoveEvent.clientY < rect.bottom - offset && rect.top + offset < lastMoveEvent.clientY;
        return withinX && withinY;
      }
      return false;
    }

    function updateHistZindex() {
      histCnt.style.zIndex = Number.parseInt(popupCnt.style.zIndex) + 1;
    }

    function getRelitiveRect(elem) {
      let rect;
      if (elem === undefined) {
        rect = {top: 0, bottom: 0, right: 0, left: 0, width: 100, height: 100};
      } else {
        rect = elem.getBoundingClientRect();
      }

      const absRect = {};
      const scrollOffset = getScrollOffset();
      absRect.top = rect.top + scrollOffset.y;
      absRect.bottom = rect.bottom + scrollOffset.y;
      absRect.right = rect.right + scrollOffset.x;
      absRect.left = rect.left + scrollOffset.x;
      absRect.width = rect.width;
      absRect.height = rect.height;
      return absRect
    }

    this.back = () => setCss(prevLocation);

    function positionOnElement(elem, container) {
      currElem = elem || currElem;
      instance.show();
      let rect = getRelitiveRect(currElem);
      let popRect = getRelitiveRect(container || getPopupElems().cnt);
      let padding = 8;

      let top = `${rect.top}px`;
      const position = {};
      position.close = instance.close;
      position.top = () =>{setCss({top: rect.top - popRect.height - padding + 'px'}, container); return position;};
      position.bottom = () =>{setCss({top: rect.bottom + padding + 'px'}, container); return position;};
      position.left = () =>{setCss({left: rect.left - popRect.width - padding + 'px'}, container); return position;};
      position.right = () =>{setCss({left: rect.right + padding + 'px'}, container); return position;};
      position.center = () =>{
              let left = rect.left - (popRect.width / 2) + (rect.width / 2);
              let top = rect.top - (popRect.height / 2) + (rect.height / 2);
              setCss({left: left + 'px', top: top + 'px'}, container);
              return position;};
      position.inView = () =>{
        let popRect = getRelitiveRect(container || getPopupElems().cnt);
        const left = (popRect.left > 10 ? popRect.left : 10) + 'px';
        const right = (popRect.right > 10 ? popRect.right : 10) + 'px';
        const top = (popRect.top > 10 ? popRect.top : 10) + 'px';
        const bottom = (popRect.bottom > 10 ? popRect.bottom : 10) + 'px';
        setCss({left, right, top, bottom}, container);
        return position;};
      position.maximize = instance.maximize.bind(position);
      position.minimize = instance.minimize.bind(position);
      if (window.innerHeight / 2 > rect.top - window.scrollY) {
        position.center().bottom().inView();
      } else {
        position.center().top().inView();
      }

      return position;
    }

    this.elem = positionOnElement;
    this.select = () => {
      if (window.getSelection().toString().trim()) {
        selectElem = window.getSelection().getRangeAt(0);
        currElem = selectElem;
      }
      return positionOnElement(selectElem);
    };
    this.top = () => setCss({top:0,bottom:''});
    this.left = () => setCss({right:'',left:0});
    this.bottom = () => setCss({top:'',bottom:0});
    this.right = () => setCss({right:0,left:''});

    this.center = function () {
      const popRect = getPopupElems().cnt.getBoundingClientRect();
      const top = `${(window.innerHeight / 2) - (popRect.height / 2)}px`;
      const left = `${(window.innerWidth / 2) - (popRect.width / 2)}px`;
      setCss({top,left, right: '', bottom: ''});
      return instance;
    }

    function showElem(id, show) {
      document.getElementById(id).hidden = !show;
    }

    function updateControls() {
      showElem(MINIMIZE_BTN_ID, !props.hideMin && (isMaximized || props.tabText !== undefined));
      showElem(MAXIMIZE_BTN_ID, !props.hideMax && !isMaximized());
      const hasPast = props.hasPast ? props.hasPast() : false;
      showElem(BACK_BTN_ID, hasPast);
      const hasFuture = props.hasFuture ? props.hasFuture() : false;
      showElem(FORWARD_BTN_ID, hasFuture);
      showElem(HISTORY_BTN_ID, hasFuture || hasPast);

    }

    function middleSize() {
      if (minLocation) {
        setCss({position, transform: 'unset', top: 'unset', bottom: 'unset', right: 'unset', left: 'unset', width: instance.getDems().width})
        setCss(minLocation);
        showElem(POPUP_HEADER_CNT_ID, false);
        showElem(POPUP_CONTENT_CNT_ID, true);
        prevLocation = minLocation;
        minLocation = undefined;
        updateControls();
        return true;
      }
      return false;
    }

    this.maximize = function () {
      if (!middleSize()) {
        setCss({position: 'fixed', top: 0, bottom: 0, right: 0, left:0, maxWidth: 'unset', maxHeight: 'unset', width: 'unset', height: '95vh'})
        minLocation = prevLocation;
        updateControls();
      }
      return this;
    }

    this.minimize = function () {
      if (!middleSize() && props.tabText) {
        console.log('tab-it')
        tabHeader.innerText = props.tabText();
        showElem(POPUP_HEADER_CNT_ID, true);
        showElem(POPUP_CONTENT_CNT_ID, false);
        setCss({left: 0, right: 0, bottom: 0, maxWidth: 'unset', maxHeight: 'unset', minWidth: 'unset',
                minHeight: 'unset', width: 'fit-content', height: 'fit-content',
                transform: 'rotate(90deg)'});
        minLocation = prevLocation;
        const rect = popupCnt.getBoundingClientRect();
        const left = (rect.width - rect.height)/2 + 'px';
        setCss({left});
        DragDropResize.events.tabbed.trigger(getPopupElems().cnt);
      }
      return this;
    }

    function setCss(rect, container) {
      if (container === undefined) {
        const popRect = getPopupElems().cnt.getBoundingClientRect();
        const top = getPopupElems().cnt.style.top;
        const bottom = getPopupElems().cnt.style.bottom;
        const left = getPopupElems().cnt.style.left;
        const right = getPopupElems().cnt.style.right;
        const maxWidth = getPopupElems().cnt.style.maxWidth;
        const maxHeight = getPopupElems().cnt.style.maxHeight;
        const width = getPopupElems().cnt.style.width;
        const height = getPopupElems().cnt.style.height;
        prevLocation = {top, bottom, left, right, maxWidth, maxHeight, width, height}
        setTimeout(() => Resizer.position(popupCnt), 0);
      }
      styleUpdate(container || getPopupElems().cnt, rect);
      return instance;
    }
    this.setCss = setCss;

    this.onClose = (func) => closeFuncs.push(func);

    function updateContent(html) {
      safeInnerHtml(html, getPopupElems().content);
      return instance;
    }
    this.updateContent = updateContent;

    function isMaximized() {
      return minLocation !== undefined;
    }
    this.isMaximized = isMaximized;

    function getScrollOffset() {
      let x,y;
      if (props.position === 'fixed') {
        y = 0;
        x = 0;
      } else {
        y = window.scrollY;
        x = window.scrollX;
      }
      return {x, y}
    }

    let moving;
    function move(e) {
      console.log('moving!');
      backdrop.show();
      Resizer.hide(popupCnt);
      const rect = popupCnt.getBoundingClientRect();
      const scrollOffset = getScrollOffset();
      moving = {clientX: e.clientX + scrollOffset.x,
                  clientY: e.clientY + scrollOffset.y,
                  top: rect.top + scrollOffset.y,
                  left: rect.left + scrollOffset.x};
      DragDropResize.events.dragstart.trigger(getPopupElems().cnt);
    }

    function get(name) {
      const prop = props[name];
      if ((typeof prop) === 'function') return prop();
      return prop;
    }

    function stopMoving() {
      moving = undefined;
      backdrop.hide();
      Resizer.position(popupCnt);
      DragDropResize.events.dragend.trigger(getPopupElems().cnt);
      DragDropResize.events.drop.trigger(getPopupElems().cnt);
      if (!Resizer.isLocked(popupCnt)) Resizer.show(popupCnt);
    }

    const tempElem = document.createElement('div');
    const tempHtml = template.render({POPUP_CNT_ID, POPUP_CONTENT_ID,
        MINIMIZE_BTN_ID, MAXIMIZE_BTN_ID, MAX_MIN_CNT_ID, CLOSE_BTN_ID,
        HISTORY_BTN_ID, FORWARD_BTN_ID, BACK_BTN_ID, MOVE_BTN_ID,
        POPUP_HEADER_CNT_ID, POPUP_CONTENT_CNT_ID,
        props});
    safeInnerHtml(tempHtml, tempElem);
    tempElem.children[0].style = defaultStyle;
    document.body.append(tempElem);

    const popupContent = document.getElementById(POPUP_CONTENT_ID);
    popupContent.style.overflow = 'auto';
    const popupCnt = document.getElementById(POPUP_CNT_ID);
    const histCnt = document.createElement('DIV');
    const tabHeader = document.getElementById(POPUP_HEADER_CNT_ID);
    tabHeader.onclick = this.maximize;
    const histFilter = document.createElement('input');
    histFilter.placeholder = 'filter';
    const histDisplayCnt = document.createElement('DIV');
    histCnt.append(histFilter);
    histCnt.append(histDisplayCnt);
    histDisplayCnt.style.maxHeight = '20vh';
    histDisplayCnt.style.overflow = 'auto';
    histCnt.style.position = position;
    histCnt.hidden = true;
    histCnt.className = 'place-history-cnt';
    document.body.append(histCnt);
    popupCnt.style = defaultStyle;
    popupCnt.addEventListener(Resizer.events.resize.name, onResizeEvent);
    document.getElementById(MAXIMIZE_BTN_ID).onclick = instance.maximize;
    document.getElementById(MINIMIZE_BTN_ID).onclick = instance.minimize;
    document.getElementById(CLOSE_BTN_ID).onclick = instance.close;
    document.getElementById(MOVE_BTN_ID).onclick = move;
    if (props.back) {
      document.getElementById(BACK_BTN_ID).onclick = () => {
        props.back();
        updateControls();
        event.stopPropagation();
        histDisplayCnt.innerHTML = props.historyDisplay(histFilter.value);
      }
    }
    if (props.forward) {
      document.getElementById(FORWARD_BTN_ID).onclick = () => {
        props.forward();
        updateControls();
        event.stopPropagation();
        histDisplayCnt.innerHTML = props.historyDisplay(histFilter.value);
      }
    }
    if (props.historyDisplay) {
      const historyBtn = document.getElementById(HISTORY_BTN_ID);
      historyBtn.onclick = (event) => {
        histCnt.hidden = false;
        histDisplayCnt.innerHTML = props.historyDisplay(histFilter.value);
        positionOnElement(historyBtn, histCnt).center().bottom();
        updateHistZindex();
        event.stopPropagation();
      }
      histCnt.onclick = (event) => {
        event.stopPropagation();
      }
      histDisplayCnt.onclick = (event) => {
        event.stopPropagation();
        if ((typeof props.historyClick) === 'function') {
          props.historyClick(event);
          updateControls();
          histDisplayCnt.innerHTML = props.historyDisplay(histFilter.value);
          histFilter.focus();
        }
      }
      histFilter.onkeyup = () => {
        histDisplayCnt.innerHTML = props.historyDisplay(histFilter.value);
        histFilter.focus();
      }
    }

    popupCnt.onclick = (e) => {
      histCnt.hidden = true;
      if (e.target.tagName !== 'A')
      e.stopPropagation()
    };

    // CssFile.apply('place');


    function getPopupElems() {
      return {cnt: popupCnt, content: popupContent};
    }

    let lastDragNotification = new Date().getTime()
    let lastMove = new Date().getTime()
    function mouseMove(e) {
      const time = new Date().getTime();
      const scrollOffset = getScrollOffset();
      lastMoveEvent = {clientX: e.clientX + scrollOffset.x,
                      clientY: e.clientY + scrollOffset.y};
      if (moving && lastMove < time + 100) {
        console.log('moving')
        const dy = moving.clientY - lastMoveEvent.clientY;
        const dx = moving.clientX - lastMoveEvent.clientX;
        const rect = popupCnt.getBoundingClientRect();
        popupCnt.style.top = moving.top - dy + 'px';
        popupCnt.style.left = moving.left - dx + 'px';
        if (lastDragNotification + 350 < time) {
          DragDropResize.events.drag.trigger(getPopupElems().cnt);
          lastDragNotification = time;
        }
      }
    }

    function on(eventName, func) {
      getPopupElems().content.addEventListener(eventName, func);
    }
    this.on = on;

    this.container = () => getPopupElems().cnt;
    this.lockSize = () => Resizer.lock(popupCnt);
    this.unlockSize = () => Resizer.unlock(popupCnt);

    Resizer.all(popupCnt, props.position);
    const backdrop = new CatchAll(popupCnt);
    backdrop.on('click', stopMoving);
    backdrop.on('mousemove', mouseMove);

    Resizer.position(popupCnt);
  }
}

DragDropResize.events = {};
DragDropResize.events.drag = new CustomEvent ('drag');
DragDropResize.events.dragend = new CustomEvent ('dragend');
DragDropResize.events.dragstart = new CustomEvent ('dragstart');
DragDropResize.events.drop = new CustomEvent ('drop');
DragDropResize.events.tabbed = new CustomEvent ('tabbed');

// drag	An element or text selection is being dragged (fired continuously every 350ms).
// dragend	A drag operation is being ended (by releasing a mouse button or hitting the escape key).
// dragstart	The user starts dragging an element or text selection.
// drop	An element is dropped on a valid drop target.
;// ./src/index/popup-utils/drag-drop.js

class HoverResources {
  constructor (props) {
    props = props || {}
    const instance = this;
    const htmlFuncs = {};
    let forceOpen = false;
    let lockOpen = false;
    let currFuncs, currElem;
    let canClose = false;
    let hoverOff = false;
    let closeFuncs = [];

    const popupCnt = new DragDropResize(props);
    popupCnt.hide();

    this.hover = (onOff) => {
      if ((typeof onOff) === 'boolean') {
        hoverOff =  !onOff;
      } else {
        hoverOff =  properties.get('hoverOff');
      }
    }
    this.position = () => popupCnt;


    this.softClose = () => {
      if (!lockOpen) {
        instance.close();
      }
    }

    this.close = () => {
        canClose = false;
        popupCnt.close();
        currElem = undefined;
        closeFuncs.forEach((func) => func());
    }

    this.forceOpen = () => {
      hoverOff = true; forceOpen = true; instance.show();
    };
    popupCnt.on('click', instance.forceOpen);
    this.forceClose = () => {hoverOff = false; forceOpen = false; instance.softClose();};
    this.show = () => {
      popupCnt.show();
    };

    function softClose() {
      if (!props.clickClose && canClose && !forceOpen && !popupCnt.hidden() && !popupCnt.withinPopup(-10)) {
        instance.softClose();
      }
    }

    function dontHoldOpen(event) {
      if (!canClose) popupCnt.withinPopup(10) && (canClose = true);
      if (canClose) {
        exitHover();
      }
    }

    function getFunctions(elem) {
      let foundFuncs;
      const queryStrs = Object.keys(htmlFuncs);
      queryStrs.forEach((queryStr) => {
        if (elem.matches(queryStr)) {
          if (foundFuncs) {
            throw new Error('Multiple functions being invoked on one hover event');
          } else {
            foundFuncs = htmlFuncs[queryStr];
          }
        }
      });
      return foundFuncs;
    }

    function offHover(event) {
      const elem = event.target;
      const funcs = getFunctions(elem);
      if (funcs) return;
      dontHoldOpen(event);
    }

    function onHover(event) {
      if (hoverOff || properties.get('hoverOff') || !properties.get('enabled')) return;
      const elem = event.target;
      if (!canClose) popupCnt.withinPopup(10) && (canClose = true);

      const funcs = getFunctions(elem);
      if (funcs) {
        if ((!funcs.disabled || !funcs.disabled()) && currElem !== elem) {
          currFuncs = funcs;
          if (funcs && funcs.html) updateContent(funcs.html(elem));
          popupCnt.elem(elem);
          if (funcs && funcs.after) funcs.after();
        }
      }
    }

    function exitHover() {
      setTimeout(softClose, 500);
    }


    function on(queryStr, funcObj) {
      if (htmlFuncs[queryStr] !== undefined) throw new Error('Assigning multiple functions to the same selector');
      htmlFuncs[queryStr] = funcObj;
    }
    this.on = on;

    this.onClose = (func) => closeFuncs.push(func);

    function updateContent(html) {
      popupCnt.updateContent(html);
      if (currFuncs && currFuncs.after) currFuncs.after();
      return instance;
    }
    this.updateContent = updateContent;

    function startHover() {
      document.addEventListener('mouseover', onHover);
      document.addEventListener('mouseout', offHover);
    }
    this.startHover = startHover;

    function stopHover() {
      document.removeEventListener('mouseover', onHover);
      document.removeEventListener('mouseout', offHover);
    }
    this.stopHover = stopHover;

    this.container = popupCnt.container;
    this.hasMoved = popupCnt.hasMoved;
    this.lockSize = popupCnt.lockSize;
    this.unlockSize = popupCnt.unlockSize;
    this.lockOpen = () => lockOpen = true;
    this.unlockOpen = () => lockOpen = false;

    document.addEventListener('mousemove', softClose);
    document.addEventListener('click', this.forceClose);
    startHover();
  }
}

afterLoad.push(() => new KeyShortCut(['c','e'], () => {
  properties.toggle('hoverOff', true);
}));
;
class User {
  constructor() {
    let user;
    let status;
    const instance = this;
    function dispatch(eventName, values) {
      return function (err) {
        const evnt = new Event(eventName);
        Object.keys(values).map((key) => evnt[key] = values[key])
        document.dispatchEvent(evnt);
        if (err) {
          console.error(err);
        }
      }
    }
    function dispatchUpdate() {
      dispatch(instance.updateEvent(), {
        user: instance.loggedIn(),
        status
      })();
    }
    function dispatchError(errorMsg) {
      return dispatch(instance.errorEvent(), {errorMsg});
    }
    function setUser(u) {
      user = u;
      dispatchUpdate();
      console.log('update user event fired')
    }

    function updateStatus(s) {
      status = s;
      properties.set('user.status', status, true);
      dispatchUpdate();
      console.log('update status event fired');
    }

    this.status = () => status;
    this.errorEvent = () => 'UserErrorEvent';
    this.updateEvent = () => 'UserUpdateEvent'
    this.isLoggedIn = function (defVal) {
      return status === undefined ? defVal : status === 'active';
    }
    this.loggedIn = () => instance.isLoggedIn() ? JSON.parse(JSON.stringify(user || {})) : undefined;

    this.get = function (email, success, fail) {
      if (email.match(/^.{1,}@.{1,}\..{1,}$/)) {
        const url = EPNTS.user.get(email);
        Request.get(url, success, fail);
      } else {
        fail('Invalid Email');
      }
    }

    function removeCredential() {
      const cred = properties.get('user.credential');
      if (cred !== null) {
        properties.set('user.credential', null, true);
        instance.update();
      }

      user = undefined;
      updateStatus('expired');
    }

    this.logout = function () {
      const cred = properties.get('user.credential');
      dispatchUpdate();
      if(cred !== null) {
        if (status === 'active') {
          const deleteCredUrl = EPNTS.credential.delete(cred);
          Request.delete(deleteCredUrl, removeCredential, instance.update);
        } else {
          removeCredential();
        }
      }
    };

    const userCredReg = /^User ([0-9]{1,})-.*$/;
    this.update = function (credential) {
      if ((typeof credential) === 'string') {
        if (credential.match(userCredReg)) {
          properties.set('user.credential', credential, true);
        } else {
          removeCredential();
          credential = null;
        }
      } else {
        credential = properties.get('user.credential');
      }
      if ((typeof credential) === 'string') {
        let url = EPNTS.credential.status(credential);
        Request.get(url, updateStatus, () => updateStatus('expired'));
        url = EPNTS.user.get(credential.replace(userCredReg, '$1'));
        Request.get(url, setUser);
      } else if (credential === null || credential === undefined) {
        updateStatus('expired');
        instance.logout(true);
      }
    };

    const addCredErrorMsg = 'Failed to add credential';
    this.addCredential = function (uId) {
      if (user !== undefined) {
        const url = EPNTS.credential.add(user.id);
        Request.get(url, instance.update, dispatchError(addCredErrorMsg));
      } else if (uId !== undefined) {
        const url = EPNTS.credential.add(uId);
        Request.get(url, instance.update, dispatchError(addCredErrorMsg));
      }
    };

    this.register = function (email, username) {
      const url = EPNTS.user.add();
      const body = {email, username};
      Request.post(url, body, instance.update, dispatchError('Registration Failed'));
    };

    this.openLogin = () => {
      const tabId = properties.get("SETTINGS_TAB_ID")
      const page = properties.get("settingsPage");
      window.open(`${page}#Login`, tabId);
    };

    afterLoad.push(() => properties.onUpdate(['user.credential', 'user.status'], () => this.update()));
  }
}

User = new User();
;
class ToggleMenu {
  constructor() {
    const instance = this;
    const controlTemplate = new $t('popup-cnt/tab-contents/comment-controls');
    this.togglesById = {};
    this.toggles = [];
    const uniqId = Math.floor(Math.random() * 100000000);
    this.TOGGLE_MENU_ID = 'ce-toggle-MENU-id-' + uniqId;
    ToggleMenu.menue[this.TOGGLE_MENU_ID] = this;
    for (let index = 0; index < arguments.length; index += 1) {
      let toggle = JSON.parse(JSON.stringify(arguments[index]));
      this.toggles.push(toggle);
      this.togglesById[toggle.id] = toggle;
    }

    this.toggle = (id, onOff) => {
      const toggler = this.togglesById[id];
      toggler.showing = onOff !== undefined ? onOff :!toggler.showing;
      const toggleTarget = document.getElementById(id);
      toggleTarget.hidden = !toggler.showing;
      if (toggler.showing === true) {
        toggler.disabled = false;
        const toggleBtn = document.querySelector(`[toggle-id=${id}]`);
        toggleBtn.hidden = false;
        toggleBtn.disabled = false;
      }
      instance.update();

    };
    this.showing = (id) => toggler.showing;
    this.html = () => controlTemplate.render(this);
    this.update = () => {
      const container = document.getElementById(instance.TOGGLE_MENU_ID).parentElement;
      container.innerHTML = instance.html();
    }
  }
}

{
  ToggleMenu.menue = {};
  ToggleMenu.watching = [];
  let toggled = (event) => {
    const elem = event.target;
    if (elem.matches('button[toggle-id]')) {
      const toggleId = elem.getAttribute('toggle-id');
      const listElem = elem.parentElement.parentElement
      const toggleMenuId = listElem.getAttribute('id');
      const toggleMenu = ToggleMenu.menue[toggleMenuId];
      toggleMenu.toggle(toggleId);
    }
  }

  ToggleMenu.watch = (container) => {
    if (ToggleMenu.watching.indexOf(container) === -1) {
      container.addEventListener('click', toggled);
    }
  }
}


class Comment {
  constructor(explanation, comment, color) {
    const template = new $t('popup-cnt/tab-contents/add-comment');
    const controlTemplate = new $t('popup-cnt/tab-contents/comment-controls');
    const COMMENT_SUBMIT_BTN_CLASS = 'ce-comment-submit-btn-class';
    const scope = {explanation, comment};
    scope.rating = 0;
    if (comment) {
      scope.rating = Math.ceil(comment.author.likes / (comment.author.dislikes + comment.author.likes));
    }
    const uniqId = Math.floor(Math.random() * 100000000);
    scope.ROOT_ELEM_ID = 'ce-comment-root-elem-id-' + uniqId;
    scope.ADD_CNT_ID = 'ce-comment-add-cnt-id-' + uniqId;
    scope.COMMENTS_CNT_ID = 'ce-comments-cnt-id-' + uniqId;
    scope.TEXT_AREA_INPUT_ID = 'ce-comment-textarea-id-' + uniqId;
    scope.CONTROLS_CNT_ID = 'ce-comment-controls-id-' + uniqId;
    scope.showComments = comment === undefined;
    scope.showAdd = false;
    scope.commentHtml = '';
    scope.color = color;
    scope.value = comment === undefined ? '' : comment.value;
    let found = false;
    for (let index = 0; explanation.comments && index < explanation.comments.length; index += 1) {
      const childComment = explanation.comments[index];
      if ((comment === undefined && childComment.commentId === null) ||
          (comment !== undefined && comment.id === childComment.commentId)) {
        found = true;
        scope.commentHtml += Comment.for(null, explanation, childComment, !color).html();
      }
    }
    const toggleComments = new ToggleMenu({
      id: scope.COMMENTS_CNT_ID,
      showing: scope.showComments,
      show: {text: 'Show Comments'},
      hide: {text: 'Hide Comments'},
      disabled: !found
    });
    scope.commentToggle = () => toggleComments.html();

    const toggleAdd = new ToggleMenu({
      id: scope.ADD_CNT_ID,
      showing: scope.showAdd,
      hide: {text: 'Close Comment'},
      show: {text: 'Add Comment'},
      disabled: !User.isLoggedIn()
    });
    scope.addToggle = () => toggleAdd.html();


    this.add = (dbComment) => {
      const container = document.getElementById(scope.COMMENTS_CNT_ID).children[0];
      const newComment = Comment.for(null, explanation, dbComment, !color);
      toggleAdd.toggle(scope.ADD_CNT_ID, false);
      toggleComments.toggle(scope.COMMENTS_CNT_ID, true);
      container.append(strToHtml(newComment.html()));
    }
    this.html = () => template.render(scope);
  }
}

{
  let hypenStrs = function () {
    let str = arguments[0];
    for (let index = 1; index < arguments.length; index += 1) {
      str += '-' + arguments[index];
    }
    return str;
  }
  let uniqueId = (explanation, comment) => {
    const commentId = comment ? comment.id : undefined;
    return hypenStrs(explanation.id, commentId);
  }



  let submit = (event) => {
    const elem = event.target;
    if (elem.matches('.ce-comment-submit-btn-class')) {
      const textarea = document.getElementById(elem.getAttribute('textarea-id'));
      const value = textarea.value;
      const siteId = properties.get('siteId');
      const explanationId = Number.parseInt(textarea.getAttribute('explanation-id'));
      const commentId = textarea.getAttribute('comment-id') || undefined;
      const uniqId = hypenStrs(explanationId, commentId);
      let addSuccess = (comment) => cache[uniqId].add(comment);
      let addFailure = (comment) => console.log(comment, '\nfailure!!!');
      Expl.addComment(value, siteId, explanationId, commentId, addSuccess, addFailure);
    }
  }

  let cache = {};
  let watching = [];
  Comment.for = (container, explanation, comment, color) => {
    const uniqId = uniqueId(explanation, comment);
    if (!cache[uniqId]) {
      cache[uniqId] = new Comment(explanation, comment, color);
      if (container && watching.indexOf(container) === -1) {
        container.addEventListener('click', submit);
        ToggleMenu.watch(container);
      }
    }
    return cache[uniqId];
  }

}
;
class $t {
	constructor(template, id) {
		function varReg(prefix, suffix) {
		  const vReg = '([a-zA-Z_\\$][a-zA-Z0-9_\\$]*)';
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
		const relationalProps = {opening: /((\<|\>|\<\=|\>\=|\|\||\||&&|&))/};
		const ternaryProps = {opening: /\?/};
		const keyWordProps = {opening: /(new|null|undefined|NaN|true|false)[^a-z^A-Z]/, tailOffset: -1};
		const ignoreProps = {opening: /new \$t\('.*?'\).render\(get\('scope'\), '(.*?)', get\)/};
		const commaProps = {opening: /,/};
		const colonProps = {opening: /:/};
		const multiplierProps = {opening: /(===|[-+=*\/](=|))/};
		const stringProps = {opening: /('|"|`)(\1|.*?([^\\]((\\\\)*?|[^\\])(\1)))/};
		const spaceProps = {opening: /\s{1}/};
		const numberProps = {opening: /[0-9]*((\.)[0-9]*|)/};
		const objectProps = {opening: '{', closing: '}'};
		const objectLabelProps = {opening: varReg(null, '\\:')};
		const groupProps = {opening: /\(/, closing: /\)/};
		const expressionProps = {opening: null, closing: null};
		const attrProps = {opening: varReg('(\\.', '){1,}')};

		// const funcProps = {
		//   opening: varReg(null, '\\('),
		//   onOpen: replace(varReg(null, '\\('), 'get("$1")('),
		//   closing: /\)/
		// };
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
		const attr = new ExprDef('attr', attrProps);
		// const func = new ExprDef('func', funcProps);
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
		expression.if(string, number, group, array, variable)
		      .then(multiplier, sign, relational, group)
		      .repeat();
		expression.if(string, group, array, variable)
					.then(attr)
		      .then(multiplier, sign, relational, expression)
					.repeat();
		expression.if(string, group, array, variable)
					.then(attr)
					.end();
		expression.if(sign)
		      .then(expression)
		      .then(multiplier, sign, relational, group)
		      .repeat();
		expression.if(string, number, group, array, variable)
		      .then(ternary)
		      .then(expression)
		      .then(colon)
		      .then(expression)
		      .end();
		expression.if(ternary)
		      .then(expression)
		      .then(colon)
		      .then(expression)
		      .end();
		expression.if(object, string, number, group, array, variable)
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
		group.if(expression).then(comma).repeat();
		group.if(expression).end();

		array.always(space, ignore, keyWord);
		array.if(expression).then(comma).repeat();
		array.if(expression).end();

		function getter(scope, parentScope) {
			parentScope = parentScope || function () {return undefined};
			function get(name) {
				if (name === 'scope') return scope;
				const split = new String(name).split('.');
				let currObj = scope;
				for (let index = 0; currObj != undefined && index < split.length; index += 1) {
					currObj = currObj[split[index]];
				}
				if (currObj !== undefined) return currObj;
				const parentScopeVal = parentScope(name);
				if (parentScopeVal !== undefined) return parentScopeVal;
				return '';
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
				try {
					return $t.functions[id](get);
				} catch (e) {
				  console.error(e);
				}
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
				// console.log('\n\n\nformrepeat: ', string, '\n\n\n')
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
;// ./src/index/services/$t.js

$t.functions['492362584'] = function (get) {
	return `<div class='ce-full-width' id='` + (get("elem").id()) + `'></div>`
}
$t.functions['863427587'] = function (get) {
	return `<li class='ce-tab-list-item' ` + (get("elem").show() ? '' : 'hidden') + `> <img class="lookup-img" src="` + (get("elem").imageSrc()) + `"> </li>`
}
$t.functions['906579606'] = function (get) {
	return `<li class='ce-hover-list-elem` + (get("expl").id === get("active").expl.id ? " active": "") + `' > ` + (get("expl").words) + `&nbsp;<b class='ce-small-text'>(` + (get("expl").popularity) + `%)</b> </li>`
}
$t.functions['1165578666'] = function (get) {
	return `<option value='` + (get("sug")) + `' ></option>`
}
$t.functions['1266551310'] = function (get) {
	return `<option value='` + (get("words")) + `' ></option>`
}
$t.functions['1496787416'] = function (get) {
	return `<menuitem > ` + (get("notification")) + ` </menuitem>`
}
$t.functions['1663607604'] = function (get) {
	return `<menuitem > ` + (get("site")) + ` </menuitem>`
}
$t.functions['1870015841'] = function (get) {
	return `<div class='ce-margin'> <div class='ce-merriam-expl-card'> <div class='ce-merriam-expl-cnt'> <h3>` + (get("item").hwi.hw) + `</h3> ` + (new $t('<div class=\'ce-merriam-expl\'> {{def}} <br><br> </div>').render(get('scope'), 'def in item.shortdef', get)) + ` </div> </div> </div>`
}
$t.functions['2085205162'] = function (get) {
	return `<li ><button toggle-id='` + (get("toggle").id) + `' ` + (get("toggle").disabled ? ' hidden disabled' : '') + `> ` + (get("toggle").showing ? get("toggle").hide.text : get("toggle").show.text) + ` </button></li>`
}
$t.functions['history'] = function (get) {
	return `<div> <ul class='ce-history-list'> ` + (new $t('<li  value=\'{{elem.index}}\' class=\'{{!filtered && elem.index === history.currentPosition ? \'place-current-hist-loc\' : \'\'}}\'> {{!filtered && elem.index === history.currentPosition ? \'\' : elem.elem}} </li>').render(get('scope'), 'elem in history.list', get)) + ` </ul> </div> `
}
$t.functions['-2107865266'] = function (get) {
	return `<li value='` + (get("elem").index) + `' class='` + (!get("filtered") && get("elem").index === get("history").currentPosition ? 'place-current-hist-loc' : '') + `'> ` + (!get("filtered") && get("elem").index === get("history").currentPosition ? '' : get("elem").elem) + ` </li>`
}
$t.functions['hover-explanation'] = function (get) {
	return `<div> <div class="ce-inline ce-width-full"> <div class=""> <ul id='` + (get("SWITCH_LIST_ID")) + `' class='ce-hover-list'> ` + (new $t('<li class=\'ce-hover-list-elem{{expl.id === active.expl.id ? " active": ""}}\' > {{expl.words}}&nbsp;<b class=\'ce-small-text\'>({{expl.popularity}}%)</b> </li>').render(get('scope'), 'expl in active.list', get)) + ` </ul> </div> <div class='ce-width-full'> <div class='ce-hover-expl-title-cnt'> <div id='` + (get("VOTEUP_BTN_ID")) + `' class='ce-center` + (get("canLike") ? " ce-pointer" : "") + `'> <button class='ce-like-btn'` + (get("canLike") ? '' : ' disabled') + `></button> <br> ` + (get("likes")) + ` </div> <h3>` + (get("active").expl.words) + `</h3> <div id='` + (get("VOTEDOWN_BTN_ID")) + `' class='ce-center` + (get("canDislike") ? " ce-pointer" : "") + `'> ` + (get("dislikes")) + ` <br> <button class='ce-dislike-btn'` + (get("canDislike") ? '' : ' disabled') + `></button> </div> &nbsp;&nbsp;&nbsp;&nbsp; </div> <div class=''> <div>` + (get("content")) + `</div> </div> <div class='ce-center'` + (get("hideComments") ? ' hidden' : '') + `> <button ` + (get("loggedIn") ? ' hidden' : '') + ` id='` + (get("LOGIN_BTN_ID")) + `'> Login </button> <button ` + (get("authored") ? '' : ' hidden') + ` id='` + (get("EDIT_BTN_ID")) + `'> Edit </button> </div> <div` + (get("hideComments") ? ' hidden' : '') + `> <h3>Comments</h3> ` + (get("commentHtml")) + ` </div> </div> </div> </div> `
}
$t.functions['icon-menu/links/developer'] = function (get) {
	return `<div> <div> <label>Environment:</label> <select id='` + (get("ENV_SELECT_ID")) + `'> ` + (new $t('<option  value="{{env}}" {{env === currEnv ? \'selected\' : \'\'}}> {{env}} </option>').render(get('scope'), 'env in envs', get)) + ` </select> </div> <div> <label>Debug Gui Host:</label> <input type="text" id="` + (get("DG_HOST_INPUT_ID")) + `" value="` + (get("debugGuiHost")) + `"> </div> <div> <label>Debug Gui Id:</label> <input type="text" id="` + (get("DG_ID_INPUT_ID")) + `" value="` + (get("debugGuiId")) + `"> </div> </div> `
}
$t.functions['-67159008'] = function (get) {
	return `<option value="` + (get("env")) + `" ` + (get("env") === get("currEnv") ? 'selected' : '') + `> ` + (get("env")) + ` </option>`
}
$t.functions['icon-menu/links/favorite-lists'] = function (get) {
	return `<h1>favorite lists</h1> `
}
$t.functions['icon-menu/links/login'] = function (get) {
	return `<div id='ce-login-cnt'> <div id='ce-login-center'> <h3 class='ce-error-msg'>` + (get("errorMsg")) + `</h3> <div ` + (get("state") === get("LOGIN") ? '' : 'hidden') + `> <input type='text' placeholder="Email" id='` + (get("EMAIL_INPUT")) + `' value='` + (get("email")) + `'> <br/><br/> <button type="button" id='` + (get("LOGIN_BTN_ID")) + `'>Submit</button> </div> <div ` + (get("state") === get("REGISTER") ? '' : 'hidden') + `> <input type='text' placeholder="Username" id='` + (get("USERNAME_INPUT")) + `' value='` + (get("username")) + `'> <br/><br/> <button type="button" id='` + (get("REGISTER_BTN_ID")) + `'>Register</button> </div> <div ` + (get("state") === get("CHECK") ? '' : 'hidden') + `> <h4>To proceed check your email confirm your request</h4> <br/><br/> <button type="button" id='` + (get("RESEND_BTN_ID")) + `'>Resend</button> <h2>or<h2/> <button type="button" id='` + (get("LOGOUT_BTN_ID")) + `'>Use Another Email</button> </div> </div> </div> `
}
$t.functions['icon-menu/links/profile'] = function (get) {
	return `<div> <div> <button id='` + (get("LOGOUT_BTN_ID")) + `' type="submit">Logout</button> </div> <div id='ce-profile-header-ctn'> <h1>` + (get("username")) + `</h1> &nbsp;&nbsp;&nbsp;&nbsp; </div> <h3>` + (get("importantMessage")) + `</h3> <form id=` + (get("UPDATE_FORM_ID")) + `> <div> <label for="` + (get("USERNAME_INPUT_ID")) + `">New Username:</label> <input class='ce-float-right' id='` + (get("USERNAME_INPUT_ID")) + `' type="text" name="username" value=""> <br><br> <label for="` + (get("NEW_EMAIL_INPUT_ID")) + `">New Email:&nbsp;&nbsp;&nbsp;&nbsp;</label> <input class='ce-float-right' id='` + (get("NEW_EMAIL_INPUT_ID")) + `' type="email" name="email" value=""> </div> <br><br><br> <div> <label for="` + (get("CURRENT_EMAIL_INPUT_ID")) + `">Confirm Current Email:</label> <input required class='ce-float-right' id='` + (get("CURRENT_EMAIL_INPUT_ID")) + `' type="email" name="currentEmail" value=""> </div> <br> <div class="ce-center"> <button id='` + (get("UPDATE_BTN_ID")) + `' type="submit" name="button">Update</button> </div> </form> <div> <label>Likes:</label> <b>` + (get("likes")) + `</b> </div> <br> <div> <label>DisLikes:</label> <b>` + (get("dislikes")) + `</b> </div> </div> `
}
$t.functions['icon-menu/links/raw-text-input'] = function (get) {
	return `<div class='ce-padding ce-full'> <div class='ce-padding'> <label>TabSpacing</label> <input type="number" id="` + (get("TAB_SPACING_INPUT_ID")) + `" value="` + (get("tabSpacing")) + `"> </div> <textarea id='` + (get("RAW_TEXT_INPUT_ID")) + `' style='height: 90%; width: 95%;'></textarea> </div> `
}
$t.functions['icon-menu/links/raw-text-tool'] = function (get) {
	return `<div id='` + (get("RAW_TEXT_CNT_ID")) + `'> Enter text to update this content. </div> `
}
$t.functions['icon-menu/menu'] = function (get) {
	return ` <menu> <menuitem id='login-btn'> ` + (!get("loggedIn") ? 'Login': 'Logout') + ` </menuitem> <menuitem id='notifications' ` + (get("loggedIn") ? '' : ' hidden') + `> Notifications </menuitem> <menuitem id='hover-btn'> Hover:&nbsp;` + (get("hoverOff") ? 'OFF': 'ON') + ` </menuitem> <menuitem id='enable-btn'> ` + (get("enabled") ? 'Disable': 'Enable') + ` </menuitem> <menuitem id='settings'> Settings </menuitem> </menu> `
}
$t.functions['icon-menu/notifications'] = function (get) {
	return `<div class='inline'> <div> <button class="back-btn" id="back-button">&#x2190;</button> </div> <div> <div> <b>Notifications</b> <menu class='fit'> ` + (new $t('<menuitem > {{notification}} </menuitem>').render(get('scope'), 'notification in currentAlerts', get)) + ` </menu> </div> <div> <b>Elsewhere</b> <menu class='fit'> ` + (new $t('<menuitem > {{site}} </menuitem>').render(get('scope'), 'site in otherSites', get)) + ` </menu> </div> </div> </div> `
}
$t.functions['popup-cnt/linear-tab'] = function (get) {
	return `<span class='ce-linear-tab'>` + (get("scope")) + `</span> `
}
$t.functions['place'] = function (get) {
	return `<div id='` + (get("POPUP_CNT_ID")) + `'> <div class='ce-full'> <div hidden id='` + (get("POPUP_HEADER_CNT_ID")) + `'> tab </div> <div id='` + (get("POPUP_CONTENT_CNT_ID")) + `' class='ce-full'> <div class='place-max-min-cnt' id='` + (get("MAX_MIN_CNT_ID")) + `' position='absolute'> <div class='place-full-width'> <div class='place-inline place-right'> <button class='place-btn place-right' id='` + (get("BACK_BTN_ID")) + `'> &pr; </button> <button class='place-btn place-right' id='` + (get("HISTORY_BTN_ID")) + `'> &equiv; </button> <button class='place-btn place-right' id='` + (get("FORWARD_BTN_ID")) + `'> &sc; </button> <button class='place-btn place-right'` + (get("props").hideMove ? ' hidden' : '') + ` id='` + (get("MOVE_BTN_ID")) + `'> &#10021; </button> <button class='place-btn place-right'` + (get("props").hideMin ? ' hidden' : '') + ` id='` + (get("MINIMIZE_BTN_ID")) + `' hidden> &#95; </button> <button class='place-btn place-right'` + (get("props").hideMax ? ' hidden' : '') + ` id='` + (get("MAXIMIZE_BTN_ID")) + `'> &square; </button> <button class='place-btn place-right'` + (get("props").hideClose ? ' hidden' : '') + ` id='` + (get("CLOSE_BTN_ID")) + `'> &times; </button> </div> </div> </div> <div id='` + (get("POPUP_CONTENT_ID")) + `' class='ce-full'> <!-- Hello World im writing giberish for testing purposes --> </div> </div> </div> </div> `
}
$t.functions['popup-cnt/explanation'] = function (get) {
	return `<div class='ce-expl-card'> <span class='ce-expl-cnt'> <div class='ce-expl-apply-cnt'> <button expl-id="` + (get("explanation").id) + `" class='ce-expl-apply-btn' ` + (get("explanation").canApply ? '' : 'disabled') + `> Apply </button> </div> <span class='ce-expl'> <div> <h5> ` + (get("explanation").author.percent) + `% ` + (get("explanation").words) + ` - ` + (get("explanation").shortUsername) + ` </h5> ` + (get("explanation").rendered) + ` </div> </span> </span> </div> `
}
$t.functions['popup-cnt/lookup'] = function (get) {
	return `<div> <div class='ce-inline-flex' id='` + (get("HISTORY_CNT_ID")) + `'></div> <div class='ce-inline-flex' id='` + (get("MERRIAM_WEB_SUG_CNT_ID")) + `'></div> <div class='ce-tab-ctn'> <ul class='ce-tab-list'> ` + (new $t('<li  class=\'ce-tab-list-item\' {{elem.show() ? \'\' : \'hidden\'}}> <img class="lookup-img" src="{{elem.imageSrc()}}"> </li>').render(get('scope'), 'elem in list', get)) + ` </ul> <div class='ce-lookup-cnt'> ` + (new $t('<div  class=\'ce-full-width\' id=\'{{elem.id()}}\'></div>').render(get('scope'), 'elem in list', get)) + ` </div> </div> </div> `
}
$t.functions['popup-cnt/tab-contents/add-comment'] = function (get) {
	return `<div class='ce-comment-cnt-class` + (get("color") ? ' colored' : '') + `' id='` + (get("ROOT_ELEM_ID")) + `'> <div> <div class='ce-comment-header-class'` + (get("comment").author ? '' : ' hidden') + `> ` + (get("comment") ? get("comment").author.username : '') + ` </div> <div class='ce-comment-body-class'> ` + (get("comment") ? get("comment").value : '') + ` </div> </div> <div id='` + (get("COMMENTS_CNT_ID")) + `'` + (get("showComments") || !get("commentHtml") ? '' : ' hidden') + `> <div> ` + (get("commentHtml")) + ` </div> <div class='ce-center'> <div hidden id='` + (get("ADD_CNT_ID")) + `'> <textarea type='text' id='` + (get("TEXT_AREA_INPUT_ID")) + `' explanation-id='` + (get("explanation").id) + `' comment-id='` + (get("comment").id || '') + `'></textarea> <button class='ce-comment-submit-btn-class' textarea-id='` + (get("TEXT_AREA_INPUT_ID")) + `'> Submit </button> </div> <div class='ce-center'> <div> ` + (get("addToggle")()) + ` </div> </div> </div> </div> <div class='ce-center'> <div> ` + (get("commentToggle")()) + ` </div> </div> </div> `
}
$t.functions['popup-cnt/tab-contents/comment-controls'] = function (get) {
	return `<ul class='ce-comment-control-cnt-class' id='` + (get("TOGGLE_MENU_ID")) + `'> ` + (new $t('<li ><button toggle-id=\'{{toggle.id}}\' {{toggle.disabled ? \' hidden disabled\' : \'\'}}> {{toggle.showing ? toggle.hide.text : toggle.show.text}} </button></li>').render(get('scope'), 'toggle in toggles', get)) + ` </ul> `
}
$t.functions['popup-cnt/tab-contents/add-explanation'] = function (get) {
	return `<div class='ce-full'> <div class='ce-full'> <div class="ce-full" id='` + (get("ADD_EDITOR_CNT_ID")) + `'> <div class='ce-center'> <div class='ce-inline'> <input type='text' value='` + (get("words")) + `' list='ce-edited-words' id='` + (get("WORDS_INPUT_ID")) + `' autocomplete="off"> <datalist id='ce-edited-words'> ` + (new $t('<option value=\'{{words}}\' ></option>').render(get('scope'), 'words in editedWords', get)) + ` </datalist> <div> <button id='` + (get("SUBMIT_EXPL_BTN_ID")) + `' ` + (get("id") ? 'hidden' : '') + `> Add&nbsp;To&nbsp;Url </button> <button id='` + (get("UPDATE_EXPL_BTN_ID")) + `' ` + (get("id") ? '' : 'hidden') + `> Update </button> </div> <a href='` + (get("url")) + `'` + (get("url") ? '' : ' hidden') + ` target='_blank'> ` + (get("url").length < 20 ? get("url") : get("url").substr(0, 17) + '...') + ` </a> </div> <div> <p` + (get("writingJs") ? '' : ' hidden') + ` class='ce-error'>Stop tring to write JavaScript!</p> </div> </div> <textarea id='` + (get("ADD_EDITOR_ID")) + `' class='ce-full'></textarea> </div> </div> </div> `
}
$t.functions['popup-cnt/tab-contents/explanation-cnt'] = function (get) {
	return `<div> <div class='ce-center'> <h2 ` + (get("explanations").length > 0 ? 'hidden' : '') + `>No Explanations Found</h2> </div> <div class='ce-expls-cnt'` + (get("explanations").length > 0 ? '' : ' hidden') + `> <div class='ce-lookup-expl-list-cnt'> ` + (new $t('popup-cnt/explanation').render(get('scope'), 'explanation in explanations', get)) + ` </div> </div> <div class='ce-center'> <button` + (get("loggedIn") ? '' : ' hidden') + ` id='` + (get("CREATE_YOUR_OWN_BTN_ID")) + `'> Create Your Own </button> <button` + (!get("loggedIn") ? '' : ' hidden') + ` id='` + (get("LOGIN_BTN_ID")) + `'> Login </button> </div> </div> `
}
$t.functions['-1132695726'] = function (get) {
	return `popup-cnt/explanation`
}
$t.functions['popup-cnt/tab-contents/explanation-header'] = function (get) {
	return `<div> <div class='ce-lookup-expl-heading-cnt'> <div class='ce-key-cnt'> <input type='text' style='font-size: x-large;margin: 0;' id='` + (get("EXPL_SEARCH_INPUT_ID")) + `' autocomplete="off"> <button class='ce-words-search-btn' id='` + (get("SEARCH_BTN_ID")) + `'>Search</button> &nbsp;&nbsp;&nbsp; <h3>` + (get("words")) + `</h3> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </div> </div> </div> `
}
$t.functions['popup-cnt/tab-contents/webster-header'] = function (get) {
	return `<div class='ce-merriam-header-cnt'> <a href='https://www.merriam-webster.com/dictionary/` + (get("key")) + `' target='merriam-webster'> Merriam&nbsp;Webster&nbsp;'` + (get("key")) + `' </a> <br> <input type="text" name="" value="" list='merriam-suggestions' placeholder="Search" id='` + (get("SEARCH_INPUT_ID")) + `'> <datalist id='merriam-suggestions'> ` + (new $t('<option value=\'{{sug}}\' ></option>').render(get('scope'), 'sug in suggestions', get)) + ` </datalist> <div id='` + (get("MERRIAM_WEB_SUG_CNT_ID")) + `'` + (get("suggestions").length === 0 ? ' hidden': '') + `> No Definition Found </div> </div> `
}
$t.functions['popup-cnt/tab-contents/wikapedia'] = function (get) {
	return `<iframe class='ce-wiki-frame' src="https://en.wikipedia.org/wiki/Second_Silesian_War"></iframe> `
}
$t.functions['popup-cnt/tabs-navigation'] = function (get) {
	return `<ul class='ce-width-full ` + (get("LIST_CLASS")) + `' id='` + (get("LIST_ID")) + `'> ` + (new $t('<li  {{page.hide() ? \'hidden\' : \'\'}} class=\'{{activePage === page ? ACTIVE_CSS_CLASS : CSS_CLASS}}\'> {{page.label()}} </li>').render(get('scope'), 'page in pages', get)) + ` </ul> `
}
$t.functions['-888280636'] = function (get) {
	return `<li ` + (get("page").hide() ? 'hidden' : '') + ` class='` + (get("activePage") === get("page") ? get("ACTIVE_CSS_CLASS") : get("CSS_CLASS")) + `'> ` + (get("page").label()) + ` </li>`
}
$t.functions['popup-cnt/tab-contents/webster'] = function (get) {
	return `<div class='ce-merriam-cnt'> ` + (new $t('<div  class=\'ce-margin\'> <div class=\'ce-merriam-expl-card\'> <div class=\'ce-merriam-expl-cnt\'> <h3>{{item.hwi.hw}}</h3> {{new $t(\'<div  class=\\\'ce-merriam-expl\\\'> {{def}} <br><br> </div>\').render(get(\'scope\'), \'def in item.shortdef\', get)}} </div> </div> </div>').render(get('scope'), 'item in definitions', get)) + ` </div> `
}
$t.functions['-1925646037'] = function (get) {
	return `<div class='ce-merriam-expl'> ` + (get("def")) + ` <br><br> </div>`
}
$t.functions['tabs'] = function (get) {
	return `<div class='ce-inline ce-full' id='` + (get("TAB_CNT_ID")) + `'> <div> <div position='absolute' id='` + (get("NAV_CNT_ID")) + `'> </div> <div id='` + (get("NAV_SPACER_ID")) + `'></div> </div> <div class='ce-full'> <div position='absolute' id='` + (get("HEADER_CNT_ID")) + `'> </div> <div class='ce-full' id='` + (get("CNT_ID")) + `'> </div> </div> </div> `
};// ./bin/dump/$templates.js

class HoverExplanations {
  constructor (props) {
    props = props || {};
    const template = new $t('hover-explanation');
    const instance = this;
    const excludedTags = ['STYLE', 'SCRIPT', 'TITLE'];
    const  active = {expl: {}};
    const tag = 'hover-explanation';

    let switches = [];
    let disabled = false;
    let explRefs = {};
    let left;
    let explIds = [];
    let currIndex, currRef;
    let lastEnabled = properties.get('enabled');

    const id = Math.floor(Math.random() * 1000000);
    const LOGIN_BTN_ID = 'ce-hover-expl-login-btn-id-' + id;
    const EDIT_BTN_ID = 'ce-hover-expl-edit-btn-id-' + id;
    const SWITCH_LIST_ID = 'ce-hover-expl-switch-list-id-' + id;
    const VOTEUP_BTN_ID = 'ce-hover-expl-voteup-btn-' + id;
    const VOTEDOWN_BTN_ID = 'ce-hover-expl-votedown-btn-' + id;

    const getDems = () => properties.get('hoverExplanationsDems') || {width: '40vw', height: '20vh'};
    const setDems = (dems) => {
      if (hoverExplanations === instance)
        properties.set('hoverExplanationsDems', dems, true);
    };

    props.setDems = props.setDems || setDems;
    props.getDems = props.getDems || getDems;
    props.tabText = () => active.expl.words;
    const hoverResource = new HoverResources(props);
    this.hover = hoverResource.hover;

    hoverResource.container().addEventListener('drop', () => newHoverResource());
    hoverResource.container().addEventListener('tabbed', () => newHoverResource());
    if (props.hover === undefined || props.hover === true) {
      hoverResource.on(tag, {html: getHtml, after: setSwitches, disabled: () => disabled});
    }

    this.close = () => hoverResource.close();
    this.disable = () => {disabled = true; instance.close()};
    this.enable = () => disabled = false;;
    this.keepOpen = () => hoverResource.forceOpen();
    this.letClose = () => hoverResource.forceClose();

    function getHtml(elemExplORef, index) {
      currIndex = index === undefined ? currIndex || 0 : index;
      let ref;
      if (elemExplORef instanceof HTMLElement) {
        ref = elemExplORef.getAttribute('ref');
      } else if ((typeof elemExplORef) === 'string') {
        ref = elemExplORef;
      }

      if (ref === undefined) {
        if (elemExplORef !== undefined) {
          active.list = [elemExplORef];
          currRef = undefined;
        } else {
          active.list = explRefs[currRef];
          currIndex = index === undefined ? currIndex || 0 : index;
        }
      } else {
        if (ref !== currRef) currIndex = index || 0;
        currRef = ref;
        active.list = explRefs[currRef];
      }

      if (active.expl) active.expl.isActive = false;
      active.expl = active.list[currIndex];
      active.expl.isActive = true;
      active.list = active.list.length > 1 ? active.list : [];
      active.list.sort(sortByPopularity);

      const loggedIn = User.isLoggedIn();
      const authored = loggedIn && active.expl.author &&
              User.loggedIn().id === active.expl.author.id;
      const scope = {
        LOGIN_BTN_ID, SWITCH_LIST_ID, VOTEUP_BTN_ID, VOTEDOWN_BTN_ID, EDIT_BTN_ID,
        active, loggedIn, authored,
        commentHtml: Comment.for(hoverResource.container(), active.expl, undefined, true).html(),
        hideComments: props.hideComments,
        content: textToHtml(active.expl.content),
        likes: Opinion.likes(active.expl),
        dislikes: Opinion.dislikes(active.expl),
        canLike: Opinion.canLike(active.expl),
        canDislike: Opinion.canDislike(active.expl)
      };
      return template.render(scope);
    }
    this.getHtml = getHtml;

    function updateContent(expl, index) {
      const position = hoverResource.updateContent(getHtml(expl, index));
      return position;
    }

    function switchFunc (index) {
      return () => {
        updateContent(undefined, index);
      };
    }

    function display(expl) {
      updateContent(expl);
      return hoverResource.position();
    }
    this.display = display;

    function voteup() {Opinion.voteup(active.expl, () => updateContent());}

    function votedown() {Opinion.votedown(active.expl, () => updateContent());}

    function setSwitches() {
      if (active.list.length > 1) {
        switches = Array.from(document.getElementById(SWITCH_LIST_ID).children);
        switches.forEach((elem, index) => elem.onclick = switchFunc(index));
      }
      document.getElementById(LOGIN_BTN_ID).onclick = User.openLogin;
      document.getElementById(EDIT_BTN_ID).onclick = () => {
        setTimeout(instance.close, 0);
        AddInterface.open(active.expl);
      }
      document.getElementById(VOTEUP_BTN_ID).addEventListener('click', voteup);
      document.getElementById(VOTEDOWN_BTN_ID).addEventListener('click', votedown);
    }

    function sortByPopularity(expl1, expl2) {
      expl1.popularity = Opinion.popularity(expl1);
      expl2.popularity = Opinion.popularity(expl2);
      return expl2.popularity - expl1.popularity;
    }

    function topNodeText(el) {
        let child = el.firstChild;
        const explanations = [];

        while (child) {
            if (child.nodeType == 3) {
                explanations.push(child.data);
            }
            child = child.nextSibling;
        }

        return explanations.join("");
    }

    function findWord(word) {
        return Array.from(document.body.querySelectorAll('*'))
          .filter(el => topNodeText(el).match(new RegExp(word, 'i')));
    }


    function wrapText(elem, text, ref) {
      function replaceRef() {
        const prefix = arguments[1];
        const text = arguments[4].replace(/\s{1,}/g, '&nbsp;');
        const suffix = arguments[5];
        return `${prefix}<${tag} ref='${ref}'>${text}</${tag}>${suffix}`;
      }
      if (text) {
        let textRegStr = `((^|>)([^>^<]* |))(${text})(([^>^<]* |)(<|$|))`;
        let textReg = new RegExp(textRegStr, 'ig');
        const newHtml = elem.innerHTML.replace(textReg, replaceRef);
        safeInnerHtml(newHtml, elem)
      }
    }

    let wrapList = [];
    let wrapIndex = 0;
    function wrapOne() {
        if (!properties.get('enabled') || wrapIndex >= wrapList.length) return;
        const wrapInfo = wrapList[wrapIndex];
        const elems = findWord(wrapInfo.word);
        for (let eIndex = 0; eIndex < elems.length; eIndex += 1) {
          const elem = elems[eIndex];
          if (wrapInfo && elem.tagName.toLowerCase() !== tag) {
            wrapText(elem, wrapInfo.word, wrapInfo.ref);
            wrapInfo[wrapIndex] = undefined;
          }
        }
        wrapIndex++;
        setTimeout(wrapOne, 1);
    }
    this.wrapOne = wrapOne;

    function removeAll() {
      wrapIndex = 0;
      let resources = document.getElementsByTagName(tag);
      while (resources.length > 0) {
        Array.from(resources)
          .forEach((elem) => safeOuterHtml(elem.innerHTML, elem));
        resources = document.getElementsByTagName(tag);
      }
    }

    function sortByLength(str1, str2) {return str2.length - str1.length;}

    function uniqueWords(explList) {
      const uniq = {}
      explList.forEach((expl) => uniq[expl.words] = true);
      return Object.keys(uniq).sort(sortByLength);
    }

    function set(explList, soft) {
      explRefs = explList;
      if (soft) return;
      removeAll();
      wrapList = [];
      const wordList = Object.keys(explList).sort(sortByLength);
      for (let index = 0; index < wordList.length; index += 1) {
        const ref = wordList[index];
        const explanations = explList[ref];
        explanations.forEach((expl) => explIds.push(expl.id));
        const uniqWords = uniqueWords(explanations).sort(sortByLength);
        for (let wIndex = 0; wIndex < uniqWords.length; wIndex += 1) {
          const word = uniqWords[wIndex];
          wrapList.push({ word, ref });
        }
      }
      wrapOne();
    }

    function update(expl) {
      const ref = expl.searchWords;
      if (explRefs[ref] === undefined) {
        explRefs[ref] = [];
      }
      const list = explRefs[ref];
      let index = 0;
      for (; index < list.length; index += 1) {
        if (list[index].id === expl.id) {
          list[index] = expl;
          updateContent(ref, index).show();
          return;
        }
      }
      list.push(expl);
      updateContent(ref, index).show();
    }
    this.update = update;

    function add(expl) {
      const ref = expl.searchWords;
      if (explRefs[ref] === undefined) {
        explRefs[ref] = [expl];
      } else {
        explRefs[ref].push(expl);
      }
      const elem = document.createElement(tag);
      elem.setAttribute('ref', expl.searchWords);
      updateContent(elem, explRefs[ref].length - 1);
      hoverResource.position().elem();

      wrapList.push({ word: expl.words, ref });
      wrapOne();
      explIds.push(expl.id);
    }

    this.set = set;
    this.add = add;

    this.wrapText = wrapText;
    this.canApply = (expl) => User.isLoggedIn() && explIds.indexOf(expl.id) === -1;

    this.lockOpen = hoverResource.lockOpen;
    this.unlockOpen = hoverResource.unlockOpen;
    this.position = hoverResource.position;

    function enableToggled(enabled) {
      if (enabled !== lastEnabled) {
        lastEnabled = enabled;
        removeAll();
        if (enabled) {
          instance.wrapOne();
        }
      }
    }

    const newHoverResource = () => {
        if(hoverExplanations === instance) {
          hoverResource.stopHover();
          hoverResource.lockOpen();
          hoverExplanations = new HoverExplanations();
          hoverExplanations.set(explRefs, true);
        }
    }

    properties.onUpdate('enabled', enableToggled);
  }
}

let hoverExplanations = new HoverExplanations();
;
class Expl {
  constructor () {
    let currEnv;
    let explanations = {};
    function createHoverResouces (data) {
      properties.set('siteId', data.siteId);
      Object.values(data.list).forEach((elem) => elem.forEach(
        (expl) => explanations[expl.id] = expl));
      hoverExplanations.set(data.list);
    }

    function addHoverResources () {
      const enabled = properties.get('enabled');
      const env = properties.get('env') || 'local';
      if (enabled && env !== currEnv) {
        currEnv = env;
        const url = EPNTS.siteExplanation.get();
        Request.post(url, {siteUrl: window.location.href}, createHoverResouces);
      }
    }

    this.get = function (words, success, fail) {
      const url = EPNTS.explanation.get(words);
      Request.get(url, success, fail);
    };

    this.siteList = function (success, fail) {
    };

    this.authored = function (authorId, success, fail) {
      const url = EPNTS.explanation.author(authorId);
      Request.get(url, succes, fail);
    };

    this.addComment = function (value, siteId, explanationId, commentId, success, failure) {
      console.log(commentId);
      function addCommentSuccess(comment) {
        explanations[explanationId].comments.push(comment);
        if ((typeof success) === 'function') success(comment);
      }
      function addCommentFailure(error) {
        if ((typeof failure) === 'function') failure(error);
      }
      const body = {value, siteId, explanationId, commentId};
      Request.post(EPNTS.comment.add(), body, addCommentSuccess, addCommentFailure);
    }

    this.add = function (words, content, success, fail) {
      const url = EPNTS.explanation.add();
      Request.post(url, {words, content}, success, fail);
    };


    properties.onUpdate(['enabled', 'env'], addHoverResources);
  }
}

Expl = new Expl();
;
class Form {
  constructor() {
    const formFuncs = {};

    function getFormDataObject(formElem) {
      const data = {};
      formElem.querySelectorAll('input')
          .forEach((elem) => {data[elem.name] = elem.value});
      return data;
    }

    function directForm (e) {
      const btnId = e.target.id;
      if (formFuncs[btnId]) {
        e.preventDefault(e);
        const actionAttr = e.srcElement.attributes.action;
        const url = actionAttr !== undefined ? actionAttr.value : undefined;
        const success = formFuncs[btnId].success;
        if (url) {
          const fail = formFuncs[btnId].fail;
          let method = e.srcElement.attributes.method.value;
          const data = getFormDataObject(e.target);
          method = method === undefined ? 'get' : method.toLowerCase();
          if (method === 'get') {
            Request.get(url, success, fail);
          } else {
            Request[method](url, data, success, fail);
          }
        } else {
          success();
        }
      }
    }

    this.onSubmit = function (id, success, fail) {formFuncs[id] = {success, fail}};

    document.addEventListener('submit', directForm);
  }
}

Form = new Form();
;
class History {
  constructor(len) {
    len = len || 100;
    let history = [];
    let currentPosition = -1;
    this.push = (elem) => {
      if (elem !== history[currentPosition]) {
        if (history.indexOf(elem) > -1) history.splice(history.indexOf(elem), 1);
        history = history.splice(currentPosition - len || 0, len);
        currentPosition = history.length;
        history.push(elem);
        properties.set('ce-history', history, true);
      }
    };
    this.index = () => currentPosition;
    this.get = () => {
      const histObject = {};
      histObject.currentPosition = currentPosition;
      histObject.list = [];
      for (let index = history.length - 1; index > -1; index -= 1) {
        histObject.list.push({index, elem: history[index]});
      }
      return histObject;
    };
    this.back = () => history[--currentPosition];
    this.forward = () => history[++currentPosition];
    this.goTo = (index) => history[currentPosition = index];
    this.hasFuture = () => -1 < currentPosition && currentPosition < history.length - 1;
    this.hasPast = () => currentPosition > 0;

    const initialized = false;
    function init(savedHistory) {
      if (!initialized && Array.isArray(savedHistory)) {
        history = savedHistory;
        currentPosition = history.length - 1;
      }
    }
    properties.onUpdate('ce-history', init);
  }
}

const history = new History(1000);
;
const USER_ADD_CALL_SUCCESS = new CustomEvent('user-add-call-success');
const USER_ADD_CALL_FAILURE = new CustomEvent('user-add-call-failure');
const CE_LOADED = new CustomEvent('user-add-call-failure');
const CE_SERVER_UPDATE = new CustomEvent('ce-server-update');
;
class Opinion {
  constructor() {
    let siteId;
    const amendments = {};
    const opinions = {};
    const instance = this;

    function voteSuccess(explId, favorable, callback) {
      return function () {
        amendments[explId] = favorable;
        if ((typeof callback) === 'function') callback();
      }
    }

    function canVote (expl, favorable)  {
      const user = User.loggedIn();
      if (user) {
        const userId = user.id;
        if (expl.author && userId === expl.author.id) {
          return false;
        }
        if (opinions[expl.id] !== undefined && amendments[expl.id] === undefined) {
          return opinions[expl.id] !== favorable;
        }
        return userId !== undefined && amendments[expl.id] !== favorable;
      } else {
        return false;
      }
    };

    function explOpinions(expl, favorable) {
      const attr = favorable ? 'likes' : 'dislikes';
      if (amendments[expl.id] === undefined) {
        return expl[attr] || 0;
      }
      let value = expl[attr];
      if (opinions[expl.id] === favorable) value--;
      if (amendments[expl.id] === favorable) value++;
      return value || 0;
    }

    this.canLike = (expl) => canVote(expl, true);
    this.canDislike = (expl) => canVote(expl, false);
    this.likes = (expl) => explOpinions(expl, true);
    this.dislikes = (expl) => explOpinions(expl, false);


    this.voteup = (expl, callback) => {
      const url = EPNTS.opinion.like(expl.id, siteId);
      Request.get(url, voteSuccess(expl.id, true, callback));
    }

    this.votedown = (expl, callback) => {
      const url = EPNTS.opinion.dislike(expl.id, siteId);
      Request.get(url, voteSuccess(expl.id, false, callback));
    }

    this.popularity = (expl) => {
      const likes = instance.likes(expl);
      return Math.floor((likes / (likes + instance.dislikes(expl))) * 100) || 0;
    }

    function saveVotes(results) {
      results.map((expl) => opinions[expl.explanationId] = expl.favorable === 1);
    }

    function getUserVotes() {
      siteId = properties.get('siteId');
      if (siteId !== undefined && User.loggedIn() !== undefined) {
        const userId = User.loggedIn().id;
        const url = EPNTS.opinion.bySite(siteId, userId);
        Request.get(url, saveVotes);
      }
    }
    properties.onUpdate(['siteId', 'loggedIn'], getUserVotes);
  }
}

Opinion = new Opinion();
;
class Notifications {
  constructor (activeTime) {
    const EXPLANATION = 'Explanation';
    const COMMENT = 'Comment';
    const QUESTION = 'Question';
    let notifications = {currPage: [], otherPage: []};

    this.hasNotifications = () => notifications.currPage.length > 0 &&
          notifications.otherPage.length > 0;

    this.getNotifications = () => JSON.parse(JSON.stringify(notifications));

    function words(data) {
      return data.explanation.words;
    }

    function fullText(data) {
      switch (data.type) {
        case EXPLANATION:
          return data.explanation.content;
        case COMMENT:
          return data.comment.value;
        case QUESTION:
          return data.explanation.content;
        default:
          return "Error getting text data";

      }
    }

    function shortText(data) {
        return fullText(data).substr(0, 20);
    }

    function author(data) {
      switch (data.type) {
        case EXPLANATION:
          return data.explanation.author.username;
        case COMMENT:
          return data.comment.author.username;
        case QUESTION:
        return data.explanation.author.username;
        default:
          return "Error getting author data";

      }
    }

    function getClass() {
      return `${data.type.tolowercase()}-notification`;
    }

    function update() {
      const user = User.loggedIn();
      if (user) {
        const userId = user.id;
        const siteUrl = window.location.href;
        Request.post(ENPTS.notification.get(), {userId, siteUrl}, (notes) => notifications = notes);
      }
    }

    afterLoad.push(() => properties.onUpdate(['user.credential', 'user.status'], () => update()));
















// -------------------------------------- User Present ----------------------//
    let activationCounter = -1;
    let isActive = false;

    this.hasPending = () => true;

    function activate() {
      activationCounter++;
      if (isActive === false) {
        isActive = true;
        console.log('active!');
      }
    }

    function deactivate(activationId) {
      return function () {
        if (activationId === activationCounter) {
          console.log('deactivated')
          isActive = false;
        }
      }
    }

    function activationTimer() {
      setTimeout(deactivate(activationCounter), activeTime);
    }

    window.addEventListener('focus', activate);
    window.addEventListener('blur', activationTimer);
    activate();
  }
}

Notifications = new Notifications(10000);
;
const getDems = () => properties.get('lookupHoverResourceDems') || {width: '40vw', height: '20vh'};
const setDems = (dems) => properties.set('lookupHoverResourceDems', dems, true);

function regLen(text, reg) {
  const match = text.match(reg);
  return match === null ? 0 : match.length;
}
const historyTemplate = new $t('history');
const lookupHoverResource = new HoverResources({
  clickClose: true,
  zIncrement: 1,
  hasPast: history.hasPast,
  hasFuture: history.hasFuture,
  back: () => lookupTabs.update(history.back()),
  forward: () => lookupTabs.update(history.forward()),
  historyDisplay: (filterText) => {
    const histList = history.get();
    let filtered = false;
    if (filterText) {
      filtered = true;
      const filter = new RegExp(filterText.trim().replace(/\s{1,}/g, '|'), 'g');
      histList.list.sort((h1, h2) => regLen(h2.elem, filter) - regLen(h1.elem, filter));
    }

    return historyTemplate.render({filtered, history: histList})
  },
  historyClick: (event) => lookupTabs.update(history.goTo(event.target.value)),
  getDems, setDems});

class Tabs {
  constructor(props) {
    props = props || {};
    const uniqId = Math.floor(Math.random() * 100000);
    const template = new $t('tabs');
    const navTemplate = new $t('popup-cnt/tabs-navigation');
    const CSS_CLASS = props.class || 'ce-tabs-list-item';
    const ACTIVE_CSS_CLASS = `${CSS_CLASS} ${props.activeClass || 'ce-tabs-active'}`;
    const LIST_CLASS = props.listClass || 'ce-tabs-list';
    const CNT_ID = props.containerId || 'ce-tabs-cnt-id-' + uniqId;
    const LIST_ID = 'ce-tabs-list-id-' + uniqId;
    const TAB_CNT_ID = 'ce-tab-cnt-id-' + uniqId;
    const NAV_CNT_ID = 'ce-tab-nav-cnt-id-' + uniqId;
    const NAV_SPACER_ID = 'ce-tab-nav-spacer-id-' + uniqId;
    const HEADER_CNT_ID = 'ce-tab-header-cnt-id-' + uniqId;
    const instance = this;
    let firstRender = true;
    let navContainer, headerContainer, bodyContainer;
    const pages = [];
    const positions = {};
    let currIndex;
    let activePage;
    // lookupHoverResource.forceOpen();

    function switchFunc(index) {return function () { switchTo(index);}}

    this.open = function (page) {
      if (!(page instanceof Page)) throw new Error('argument must be of type page');
      for (let index = 0; index < pages.length; index += 1) {
        if (page === pages[index]) {
          switchTo(index);
          return;
        }
      }
      throw new Error(page.label() + 'does not exist');
    }
    this.close = lookupHoverResource.close;

    function setOnclickMethods() {
      const listItems = document.getElementById(LIST_ID).children;
      for (let index = 0; index < listItems.length; index += 1) {
        listItems[index].onclick = switchFunc(index);
      }
    }

    function updateNav() {
      navContainer.innerHTML = navTemplate.render(
        {
          pages, activePage, LIST_CLASS, LIST_ID, CSS_CLASS, ACTIVE_CSS_CLASS,
          LIST_CLASS, LIST_ID
        });
      setOnclickMethods();
    }
    function updateHead() {
      headerContainer.innerHTML = activePage !== undefined ? activePage.header() : '';
      setDems();
    }
    function updateBody() {
      bodyContainer.innerHTML = activePage !== undefined ? activePage.html() : '';
    }
    this.updateNav = updateNav;
    this.updateHead = updateHead;
    this.updateBody = updateBody;

    function switchTo(index) {
      hoverExplanations.disable();
      if (index !== undefined && index !== currIndex) firstRender = true;
      currIndex = index === undefined ? currIndex || 0 : index;
      activePage = pages[currIndex];
      activePage.beforeOpen();
      updateNav();
      updateHead();
      updateBody();
      setDems();
      lookupHoverResource.position().select();
      hoverExplanations.position().select().close();
      setOnclickMethods();
      activePage.afterOpen();
    }

    function setDems() {
      const headerElem = document.getElementById(HEADER_CNT_ID);
      const navElem = document.getElementById(NAV_CNT_ID);
      if (navElem && headerElem) {
        elemSpacer(headerElem);
        elemSpacer(navElem);
        if (firstRender) {
          setTimeout(switchTo, 1000);
          firstRender = false;
        }
      }
   }

    function getScope() {
      return {CNT_ID, TAB_CNT_ID, NAV_CNT_ID, HEADER_CNT_ID, NAV_SPACER_ID};
    }

    function sortByPosition(page1, page2) {
      return positions[page1.label()] - positions[page2.label()];
    }

    function add(page, position) {
      if (!(page instanceof Page)) throw new Error('argument must be of type page');
      let index = pages.indexOf(page);
      if (index === -1) {
        index = pages.length;
        pages.push(page);
        positions[page.label()] = position !== undefined ? position : Number.MAX_SAFE_INTEGER;
        pages.sort(sortByPosition);
      } else {
        console.warn('page has already been added');
      }
    }

    function update(word) {
      if (word === undefined) {
        word = properties.get('searchWords');
      } else {
        properties.set('searchWords', word, true);
      }
      switchTo();
    }

    function init() {
      lookupHoverResource.updateContent(template.render(getScope()));
      document.getElementById(TAB_CNT_ID).onmouseup = (e) => {
        e.stopPropagation()
      };
      navContainer = document.getElementById(NAV_CNT_ID);
      headerContainer = document.getElementById(HEADER_CNT_ID);
      bodyContainer = document.getElementById(CNT_ID);
      updateNav();
    }

    lookupHoverResource.onClose(() => {
      hoverExplanations.enable();
      hoverExplanations.letClose();
    });

    this.add = add;
    this.update = update;
    init();
  }
}

const lookupTabs = new Tabs();
;
class MerriamWebster extends Page {
  constructor() {
    super();
    const instance = this;
    const meriamTemplate = new $t('popup-cnt/tab-contents/webster');
    const meriamHeader = new $t('popup-cnt/tab-contents/webster-header');
    const SEARCH_INPUT_ID = 'merriam-suggestion-search-input-id';
    let suggestions;
    let definitions;
    let key;
    this.label = () => `<img class="lookup-img" src="${EPNTS.images.merriam()}">`;

    function openDictionary(event) {
      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      const word = searchInput.value.trim();
      history.push(word);
      properties.set('searchWords', word);
      instance.update();
    }

    this.html = () => meriamTemplate.render({definitions});
    this.header = () => {
      console.log('header called');
      return meriamHeader.render(
        {key: key.replace(/\s/g, '&nbsp;'), suggestions, MERRIAM_WEB_SUG_CNT_ID,
          SEARCH_INPUT_ID})};

    function afterOpen(suggestionHtml) {
      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      searchInput.addEventListener('change', openDictionary);
      searchInput.focus();
    }

    this.afterOpen = afterOpen;

    function success (data) {
      const elem = data[0];
      if (elem && elem.meta && elem.meta.stems) {
        data = data.filter(elem => elem.meta.stems.indexOf(key) !== -1);
        definitions = data;
        suggestions = [];
      } else {
        definitions = undefined;
        suggestions = data;
      }
      lookupTabs.updateBody();
      lookupTabs.updateHead();
      afterOpen();
    }

    function failure (error) {
      console.error('Call to Meriam Webster failed');
    }

    this.update = function () {
      const newKey = properties.get('searchWords');
      if (newKey && newKey !== key && (typeof newKey) === 'string') {
        definitions = undefined;
        suggestions = undefined;
        key = newKey;
        const url = EPNTS.merriam.search(key);
        Request.get(url, success, failure);
      }
    }

    this.beforeOpen = this.update;
  }
}

MerriamWebster = new MerriamWebster();
lookupTabs.add(MerriamWebster, 1);
;class Explanations extends Page {
  constructor(list) {
    super();
    const template = new $t('popup-cnt/tab-contents/explanation-cnt');
    const headerTemplate = new $t('popup-cnt/tab-contents/explanation-header');
    const CREATE_YOUR_OWN_BTN_ID = 'ce-explanations-create-your-own-btn-id';
    const LOGIN_BTN_ID = 'ce-explanations-login-btn-id';
    const SEARCH_BTN_ID = 'ce-explanations-search-btn-id';
    const EXPL_SEARCH_INPUT_ID = 'ce-explanation-search-input-id';
    let selected = [];
    let searchInput;
    let inputIndex = 0;
    const instance = this;
    let explanations = [];
    let searchWords;
    this.list = list ? list : [];
    this.add = function (expl) {
      this.list.push(expl);
    }

    this.clear = () => searchWords = null;

    function openAddPage(event) {
      lookupTabs.close();
      AddInterface.open(searchWords, window.location.href);
      event.stopPropagation();
    }

    function forTags(func) {
      const tags = document.getElementsByClassName('ce-expl-tag');
      for (let index = 0; index < tags.length; index += 1) {func(tags[index]);}
    }

    function selectUpdate() {
      selected = [];
      forTags((elem) => {if (elem.checked) selected.push(elem.value);});
      setExplanation();
    }

    function regScore(reg, text) {
      let match = text.match(reg);
      let score = (value) => match === null ? 0 : value;
      let length = (multiplier) => match === null ? 0 : match.length * (multiplier || 1);
      return {score, length};
    }

    function byFilterValue(expl1, expl2) {
      const wordList = searchInput.value.replace(/[^a-z^A-Z^0-9^\s]/g, '')
                        .split(/\s{1,}/);
      if (wordList.length === 1 && wordList[0] === '') {
        return expl2.author.percent - expl1.author.percent;
      }
      let matchCount1 = 0;
      let matchCount2 = 0;
      wordList.forEach((word) => {
        if (word) {
          const exactTagReg = new RegExp(`#${word}(\s|#|$)`);
          matchCount1 += regScore(exactTagReg, expl1.content).score(100);
          matchCount2 += regScore(exactTagReg, expl2.content).score(100);

          const tagReg = new RegExp(`#[a-zA-Z0-9]*${word}[a-zA-Z0-9]*`);
          matchCount1 += regScore(tagReg, expl1.content).score(10);
          matchCount2 += regScore(tagReg, expl2.content).score(10);

          const wordReg = new RegExp(word);
          matchCount1 += regScore(wordReg, expl1.content).length();
          matchCount2 += regScore(wordReg, expl2.content).length();
        }
      });
      expl1.score = matchCount1;
      expl2.score = matchCount2;
      return matchCount2 - matchCount1;
    }


    function addExpl(e) {
      const explId = Number.parseInt(e.target.attributes['expl-id'].value);
      function addExplSuccessful() {
        explanations.forEach((expl) => {
          if(expl.id === explId)
            hoverExplanations.add(expl);
            setExplanation();
        })
      }
      const url = EPNTS.siteExplanation.add(explId);
      const siteUrl = window.location.href;
      Request.post(url, {siteUrl}, addExplSuccessful);
    }

    function setTagOnclick() {
      forTags((elem) => elem.onclick = selectUpdate);
      const applyBtns = document.getElementsByClassName('ce-expl-apply-btn');
      Array.from(applyBtns).forEach((btn) => btn.onclick = addExpl);

      const searchBtn = document.getElementById(SEARCH_BTN_ID);
      if (searchBtn) {
        searchInput = document.getElementById(EXPL_SEARCH_INPUT_ID);
        searchBtn.onclick = () => {
          let words = searchInput.value;
          if (words) {
            words = words.toLowerCase().trim();
            properties.set('searchWords', words, true);
            history.push(words);
            instance.get();
          }
        };
        searchInput.addEventListener('keyup', lookupTabs.updateBody)
        onEnter(EXPL_SEARCH_INPUT_ID, searchBtn.onclick);

        document.getElementById(EXPL_SEARCH_INPUT_ID).focus();
        searchInput.selectionStart = inputIndex;
        document.getElementById(CREATE_YOUR_OWN_BTN_ID).onclick = openAddPage;
        document.getElementById(LOGIN_BTN_ID).onclick = User.openLogin;
      }
    }

    function setExplanation(expls) {
      if (expls !== undefined) {
        explanations = expls;
      }
      lookupTabs.updateHead();
      lookupTabs.updateBody();
      setTagOnclick();
    }

    function getScope() {
      const scope = {};
      const tagObj = {}
      scope.explanations = explanations.sort(byFilterValue);
      scope.explanations.forEach(function (expl) {
        const username = expl.author.username;
        expl.shortUsername = username.length > 20 ? `${username.substr(0, 17)}...` : username;
        expl.canApply = hoverExplanations.canApply(expl);
        expl.rendered = textToHtml(expl.content);
        const author = expl.author;
        expl.author.percent = Math.floor((author.likes / (author.dislikes + author.likes)) * 100) || 0;
      });

      scope.words = searchWords;
      scope.loggedIn = User.isLoggedIn();
      scope.CREATE_YOUR_OWN_BTN_ID = CREATE_YOUR_OWN_BTN_ID;
      scope.EXPL_SEARCH_INPUT_ID = EXPL_SEARCH_INPUT_ID;
      scope.SEARCH_BTN_ID = SEARCH_BTN_ID;
      scope.LOGIN_BTN_ID = LOGIN_BTN_ID;
      scope.selected = selected;
      return scope;
    }

    function html () {
      return template.render(scope);
    }

    this.html = () => template.render(getScope());
    this.header= () => headerTemplate.render(getScope());
    this.label = () => `<img class="lookup-img" src="${EPNTS.images.logo()}">`;
    this.afterOpen = setTagOnclick;
    this.beforeOpen = () => instance.get();

    this.get = function () {
      const newSearchWords = properties.get('searchWords');
      if (newSearchWords !== searchWords) {
        selected = [];
        searchWords = newSearchWords;
        const url = EPNTS.explanation.get(searchWords);
        Request.get(url, setExplanation, () => setExplanation([]));
      }
    }
  }
}

Explanations = new Explanations();
lookupTabs.add(Explanations, 0);
;
class AddInterface extends Page {
  constructor () {
    super();
    const template = new $t('popup-cnt/tab-contents/add-explanation');
    const instance = this;
    let content = '';
    let id = '';
    let words = '';
    let url = '';
    let writingJs = false;
    let editedWords = [];
    let changingTarget = false;
    let expl;
    const ADD_EDITOR_CNT_ID = 'ce-add-editor-cnt-id';
    const ADD_EDITOR_ID = 'ce-add-editor-id';
    const SUBMIT_EXPL_BTN_ID = 'ce-add-editor-add-expl-btn-id';
    const UPDATE_EXPL_BTN_ID = 'ce-add-editor-update-expl-btn-id';
    const WORDS_INPUT_ID = 'ce-add-editor-words-input-id';
    let updatePending = false;
    const editHoverExpl = new HoverExplanations({hideClose: true,
                                                hideMax: true,
                                                hideMin: true,
                                                hideMove: true,
                                                hideComments: true,
                                                position: 'fixed',
                                                hover: false});
    const dragDropResize = new DragDropResize({getDems, setDems,
                                                  hideMax: true,
                                                  hideMin: true,
                                                  hideMove: true,
                                                  position: 'fixed'});

    function getScope() {
      const u = url === window.location.href ? undefined : url;
      return {
        ADD_EDITOR_CNT_ID, ADD_EDITOR_ID, SUBMIT_EXPL_BTN_ID, WORDS_INPUT_ID,
        UPDATE_EXPL_BTN_ID,
        writingJs, words, content, url: u, id, editedWords
      }
    }

    this.hide = () => true;
    this.label = () => `<button class='ce-btn ce-add-btn'>+</button>`;
    this.html = () => template.render(getScope());

    function initContent(w, defaultValue) {
        words = w || words;
        const userContent = properties.get('userContent') || {};
        editedWords = Object.keys(userContent);
        if (userContent[words] !== undefined) {
          content = userContent[words].content;
          url = userContent[words].url;
          id = userContent[words].id;
        } else {
          content = defaultValue;
          url = window.location.href;
          id = undefined;
        }

        if (instance.addExplBtn !== undefined) {
          instance.addExplBtn.hidden = id !== undefined;
          instance.updateExplBtn.hidden = id === undefined;
        }
    }

    function save() {
      let userContent = properties.get('userContent');
      if ((typeof userContent) !== 'object') userContent = {};
      console.log('saving');
      if (content) {
        userContent[words] = {content, url, id};
      } else {
        delete userContent[words];
      }
      properties.set('userContent', userContent, true)
    }

    function addExplSuccessful(expl) {
      hoverExplanations.add(expl);
      content = '';
      save();
      properties.set('searchWords', null);
      Explanations.clear();
      dragDropResize.close();
    }

    function updateExplSuccessful() {
      expl.content = content;
      hoverExplanations.update(expl);
      content = '';
      save();
      properties.set('searchWords', null);
      Explanations.clear();
      dragDropResize.close();
    }

    function addExplanation() {
      const url = EPNTS.explanation.add();
      Request.post(url, {words, content, siteUrl: window.location.href}, addExplSuccessful);
    }

    function updateExplanation() {
      const url = EPNTS.explanation.update();
      Request.put(url, {content, id: expl.id}, updateExplSuccessful);
    }

    let saveBuffer = 10000
    let pendingSave = false;
    let lastSave = new Date().getTime();
    function autoSave() {
      const time = new Date().getTime();
      if (time - saveBuffer > lastSave) {
        save();
        lastSave = time;
      } else if (!pendingSave) {
        console.log('pending')
        pendingSave = true;
        setTimeout(() => { pendingSave = false; autoSave() }, saveBuffer);
      }
    }

    let ignoreChange = false;
    function onChange(event) {
      if (changingTarget) return;
      if (ignoreChange) { ignoreChange = false; return; }
      let isWritingjs = false;
      try {
        if ((typeof event.target.value) === 'string') {
          editHoverExpl.display({words, content: event.target.value},
                dragDropResize.container());
          content = event.target.value;
        }
      } catch (error) {
        isWritingjs = true;
        ignoreChange = true;
        instance.inputElem.value = error.clean;
      }
      if (writingJs !== isWritingjs) {
        writingJs = isWritingjs;
      }
      autoSave();
    }

    function bottomFull() {
      return {width: '100vw', height: '75vh'};
    }

    function close() {
      save();
      editHoverExpl.unlockOpen();
      editHoverExpl.close();
      hoverExplanations.hover();
    }
    this.close = close;

    function editTargetUpdate(e) {
      changingTarget = true;
      save();
      initContent(e.target.value, '');
      instance.inputElem.value = content;
      editHoverExpl.display({words, content});
    }

    function open(w, urlOid) {
      if ((typeof w) === 'string') {
        initContent(w, '');
        url = urlOid || url;
      } else if (w instanceof Object) {
        expl = w;
        words = expl.words;
        initContent(words, expl.content);
        id = expl.id;
        content = content || expl.content;
      }
      dragDropResize.show()
        .setCss(bottomFull())
        .updateContent(instance.html())
        .center().bottom();
      instance.inputElem = document.getElementById(ADD_EDITOR_ID);
      instance.inputElem.value = content;
      instance.inputCnt = document.getElementById(ADD_EDITOR_CNT_ID);
      instance.addExplBtn = document.getElementById(SUBMIT_EXPL_BTN_ID);
      instance.updateExplBtn = document.getElementById(UPDATE_EXPL_BTN_ID);
      instance.wordsInput = document.getElementById(WORDS_INPUT_ID);
      instance.wordsInput.addEventListener('keyup', editTargetUpdate);
      instance.inputElem.addEventListener('keyup', onChange);
      instance.inputElem.addEventListener('focus', () => changingTarget = false);
      // instance.inputElem.addEventListener('blur', editHoverExpl.close);
      instance.addExplBtn.addEventListener('click', addExplanation);
      instance.updateExplBtn.addEventListener('click', updateExplanation);


      editHoverExpl.display({words, content}).elem(dragDropResize.container()).center().top();
      editHoverExpl.lockOpen();
      hoverExplanations.hover(false);
    }
    this.open = open;
    this.toggle = () => dragDropResize.hidden() ? instance.open() : dragDropResize.close();

    dragDropResize.onClose(close);
  }
}


AddInterface = new AddInterface();
// AddInterface.open('poopLuck');
new KeyShortCut('ca', AddInterface.toggle);
;
return {afterLoad};
        }
        try {
          CE = CE();
          CE.afterLoad.forEach((item) => {item();});
        } catch (e) {
            console.log(e);
        }
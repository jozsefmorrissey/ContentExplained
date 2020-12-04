let Settings = function () {
const afterLoad = []

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
  "_secure": [
    "user.update",
    "credential.get",
    "credential.delete",
    "site.add",
    "explanation.add",
    "explanation.update",
    "siteExplanation.add",
    "opinion.like",
    "opinion.dislike"
  ]
}
, 'local').getFuncObj();
try {exports.EPNTS = EPNTS;}catch(e){}function up(selector, node) {
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

function elemSpacer(elem) {
  elem.setAttribute('spacer-id', elem.getAttribute('spacer-id') || `elem-spacer-${Math.floor(Math.random() * 10000000)}`);
  const spacerId = elem.getAttribute('spacer-id');
  elem.style.position = '';
  elem.style.margin = '';
  const elemRect = elem.getBoundingClientRect();
  const spacer = document.getElementById(spacerId) || document.createElement(elem.tagName);
  spacer.id = spacerId;
  spacer.style.width = elem.scrollWidth + 'px';
  spacer.style.height = elem.scrollHeight + 'px';
  elem.style.width = elem.scrollWidth + 'px';
  elem.style.height = elem.scrollHeight + 'px';
  elem.style.margin = 0;
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

const jsAttrReg = /<([a-zA-Z]{1,}[^>]{1,})on[a-z]{1,}=/;
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

const space = new Array(1).fill('&nbsp;').join('');
const tabSpacing = new Array(2).fill('&nbsp;').join('');
function textToHtml(text) {
  safeInnerHtml(text);
  return text.replace(/\n/g, '<br>')
              .replace(/\t/g, tabSpacing)
              .replace(/<script[^<]*?>/, '')
              .replace(jsAttrReg, '')
              .replace(/\(([^\(^\)]*?)\)\s*\[([^\]\[]*?)\]/g,
                      '<a target=\'blank\' href="$2">$1</a>');
}

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
class Page {
  constructor() {
    this.label = function () {throw new Error('Must implement label()');};
    this.template = function() {throw new Error('Must implement template()');}
    this.scope = function () {return {};};
    this.onOpen = function () {};
    this.onClose = function () {};
    this.beforeOpen = function () {};
    this.hide = function() {return false;}
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
        retObj[key] = JSON.parse(JSON.stringify(properties[key]));
      }
    };

    function storageUpdate (values) {
      const keys = Object.keys(values);
      for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];
        const value = values[key];
        if (value && value.newValue !== undefined) {
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

    this.onUpdate = function (keys, func) {
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
        func(properties[key])
      });
    }

    chrome.storage.local.get(null, storageUpdate);
    chrome.storage.onChanged.addListener(storageUpdate);
  }
}

const properties = new Properties();

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
function loggedIn() {
  const user = properties.get('user');
  return !(user === null || user === undefined);
}

function propertyUpdate(key, value) {
  return function (event) {
    properties.set(key, event.target.value, true)
  };
}


class Settings {
  constructor(page) {
    const CSS_CLASS = 'ce-setting-list-item';
    const ACTIVE_CSS_CLASS = `${CSS_CLASS} ce-active-list-item`;
    const LIST_ID = 'ce-setting-list';
    const CNT_ID = 'ce-setting-cnt';
    this.pageName = function () {return page.constructor.name;}
    this.getPage = () => page;
    const instance = this;
    const li = document.createElement('li');
    const settingsCnt = document.getElementById(CNT_ID);
    const settingsList = document.getElementById(LIST_ID);

    function isActive() {
      return Settings.activePage() === instance.pageName();
    }

    this.hidden = () => page.hide();
    this.activate = function (force) {
      if (force || isActive()) {
        if (Settings.active) Settings.active.getPage().onClose();
        page.beforeOpen();
        Settings.active = instance;
        window.location.href = `${window.location.href
            .replace(Settings.urlReg, '$3')}#${instance.pageName()}`;
        li.className = ACTIVE_CSS_CLASS;
        const html = new $t(page.template()).render(page.scope());
        safeInnerHtml(html, settingsCnt);
        page.onOpen();
        properties.set('settingsPage', instance.pageName());
      }
      instance.updateMenu();
    }

    this.updateMenu = function() {
      if (!isActive()) {
        li.className = CSS_CLASS;
      }
      if (instance.hidden()) {
        li.setAttribute('hidden', true);
      } else {
        li.removeAttribute('hidden');
      }
      li.innerText = page.label();
      const listWidth = settingsList.clientWidth;
      const padding = 10;
      const settingCntPadding = listWidth + padding;
      const settingCntWidth = window.outerWidth - (listWidth + (2 * padding));
      settingsCnt.style = `padding-left: ${settingCntPadding}px;
        width: ${settingCntWidth}px`;
    }

    this.isPage = function (p) {return p === page;}
    function open () {window.location.href = `#${page.constructor.name}`;}

    this.onOpen = function () {}

    li.addEventListener('click', open);
    settingsList.append(li);
    Settings.settings[page.constructor.name] = this;
    this.updateMenu();
    if (isActive()) this.activate();
  }
}

Settings.settings = {};
Settings.urlReg = /(^((.*?)#)(.*)$)/;
Settings.activePage = function () {
  const pageName = window.location.href.replace(Settings.urlReg, '$4');
  return pageName.indexOf('://') === -1 ? pageName :
        Object.keys(Settings.settings)[0];
}
Settings.updateMenus = function (page) {
  if (document.readyState !== "complete") return;
  
  const settingsPages = Object.values(Settings.settings);
  if (settingsPages.length) {
    let activeIndex = 0;
    Settings.settings[Settings.activePage()].activate(true);
    while (Settings.active === undefined || Settings.active.hidden()) {
      settingsPages[activeIndex++].activate(true);
    }
    for (let index = 0; index < settingsPages.length; index += 1) {
      const setting = settingsPages[index];
      setting.activate();
    }
  }
}


window.onhashchange = function () {
  Settings.updateMenus();
};
window.onload = () => document.addEventListener(User.updateEvent(), Settings.updateMenus);

function getInnerState(page) {
  var stateReg = new RegExp(`^.*?#${page}:(.*)$`);
  if (window.location.href.match(stateReg)) {
    return window.location.href.replace(stateReg, "$1")
  }
}

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
// ./src/index/services/$t.js

$t.functions['483114051'] = function (get) {
	return `<span class='ce-linear-tab'>` + (get("sug")) + `</span>`
}
$t.functions['492362584'] = function (get) {
	return `<div class='ce-full-width' id='` + (get("elem").id()) + `'></div>`
}
$t.functions['755294900'] = function (get) {
	return `<li class='ce-hover-list` + (get("expl").id === get("active").expl.id ? " active": "") + `' > ` + (get("expl").words) + `&nbsp;<b class='ce-small-text'>(` + (get("expl").popularity) + `%)</b> </li>`
}
$t.functions['863427587'] = function (get) {
	return `<li class='ce-tab-list-item' ` + (get("elem").show() ? '' : 'hidden') + `> <img class="lookup-img" src="` + (get("elem").imageSrc()) + `"> </li>`
}
$t.functions['1870015841'] = function (get) {
	return `<div class='ce-margin'> <div class='ce-merriam-expl-card'> <div class='ce-merriam-expl-cnt'> <h3>` + (get("item").hwi.hw) + `</h3> ` + (new $t('<div class=\'ce-merriam-expl\'> {{def}} <br><br> </div>').render(get('scope'), 'def in item.shortdef', get)) + ` </div> </div> </div>`
}
$t.functions['hover-explanation'] = function (get) {
	return `<div> <div class="ce-inline ce-width-full"> <div class=""> <ul id='` + (get("HOVER_SWITCH_LIST_ID")) + `'> ` + (new $t('<li class=\'ce-hover-list{{expl.id === active.expl.id ? " active": ""}}\' > {{expl.words}}&nbsp;<b class=\'ce-small-text\'>({{expl.popularity}}%)</b> </li>').render(get('scope'), 'expl in active.list', get)) + ` </ul> </div> <div class='ce-width-full'> <div class='ce-hover-expl-title-cnt'> <div class='ce-center'> <button id='ce-expl-voteup-btn'` + (get("canLike") ? '' : ' disabled') + `></button> <br> ` + (get("likes")) + ` </div> <h3>` + (get("active").expl.words) + `</h3> <div class='ce-center'> ` + (get("dislikes")) + ` <br> <button id='ce-expl-votedown-btn'` + (get("canDislike") ? '' : ' disabled') + `></button> </div> &nbsp;&nbsp;&nbsp;&nbsp; </div> <div class=''> <div>` + (get("content")) + `</div> </div> </div> </div> <div class='ce-center'> <button ` + (get("loggedIn") ? ' hidden' : '') + ` id='` + (get("HOVER_LOGIN_BTN_ID")) + `'> Login </button> </div> </div> `
}
$t.functions['hover-resources'] = function (get) {
	return `<div id='` + (get("POPUP_CNT_ID")) + `'> <div class='ce-relative'> <div class='ce-hover-max-min-abs-cnt'> <div class='ce-hover-max-min-cnt'> <button class='ce-upper-right-btn' id='` + (get("MAXIMIZE_BTN_ID")) + `'> &plus; </button> <button class='ce-upper-right-btn' hidden id='` + (get("MINIMIZE_BTN_ID")) + `'> &minus; </button> </div> </div> </div> <div id='` + (get("POPUP_CONTENT_ID")) + `' class='ce-full'></div> </div> `
}
$t.functions['icon-menu/controls'] = function (get) {
	return `<!DOCTYPE html> <html> <head> <link rel="stylesheet" href="/css/menu.css"> </head> <body> <div id='control-ctn'> </div> <script type="text/javascript" src='/AppMenu.js'></script> </body> </html> `
}
$t.functions['icon-menu/links/favorite-lists'] = function (get) {
	return `<h1>favorite lists</h1> `
}
$t.functions['icon-menu/links/developer'] = function (get) {
	return `<div> <div> <label>Environment:</label> <select id='` + (get("ENV_SELECT_ID")) + `'> ` + (new $t('<option  value="{{env}}" {{env === currEnv ? \'selected\' : \'\'}}> {{env}} </option>').render(get('scope'), 'env in envs', get)) + ` </select> </div> <div> <label>Debug Gui Host:</label> <input type="text" id="` + (get("DG_HOST_INPUT_ID")) + `" value="` + (get("debugGuiHost")) + `"> </div> <div> <label>Debug Gui Id:</label> <input type="text" id="` + (get("DG_ID_INPUT_ID")) + `" value="` + (get("debugGuiId")) + `"> </div> </div> `
}
$t.functions['-67159008'] = function (get) {
	return `<option value="` + (get("env")) + `" ` + (get("env") === get("currEnv") ? 'selected' : '') + `> ` + (get("env")) + ` </option>`
}
$t.functions['icon-menu/links/login'] = function (get) {
	return `<div id='ce-login-cnt'> <div id='ce-login-center'> <h3 class='ce-error-msg'>` + (get("errorMsg")) + `</h3> <div ` + (get("state") === get("LOGIN") ? '' : 'hidden') + `> <input type='text' placeholder="Email" id='` + (get("EMAIL_INPUT")) + `' value='` + (get("email")) + `'> <br/><br/> <button type="button" id='` + (get("LOGIN_BTN_ID")) + `'>Submit</button> </div> <div ` + (get("state") === get("REGISTER") ? '' : 'hidden') + `> <input type='text' placeholder="Username" id='` + (get("USERNAME_INPUT")) + `' value='` + (get("username")) + `'> <br/><br/> <button type="button" id='` + (get("REGISTER_BTN_ID")) + `'>Register</button> </div> <div ` + (get("state") === get("CHECK") ? '' : 'hidden') + `> <h4>To proceed check your email confirm your request</h4> <br/><br/> <button type="button" id='` + (get("RESEND_BTN_ID")) + `'>Resend</button> <h2>or<h2/> <button type="button" id='` + (get("LOGOUT_BTN_ID")) + `'>Use Another Email</button> </div> </div> </div> `
}
$t.functions['icon-menu/links/profile'] = function (get) {
	return `<div> <div id='ce-profile-header-ctn'> <h1>` + (get("username")) + `</h1> &nbsp;&nbsp;&nbsp;&nbsp; <div> <button id='` + (get("LOGOUT_BTN_ID")) + `' type="submit">Logout</button> </div> </div> <h3>` + (get("importantMessage")) + `</h3> <form id=` + (get("UPDATE_FORM_ID")) + `> <div> <label for="` + (get("USERNAME_INPUT_ID")) + `">New Username:</label> <input class='ce-float-right' id='` + (get("USERNAME_INPUT_ID")) + `' type="text" name="username" value=""> <br><br> <label for="` + (get("NEW_EMAIL_INPUT_ID")) + `">New Email:&nbsp;&nbsp;&nbsp;&nbsp;</label> <input class='ce-float-right' id='` + (get("NEW_EMAIL_INPUT_ID")) + `' type="email" name="email" value=""> </div> <br><br><br> <div> <label for="` + (get("CURRENT_EMAIL_INPUT_ID")) + `">Confirm Current Email:</label> <input required class='ce-float-right' id='` + (get("CURRENT_EMAIL_INPUT_ID")) + `' type="email" name="currentEmail" value=""> </div> <br> <div class="ce-center"> <button id='` + (get("UPDATE_BTN_ID")) + `' type="submit" name="button">Update</button> </div> </form> <div> <label>Likes:</label> <b>` + (get("likes")) + `</b> </div> <br> <div> <label>DisLikes:</label> <b>` + (get("dislikes")) + `</b> </div> </div> `
}
$t.functions['icon-menu/links/raw-text-tool'] = function (get) {
	return `<div id='` + (get("RAW_TEXT_CNT_ID")) + `'> Enter text to update this content. </div> `
}
$t.functions['icon-menu/menu'] = function (get) {
	return ` <menu> <menuitem id='login-btn' ` + (get("loggedIn") ? 'hidden': '') + `> Login </menuitem> <menuitem id='logout-btn' ` + (!get("loggedIn") ? 'hidden': '') + `> Logout </menuitem> <menuitem id='enable-btn' ` + (get("enabled") ? 'hidden': '') + `> Enable </menuitem> <menuitem id='disable-btn' ` + (!get("enabled") ? 'hidden': '') + `> Disable </menuitem> <menuitem id='ce-settings'> Settings </menuitem> </menu> `
}
$t.functions['icon-menu/raw-text-input'] = function (get) {
	return `<div class='ce-padding ce-full'> <div class='ce-padding'> <label>TabSpacing</label> <input type="number" id="` + (get("TAB_SPACING_INPUT_ID")) + `" value="` + (get("tabSpacing")) + `"> </div> <textarea id='` + (get("RAW_TEXT_INPUT_ID")) + `' style='height: 90%; width: 95%;'></textarea> </div> `
}
$t.functions['icon-menu/settings'] = function (get) {
	return `<!DOCTYPE html> <html lang="en" dir="ltr"> <head> <meta charset="utf-8"> <title>CE Settings</title> <link rel="stylesheet" href="/css/index.css"> <link rel="stylesheet" href="/css/settings.css"> <link rel="stylesheet" href="/css/lookup.css"> <link rel="stylesheet" href="/css/hover-resource.css"> <script type="text/javascript" src='/bin/short-cut-container.js'></script> <script type='text/javascript' src='/bin/debug-gui.js'></script> <script type='text/javascript' src='/bin/debug-gui-client.js'></script> </head> <body> <div class='ce-setting-cnt'> <div id='ce-setting-list-cnt'> <ul id='ce-setting-list'></ul> </div> <div id='ce-setting-cnt'></div> </div> <script type="text/javascript" src='/Settings.js'></script> </body> </html> `
}
$t.functions['popup-cnt/explanation'] = function (get) {
	return `<div class='ce-expl-card'> <span class='ce-expl-cnt'> <div class='ce-expl-apply-cnt'> <button expl-id="` + (get("explanation").id) + `" class='ce-expl-apply-btn' ` + (get("explanation").canApply ? '' : 'disabled') + `> Apply </button> </div> <span class='ce-expl'> <div> <h5> ` + (get("explanation").author.percent) + `% ` + (get("explanation").words) + ` - ` + (get("explanation").shortUsername) + ` </h5> ` + (get("explanation").rendered) + ` </div> </span> </span> </div> `
}
$t.functions['popup-cnt/linear-tab'] = function (get) {
	return `<span class='ce-linear-tab'>` + (get("scope")) + `</span> `
}
$t.functions['popup-cnt/lookup'] = function (get) {
	return `<div> <div class='ce-inline-flex' id='` + (get("HISTORY_CNT_ID")) + `'></div> <div class='ce-inline-flex' id='` + (get("MERRIAM_WEB_SUG_CNT_ID")) + `'></div> <div class='ce-tab-ctn'> <ul class='ce-tab-list'> ` + (new $t('<li  class=\'ce-tab-list-item\' {{elem.show() ? \'\' : \'hidden\'}}> <img class="lookup-img" src="{{elem.imageSrc()}}"> </li>').render(get('scope'), 'elem in list', get)) + ` </ul> <div class='ce-lookup-cnt'> ` + (new $t('<div  class=\'ce-full-width\' id=\'{{elem.id()}}\'></div>').render(get('scope'), 'elem in list', get)) + ` </div> </div> </div> `
}
$t.functions['popup-cnt/tab-contents/add-explanation'] = function (get) {
	return `<div class='ce-full'> <div class='ce-inline ce-full'> <div class="ce-full" id='` + (get("ADD_EDITOR_CNT_ID")) + `'> <div class='ce-center'> <h3>` + (get("words")) + `</h3> <p` + (get("writingJs") ? '' : ' hidden') + ` class='ce-error'>Stop tring to write JavaScript!</p> </div> <textarea id='` + (get("ADD_EDITOR_ID")) + `' class='ce-full'></textarea> </div> <div> <button id='` + (get("SUBMIT_EXPL_BTN_ID")) + `'>Add&nbsp;To&nbsp;Url</button> </div> </div> </div> `
}
$t.functions['popup-cnt/tab-contents/explanation-cnt'] = function (get) {
	return `<div> <div class='ce-center'> <h2 ` + (get("explanations").length > 0 ? 'hidden' : '') + `>No Explanations Found</h2> </div> <div class='ce-expls-cnt'` + (get("explanations").length > 0 ? '' : ' hidden') + `> <div class='ce-lookup-expl-list-cnt'> ` + (new $t('popup-cnt/explanation').render(get('scope'), 'explanation in explanations', get)) + ` </div> </div> <div class='ce-center'> <button` + (get("loggedIn") ? '' : ' hidden') + ` id='` + (get("CREATE_YOUR_OWN_BTN_ID")) + `'> Create Your Own </button> <button` + (!get("loggedIn") ? '' : ' hidden') + ` id='` + (get("LOGIN_BTN_ID")) + `'> Login </button> </div> </div> `
}
$t.functions['-1132695726'] = function (get) {
	return `popup-cnt/explanation`
}
$t.functions['popup-cnt/tab-contents/explanation-header'] = function (get) {
	return `<div> <div class='ce-lookup-expl-heading-cnt'> <div class='ce-key-cnt'> <input type='text' style='font-size: x-large;margin: 0;' value='` + (get("words")) + `' id='` + (get("EXPL_SEARCH_INPUT_ID")) + `'> <button class='ce-words-search-btn' id='` + (get("SEARCH_BTN_ID")) + `'>Search</button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </div> <div` + (get("explanations").length > 0 ? '' : ' hidden') + `> <div class='ce-expl-tag-cnt'> ` + (new $t('<span > <input type=\'checkbox\' class=\'ce-expl-tag\' value=\'{{tag}}\' {{selected.indexOf(tag) === -1 ? \'\' : \'checked\'}}> <label>{{tag}}</label> </span>').render(get('scope'), 'tag in allTags', get)) + ` </div> </div> </div> </div> `
}
$t.functions['-1828676604'] = function (get) {
	return `<span > <input type='checkbox' class='ce-expl-tag' value='` + (get("tag")) + `' ` + (get("selected").indexOf(get("tag")) === -1 ? '' : 'checked') + `> <label>` + (get("tag")) + `</label> </span>`
}
$t.functions['popup-cnt/tab-contents/webster-header'] = function (get) {
	return `<div class='ce-merriam-header-cnt'> <a href='https://www.merriam-webster.com/dictionary/` + (get("key")) + `' target='merriam-webster'> Merriam&nbsp;Webster&nbsp;'` + (get("key")) + `' </a> <div id='` + (get("MERRIAM_WEB_SUG_CNT_ID")) + `'> ` + (new $t('<span  class=\'ce-linear-tab\'>{{sug}}</span>').render(get('scope'), 'sug in suggestions', get)) + ` </div> </div> `
}
$t.functions['popup-cnt/tab-contents/webster'] = function (get) {
	return `<div class='ce-merriam-cnt'> <div id='` + (get("MERRIAM_WEB_SUG_CNT_ID")) + `'> ` + (new $t('<span  class=\'ce-linear-tab\'>{{sug}}</span>').render(get('scope'), 'sug in suggestions', get)) + ` </div> ` + (new $t('<div  class=\'ce-margin\'> <div class=\'ce-merriam-expl-card\'> <div class=\'ce-merriam-expl-cnt\'> <h3>{{item.hwi.hw}}</h3> {{new $t(\'<div  class=\\\'ce-merriam-expl\\\'> {{def}} <br><br> </div>\').render(get(\'scope\'), \'def in item.shortdef\', get)}} </div> </div> </div>').render(get('scope'), 'item in definitions', get)) + ` </div> `
}
$t.functions['-1925646037'] = function (get) {
	return `<div class='ce-merriam-expl'> ` + (get("def")) + ` <br><br> </div>`
}
$t.functions['popup-cnt/tab-contents/wikapedia'] = function (get) {
	return `<iframe class='ce-wiki-frame' src="https://en.wikipedia.org/wiki/Second_Silesian_War"></iframe> `
}
$t.functions['tabs'] = function (get) {
	return `<div class='ce-inline ce-full' id='` + (get("TAB_CNT_ID")) + `'> <div> <div position='fixed' id='` + (get("NAV_CNT_ID")) + `'> <ul class='ce-width-full ` + (get("LIST_CLASS")) + `' id='` + (get("LIST_ID")) + `'> ` + (new $t('<li  {{page.hide() ? \'hidden\' : \'\'}} class=\'{{activePage === page ? ACTIVE_CSS_CLASS : CSS_CLASS}}\'> {{page.label()}} </li>').render(get('scope'), 'page in pages', get)) + ` </ul> </div> <div id='` + (get("NAV_SPACER_ID")) + `'></div> </div> <div class='ce-width-full'> <div position='fixed' id='` + (get("HEADER_CNT_ID")) + `'> ` + (get("header")) + ` </div> <div class='ce-full-width' id='` + (get("CNT_ID")) + `'> ` + (get("content")) + ` </div> </div> </div> `
}
$t.functions['-888280636'] = function (get) {
	return `<li ` + (get("page").hide() ? 'hidden' : '') + ` class='` + (get("activePage") === get("page") ? get("ACTIVE_CSS_CLASS") : get("CSS_CLASS")) + `'> ` + (get("page").label()) + ` </li>`
}
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

class User {
  constructor() {
    let user;
    let status = 'expired';
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
    this.isLoggedIn = function () {
      return status === 'active' && user !== undefined;
    }
    this.loggedIn = () => instance.isLoggedIn() ? JSON.parse(JSON.stringify(user)) : undefined;

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
        Request.get(url, updateStatus);
        url = EPNTS.user.get(credential.replace(userCredReg, '$1'));
        Request.get(url, setUser);
      } else if (credential === null) {
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

class Developer extends Page {
  constructor() {
    super();
    const instance = this;
    const ENV_SELECT_ID = 'ce-env-select-id';
    const DG_HOST_INPUT_ID = 'ce-dg-host-input';
    const DG_ID_INPUT_ID = 'ce-dg-id-input';
    let show = false;
    this.label = function () {return 'Developer';};
    this.hide = function () {return !show;}
    this.scope = () => {
      const envs = Object.keys(EPNTS._envs);
      const currEnv = properties.get('env');
      const debugGuiHost = properties.get('debugGuiHost') || 'https://node.jozsefmorrissey.com/debug-gui';
      const debugGuiId = properties.get('debugGuiId');
      return {ENV_SELECT_ID, DG_HOST_INPUT_ID, DG_ID_INPUT_ID,
              envs, currEnv, debugGuiHost, debugGuiId};
    };
    this.template = function() {return 'icon-menu/links/developer';}
    function envUpdate(event) {properties.set('env', event.target.value, true)};
    this.onOpen = () => {
      document.getElementById(ENV_SELECT_ID).onchange = propertyUpdate('env');
      document.getElementById(DG_HOST_INPUT_ID).onchange = propertyUpdate('debugGuiHost');
      document.getElementById(DG_ID_INPUT_ID).onchange = propertyUpdate('debugGuiId');
    }

    new KeyShortCut('dev', () => {
      show = !show;
      if (show) {
        properties.set('debug', true, true);
        Settings.settings[instance.constructor.name].activate(true);
      } else {
        properties.set('debug', false, true);
        Settings.updateMenus();
      }
    });

    this.updateDebug = (debug) => {show = debug; Settings.updateMenus();}
  }
}
const developerPage = new Developer();
const developerSettings = new Settings(developerPage);
properties.onUpdate('debug', developerPage.updateDebug);

class FavoriteLists extends Page {
  constructor() {
    super();
    this.label = function () {return 'Favorite Lists';};
    this.hide = function () {return !User.isLoggedIn();}
    this.template = function() {return 'icon-menu/links/favorite-lists';}
  }
}
new Settings(new FavoriteLists());

class Login extends Page {
  constructor() {
    super();
    const scope = {
      LOGIN: 'Login',
      CREATE: 'create',
      CHECK: 'check',
      EMAIL_INPUT: 'ce-email-input',
      USERNAME_INPUT: 'ce-username-input',
      LOGIN_BTN_ID: 'ce-login-btn',
      REGISTER_BTN_ID: 'ce-register-btn',
      RESEND_BTN_ID: 'ce-resend-btn',
      LOGOUT_BTN_ID: 'ce-remove-btn',
    };
    const instance = this;
    let user, secret;
    scope.state = scope.LOGIN;
    this.label = function () {return 'Login';};
    this.template = function() {return 'icon-menu/links/login';};
    this.hide = function () {return User.isLoggedIn();};
    this.scope = function () {return scope;};

    function setState(state) {
      return function () {
        scope.state = state;
        Settings.updateMenus();
      }
    }

    function setError(error) {
      switch (scope.state) {
        case scope.LOGIN:
          if (error.status === 404) {
            setState(scope.REGISTER)();
          } else if (error) {
            scope.errorMsg = error;
          } else {
            scope.errorMsg = 'Server Error';
          }
          break;
        case scope.REGISTER:
          scope.errorMsg = 'Username Taken';
          break;
        default:
          scope.errorMsg = 'Server Error';
      }

      Settings.updateMenus();
    }

    let lastStatus = 'expired';
    let lastUser;
    function credentialUpdated(e) {
      if (User && User.status() !== lastStatus) {
        lastStatus = User.status();
        lastUser = user;
        switch (lastStatus) {
          case 'active':
          profileSetting.activate();
          break;
          case 'pending':
          setState(scope.CHECK)();
          break;
          case 'expired':
          setState(scope.LOGIN)();
          break;
          default:
          console.error('Unknown user status')
        }
      }
    }

    function setUser(user) {
      User.addCredential(user.id);
    }

    function getUser () {
      scope.email = document.getElementById(scope.EMAIL_INPUT).value;
      User.get(scope.email, setUser, setError);
    }

    function register () {
      scope.username = document.getElementById(scope.USERNAME_INPUT).value;
      User.register(scope.email, scope.username);
    }

    function onEnter(id, func) {
      const elem = document.getElementById(id);
      if (elem !== null) {
        elem.addEventListener('keypress', (e) => {
          if(e.key === 'Enter') func()
        });
      }
    }

    function resetErrorCall(func) {
      return function () {scope.errorMsg = undefined; func();}
    }

    this.onOpen = function () {
      credentialUpdated();
      const loginBtn = document.getElementById(scope.LOGIN_BTN_ID);
      const registerBtn = document.getElementById(scope.REGISTER_BTN_ID);
      const resendBtn = document.getElementById(scope.RESEND_BTN_ID);
      const logoutBtn = document.getElementById(scope.LOGOUT_BTN_ID);


      registerBtn.addEventListener("click", resetErrorCall(register));
      loginBtn.addEventListener("click", resetErrorCall(getUser));
      resendBtn.addEventListener("click", resetErrorCall(User.addCredential));
      logoutBtn.addEventListener("click", resetErrorCall(User.logout));

      onEnter(scope.EMAIL_INPUT, resetErrorCall(getUser));
      onEnter(scope.USERNAME_INPUT, resetErrorCall(register));
    }
    document.addEventListener(User.errorEvent(), setError);
  }
}
new Settings(new Login());

class Profile extends Page {
  constructor() {
    super();
    const scope = {
      LOGOUT_BTN_ID: 'ce-logout-btn',
      UPDATE_BTN_ID: 'ce-update-btn',
      USERNAME_INPUT_ID: 'ce-username-input',
      CURRENT_EMAIL_INPUT_ID: 'ce-current-email-input',
      NEW_EMAIL_INPUT_ID: 'ce-new-email-input',
      UPDATE_FORM_ID: 'ce-update-form'
    };
    const updateEmailSent = 'Email sent: you must confirm changes';
    this.label = function () {return 'Profile';};
    this.template = function() {return 'icon-menu/links/profile';}
    this.hide = function () {return !User.isLoggedIn();}
    this.scope = function () {return scope;};
    this.beforeOpen = function () {
      if (!this.hide()) {
        let user = User.loggedIn();
        scope.id = user.id;
        scope.username = user.username;
        scope.likes = user.likes;
        scope.dislikes = user.dislikes;
      }
    }

    function setError(errMsg) {
      return function (err) {
        scope.importantMessage = errMsg || err.errorMsg
        console.info(err);
        Settings.updateMenus();
      }
    }

    function update() {
      let body = {user: {}};
      body.originalEmail = document.getElementById(scope.CURRENT_EMAIL_INPUT_ID).value;
      body.user.id = User.loggedIn().id;
      body.user.username = document.getElementById(scope.USERNAME_INPUT_ID).value || undefined;
      body.user.email = document.getElementById(scope.NEW_EMAIL_INPUT_ID).value || undefined;
      const url = EPNTS.user.requestUpdate();
      Request.post(url, body, setError(updateEmailSent), setError());
    }

    this.onOpen = function () {
      document.getElementById(scope.LOGOUT_BTN_ID).addEventListener("click", User.logout);

      Form.onSubmit(scope.UPDATE_FORM_ID, update);
      // document.getElementById(scope.UPDATE_BTN_ID).addEventListener("click", update);
    }
  }
}
const profileSetting = new Settings(new Profile());

class RawTextTool extends Page {
  constructor() {
    super();
    const scope = {
      TAB_SPACING_INPUT_ID: 'ce-tab-spcing-input-cnt-id',
      RAW_TEXT_INPUT_ID: 'ce-raw-text-input-id',
      RAW_TEXT_CNT_ID: 'ce-raw-text-input-cnt-id',
      tabSpacing: 4
    }
    const rawInputTemplate = new $t('icon-menu/raw-text-input');
    const RawSCC = ShortCutContainer('ce-raw-text-tool-cnt-id', ['r','t'], rawInputTemplate.render(scope));

    function textToHtml(text, spacing, tabSpacing) {
      if (text === undefined) return '';
      const space = new Array(spacing).fill('&nbsp;').join('');
      const tab = new Array(tabSpacing).fill('&nbsp;').join('');
      return text.replace(/\n/g, '<br>')
                  .replace(/\t/g, tab)
                  .replace(/\s/g, space);
    }

    // function pulled from https://jsfiddle.net/2wAzx/13/
    function enableTab(el) {
      el.onkeydown = function(e) {
        if (e.keyCode === 9) {
          var val = this.value,
              start = this.selectionStart,
              end = this.selectionEnd;
          this.value = val.substring(0, start) + '\t' + val.substring(end);
          this.selectionStart = this.selectionEnd = start + 1;
          return false;
        }
      };
    }

    this.scope = () => scope;
    this.label = function () {return 'Raw Text Tool';};
    this.template = function() {return 'icon-menu/links/raw-text-tool';};
    this.onOpen = function () {
      document.getElementById(scope.TAB_SPACING_INPUT_ID).onchange =
            (event) => scope.tabSpacing = Number.parseInt(event.target.value);
      const textArea = document.getElementById(scope.RAW_TEXT_INPUT_ID);
      enableTab(textArea);
      const container = document.getElementById(scope.RAW_TEXT_CNT_ID);
      const html = textToHtml(event.target.value, 1, scope.tabSpacing);
      textArea.onkeyup = (event) => safeInnerHtml(html, container)
      RawSCC.unlock();
      RawSCC.show();
      RawSCC.lock();
    };
    this.onClose = function () {
      RawSCC.unlock();
      RawSCC.hide();
      RawSCC.lock();
    };
  }
}
new Settings(new RawTextTool());

return {afterLoad};
}
Settings = Settings()
Settings.afterLoad.forEach((item) => {item();});
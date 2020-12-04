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

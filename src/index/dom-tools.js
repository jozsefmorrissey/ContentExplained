

function isScrollable(elem) {
    const horizontallyScrollable = elem.scrollWidth > elem.clientWidth;
    const verticallyScrollable = elem.scrollHeight > elem.clientHeight;
    return elem.scrollWidth > elem.clientWidth || elem.scrollHeight > elem.clientHeight;
};

function fadeOut(elem, disapearAt, func) {
  const origOpacity = elem.style.opacity;
  let stopFade = false;
  function reduceOpacity () {
    if (stopFade) return;
    elem.style.opacity -= .005;
    if (elem.style.opacity <= 0) {
      elem.style.opacity = origOpacity;
      func(elem);
    } else {
      setTimeout(reduceOpacity, disapearAt * 2 / 600 * 1000);
    }
  }

  elem.style.opacity = 1;
  setTimeout(reduceOpacity, disapearAt / 3 * 1000);
  return () => {
    stopFade = true;
    elem.style.opacity = origOpacity;
  };
}

function scrollableParents(elem) {
  let scrollable = [];
  if (elem instanceof HTMLElement) {
    if (isScrollable(elem)) {
      scrollable.push(elem);
    }
    return scrollableParents(elem.parentNode).concat(scrollable);
  }
  return scrollable;
}

function getParents(elem, selector) {
  let matches = [];
  if (elem instanceof HTMLElement) {
    if ((typeof selector) === 'string') {
      if (elem.matches(selector)) {
        matches.push(elem);
      }
    } else if ((typeof selector) === 'function') {
      if (selector(elem)) {
        matches.push(elem)
      }
    } else {
      throw new Error('Unrecognized selector type, must be "function" or a "queryString"');
    }

    return getParents(elem.parentNode, selector).concat(matches);
  }
  return matches;
}

function center(elem) {
  const rect = elem.getBoundingClientRect();
  const x = rect.x + (rect.height / 2);
  const y = rect.y + (rect.height / 2);
  return {x, y, top: rect.top};
}

function temporaryStyle(elem, time, style) {
  const save = {};
  const keys = Object.keys(style);
  keys.forEach((key) => {
    save[key] = elem.style[key];
    elem.style[key] = style[key];
  });

  setTimeout(() => {
    keys.forEach((key) => {
      elem.style[key] = save[key];
    });
  }, time);
}

function scrollIntoView(elem, divisor, delay, scrollElem) {
  let scrollPidCounter = 0;
  const lastPosition = {};
  let highlighted = false;
  function scroll(scrollElem) {
    return function() {
      const scrollCenter = center(scrollElem);
      const elemCenter = center(elem);
      const fullDist = Math.abs(scrollCenter.y - elemCenter.y);
      const scrollDist = fullDist > 5 ? fullDist/divisor : fullDist;
      const yDiff = scrollDist * (elemCenter.y < scrollCenter.y ? -1 : 1);
      scrollElem.scroll(0, scrollElem.scrollTop + yDiff);
      if (elemCenter.top !== lastPosition[scrollElem.scrollPid]
            && (scrollCenter.y < elemCenter.y - 2 || scrollCenter.y > elemCenter.y + 2)) {
        lastPosition[scrollElem.scrollPid] = elemCenter.top;
        setTimeout(scroll(scrollElem), delay);
      } else if(!highlighted) {
        highlighted = true;
        temporaryStyle(elem, 5000, {
          borderStyle: 'solid',
          borderColor: '#07ff07',
          borderWidth: '5px'
        });
      }
    }
  }
  const scrollParents = scrollableParents(elem);
  scrollParents.forEach((scrollParent) => {
    scrollParent.scrollPid = scrollPidCounter++;
    setTimeout(scroll(scrollParent), 10);
  });
}

const selectors = {};
let matchRunIdCount = 0;
function getTargetId(target) {
  if((typeof target.getAttribute) === 'function') {
    let targetId = target.getAttribute('ce-match-run-id');
    if (targetId === null || targetId === undefined) {
      targetId = matchRunIdCount + '';
      target.setAttribute('ce-match-run-id', matchRunIdCount++)
    }
    return targetId;
  }
  return target === document ?
        '#document' : target === window ? '#window' : undefined;
}

function runMatch(event) {
  const  matchRunTargetId = getTargetId(event.currentTarget);
  const selectStrs = Object.keys(selectors[matchRunTargetId][event.type]);
  selectStrs.forEach((selectStr) => {
    const target = up(selectStr, event.target);
    if (target) {
      selectors[matchRunTargetId][event.type][selectStr].forEach((func) => func(target));
    }
  })
}

function matchRun(event, selector, func, target) {
  target = target || document;
  const  matchRunTargetId = getTargetId(target);
  if (selectors[matchRunTargetId] === undefined) {
    selectors[matchRunTargetId] = {};
  }
  if (selectors[matchRunTargetId][event] === undefined) {
    selectors[matchRunTargetId][event] = {};
    target.addEventListener(event, runMatch);
  }
  if (selectors[matchRunTargetId][event][selector] === undefined) {
    selectors[matchRunTargetId][event][selector] = [];
  }

  selectors[matchRunTargetId][event][selector].push(func);
}

function updateId (id, document, strHtml) {
  const tempElem = document.createElement('div');
  tempElem.innerHTML = strHtml;
  const newHtml = tempElem.getElementById(id).outerHTML;
  document.getElementById(id).outerHTML = newHtml;
}

function getSiblings(elem, selector) {
  const siblings = [];
  let curr=elem.nextElementSibling;
  while (curr) {
    if (selector === undefined || curr.matches(selector)) {
      siblings.push(curr);
    }
    curr = curr.nextElementSibling;
  }
  curr=elem.previousElementSibling;
  while (curr) {
    if (selector === undefined || curr.matches(selector)) {
      siblings.push(curr);
    }
    curr = curr.previousElementSibling;
  }
  return siblings;
}

const activeReg = /(^| )active( |$)/;
function tabClass(target) {
  function switchDisplay(target) {
    if(target.className.match(activeReg)) return;
    target.className = target.className + ' active';
    const tabId = target.getAttribute('ce-tab');
    document.getElementById(tabId).hidden = false;
    const siblings = getSiblings(target, '[ce-tab]');
    siblings.forEach((sibling) => {
      const sibTargId = sibling.getAttribute('ce-tab');
      sibling.className = sibling.className.replace(activeReg, '');
      document.getElementById(sibTargId).hidden = true;
    });
  }
  matchRun('click', '[ce-tab]', switchDisplay, target);
}
toggleContainer();

function eachParent(elem, selector, func) {
  const parents = getParents(elem, selector);
  parents.forEach((parent) => func(parent));
}

function toggle(target, hidden) {
  const toggleId = target.getAttribute('ce-toggle');
  const targetElem = document.getElementById(toggleId);
  targetElem.hidden = hidden !== undefined ? hidden : !targetElem.hidden;
  if (targetElem.hidden) {
    const newText = target.getAttribute('ce-toggle-hidden-text');
    if (newText) target.innerText = newText;
  } else {
    const newText = target.getAttribute('ce-toggle-visible-text');
    if (newText) target.innerText = newText;
  }
  const siblingId = targetElem.getAttribute('ce-sibling-id');
  const siblings = document.querySelectorAll(`[ce-sibling-id='${siblingId}']`);
  siblings.forEach((sibling) => {
    if (sibling !== targetElem) {
      document.getElementById(sibTargId).hidden = true;
    }
  });
}

function getAttributes(attribute) {
  const attributes = {};
  const elems = document.querySelectorAll(`[${attribute}]`);
  elems.forEach((elem) => attributes[elem.getAttribute(attribute)] = elem);
  return attributes;
}

function toggleParents(elem, hidden) {
  const togglers = getAttributes('ce-toggle');
  function shouldToggle (parent) {
    const toggleElem = togglers[parent.id];
    if (toggleElem) {
      toggle(toggleElem, hidden);
    }
  }
  eachParent(elem, shouldToggle, toggleParents);
}

function toggleContainer(container) {
  matchRun('click', '[ce-toggle]', toggle, container);
}
toggleContainer();

function up(selector, node) {
  if (node instanceof HTMLElement) {
    if (node.matches(selector)) {
      return node;
    } else {
      return up(selector, node.parentNode);
    }
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
  if (clean !== text) {
    throw new JsDetected(text, clean);
  }
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

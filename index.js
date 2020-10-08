let CE = function () {
const afterLoad = []

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
            failure(oXHR.status, oXHR.statusText);
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
class $t {
	constructor(template, id) {
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
// regExp = {
// 	$t: /\$t\(.*?\).render\(.*?\)/g,
// 	string: /('|"|`).*?[^\\]((\\\\)*|[^\\])(\1)/g,
// 	keywords: /new|typeof|true|false|undefined|null|NaN/g,
// 	objectLabels: /[a-zA-Z][a-zA-Z0-9]*?:/g,
// 	objects: /\{[^]}/
// }

		const parseArray = [{
			name: '$t',
			regex: /\$t\(.*?\).render\(.*?\)/g,
			actionS: 1
		},{
			name: 'string',
			regex: /('|"|`).*?[^\\]((\\\\)*|[^\\])(\1)/g,
			actionS: 2
		},{
			name: 'keywords',
			regex: /new|typeof|true|false|undefined|null|NaN/g,
			actionS: 3
		},{
			name: 'objectLabels',
			regex: /[a-zA-Z][a-zA-Z0-9]*?:/g,
			actionS: 4
		},{
			name: 'objectShortHand',
			regex: /((\{|,)\s*)([a-zA-Z][a-zA-Z0-9]*?)(\s*(\}|,))/g,
			actionS: 5,
			actionM: "$1$3: get(`$3`)$4"
		}, {
			name: 'operators',
			regex: /[^a-z^A-Z^0-9\.]{1,}/g,
			actionS: 6
		}, {
			name: 'objects',
			regex: /([a-zA-Z_][a-zA-Z0-9_\.]{1,})/g,
			actionM: 'get(`$1`)'
		}];

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
				const regArr = new RegArr(block, parseArray);
				str = str.replace(`{{${block}}}`, `\` + (${regArr.result()}) + \``);
			}
			return `${str}`;
		}

		function prefixEverything(string) {
		  return string.replace(/([a-zA-Z][a-zA-Z0-9\._]*)(\s|:|\(|\)|,|\}|\{|$)/g, "get(`$1`)$2");
		}

		const objLabelReg = /(\{[^\}]*)get\(`([a-zA-Z0-9]*\s*)`\):/;
		const objShortHandReg = /(\{(|[^\}]*?,)\s*?)(get\(`([a-zA-Z0-9]*)`\)\s*(,|}))/;
		function fixObjects(string) {
			while (string.match(objLabelReg)) string = string.replace(objLabelReg, '$1$2:');
			while (string.match(objShortHandReg)) string = string.replace(objShortHandReg, '$1$4: $3');
			return string;
		}

		const temp = /(<(\$t) ([^>]* |))repeat=("|')([^>^\4]*?)\4([^>]*>((?!(<\2[^>]*>|<\/\2>)).)*<\/\2>)/;
		function fixStrings(string) {
			const stringReg = /('|"|`).*?[^\\]((\\\\)*|[^\\])(\1)/g;
			const matches = string.match(stringReg);
			for (let index = 0; matches && index < matches.length; index += 1) {
				let match = matches[index];
				let fixed = match.replace(/: get\(`[a-zA-Z0-9]*`\)/g, '');
				fixed = fixed.replace(/get\(`([a-zA-Z0-9]*)`\)/g, '$1');
				string = string.replace(match, fixed);
			}
		  return string;
		}

		const tempRefReg = /\$get\(`t`\)\(('.*?')\).get\(`render`\)\(get\(`scope`\), ('.*?'), get\(`get`\)\)/g;
		const tempReplace = '$t($1).render(get(\'scope\'), $2, get)';
		function fixTemplateReference(string) {
			return string.replace(tempRefReg, tempReplace);
		}

		function fixKeywords(string) {
		  return string.replace(/get\(`(new|typeof|true|false)`\)/g, '$1');
		}

		function fixEmptyExpression(string) {
				return string.replace(/^$/, 'get(\'scope\')');
		}

		function fixUserGetCalls(string) {
			return string.replace(/get\(`get`\)\((`.*?`)\)/, 'get($1)')
		}


		function compile() {
			const blocks = isolateBlocks(template);
			let str = template;
			for (let index = 0; index < blocks.length; index += 1) {
				const block = blocks[index];
				let modified = prefixEverything(block);
				modified = fixObjects(modified);
				// // modified = fixFunctionParams(modified);
				modified = fixStrings(modified);
				console.log('m: ', modified);
				modified = fixTemplateReference(modified);
				modified = fixKeywords(modified);
				modified = fixEmptyExpression(modified);
				modified = fixUserGetCalls(modified);
				str = str.replace(`{{${block}}}`, `\` + (${modified}) + \``);
			}
			return `\`${str}\``;
		}

		const repeatReg = /<([a-zA-Z-]*):t( ([^>]* |))repeat=("|')([^>^\4]*?)\4([^>]*>((?!(<\1:t[^>]*>|<\/\1:t>)).)*<\/)\1:t>/;
		function formatRepeat(string) {
			// tagname:1 prefix:2 quote:4 exlpression:5 suffix:6
			let match;
			while (match = string.match(repeatReg)) {
				let template = `<${match[1]}${match[2] + match[6]}${match[1]}>`.replace(/\\'/g, '\\\\\\\'').replace(/([^\\])'/g, '$1\\\'').replace(/''/g, '\'\\\'');
				string = string.replace(match[0], `{{new $t('${template}').render(scope, '${match[5]}', get)}}`);
				eval(`new $t(\`${template}\`)`);
			}
			return string;
		}

		if (id) {
			$t.templates[id] = undefined;
			$t.functions[id] = undefined;
		}
		id = $t.functions[template] ? template : id || stringHash(template);
		console.log('\n\n\n', id, '\n', template, '\n')
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


class HoverResources {
  constructor (wordExplanationObj, tag) {
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

    function onHover(event, kill) {
      const elem = event.target;
      if (elem.tagName.toLowerCase() === tag && texts[elem.id][0].text) {
        holdOpen = true;
        positionText(elem);
      } else if (elem.id === box.id || killAt === -1){
        holdOpen = true;
        killAt = new Date().getTime() + 750;
      } else if (killAt < new Date().getTime()) {
        holdOpen = false;
        box.style.display = 'none';
        killAt = -1;
      } else {
        holdOpen = false;
        setTimeout(kill, 1000);
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
        for (let index = 0; index < 50; index += 1) {
          const wrapInfo = wrapList[wrapIndex];
          if (wrapInfo) {
            wrapText(wrapInfo.elem, wrapInfo.word, wrapInfo.explainations);
            wrapInfo[wrapIndex++] = undefined;
          }
        }
        setTimeout(wrapOne, 1);
    }

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
  }
}
let CONTEXT_EXPLAINED;

function search() {
  let explanations = new Explanations();

  let definitions = {
    if: "conditional",
    is: "to be or not to be",
    the: "come on man"
  };

  let word;

  function search(word) {
    return [
      'definition 1',
      'definition 2',
      'definition 3',
      'definition 4',
      'definition 5',
      'definition 6',
      'definition 7',
      'definition 8',
      'definition 9'
    ];
  }

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

  function buildUi(props) {
    document.onmouseup = onHighlight;
    CONTEXT_EXPLAINED = props;
    if (props.enabled) {
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
  }

  function setDictionary(merriamWebObj) {
    document.getElementById(MERRIAM_WEB_DEF_CNT_ID).innerHTML = merriamWebObj.defHtml || '';
    document.getElementById(MERRIAM_WEB_SUG_CNT_ID).innerHTML = merriamWebObj.suggestionHtml || '';
  }

  function setExplanation(explanations) {
    const scope = {};
    tagObj = {}
    explanations.forEach(function (expl) {
      expl.tags.forEach(function (tag) {
        tagObj[tag] = true;
      });
    });
    scope.allTags = Object.keys(tagObj);
    scope.words = explanations[0].words;
    scope.explanations = explanations;
    console.log(explanations)
    console.log(scope);
    document.getElementById(CONTEXT_EXPLANATION_CNT_ID).innerHTML = new $t('explanation').render(scope);
  }

  function onHighlight(e) {
    const selection = window.getSelection().toString()
    // Google Doc selection.
    // document.querySelector('.kix-selection-overlay')
    if (selection) {
      const trimmed = selection.trim().toLowerCase();
      if (trimmed) {
        explanations.get(trimmed, setExplanation);
        new MerriamWebster(trimmed, setDictionary);
      }
      UI.show();
      e.stopPropagation();
    }
  }

  function print(val) {
    if (val.enabled && val.enabled !== CONTEXT_EXPLAINED.enabled) {
      window.location.reload()
    }
  }

  chrome.storage.local.get(['enabled'], buildUi);
  return search;
}

afterLoad.push(search);
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
class User {
  constructor() {
    this.user = undefined;

    function successfullAdd(user) {
      user = data;
      const secret = user.secret;
      delete user.secret;
      chrome.storage.local.set({ secret, user });
      USER_ADD_CALL_SUCCESS.trigger();
    }

    function failedAdd(err) {
      USER_ADD_CALL_FAILURE.trigger(err);
    }


    this.add = function (username) {
      const url = `https://localhost:3001/content-explained/add/user/${username}`;
      Request.get(url, successfullAdd, failedAdd);
    }

    this.get = function (words, success, failure) {
      const url = `https://localhost:3001/content-explained/${words}`
      Request.get(url, success, failure);
    }

    function successfullOpinion (data) {
      const likeElems = document.getElementsByClassName('ce-likes');
      likeElems.forEach((item, i) => {
        item.innerHTML = data.likes;
      });
      const dislikeElems = document.getElementsByClassName('ce-dislikes');
      dislikeElems.forEach((item, i) => {
        item.innerHTML = data.likes;
      });
    }

    this.loggedIn = function () {
      return user !== undefined;
    }
  }
}

class ExprDef {
  constructor(name, options, notitify) {
    let start;
    let end;
    const stages = {};
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

    this.allRoutes = function () {
      return getRoutes(null, stages);
    }

    function getNotice(exprDef) {
      currStage = currStage[exprDef.getName()];
    }
    this.getName = function () {return name;};
    this.onClose = function (start, end, ) {
      return function (str, start, end) {
        if (notitify) notitify(this, str, start, end);
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

    function foundCall(onFind, str, start, end) {
      notitify.apply(this, [str, start]);
      if ((typeof onFind) !== 'function') options.onOpen(str, start)
    }

    function find (str, index) {
      let needle = options.close;
      let starting = false;
      if (start === undefined) {
        needle = options.open;
        starting = true;
      }
      const sub = str.substr(index);
      if (needle instanceof RegExp) {
        const match = sub.match(needle);
        if (match && match.index === 0)
          needleLength = match[0].length;
      } else if ((typeof needle) === 'string') {
          if (sub.indexOf(needle) === 0 && !isEscaped(str, index))
            needleLength = needle.length;
      } else if (needle === undefined) {
          needleLength = 0;
      } else {
        throw new Error('Opening or closing type not supported. Needs to be a RegExp or a string');
      }
      if (starting) {
        start = index;
        foundCall(options.onOpen, str, start, end);
      }
      if (!starting || (starting && options.close === undefined)) {
        end = index + needle.length;
        foundCall(options.onClose, str, start, end);
      }
    }

    this.clone = function (notitify) {return new ExprDef(name, options, notitify)};
    this.closed = function () {return end !== -1}
  }
}

exports.ExprDef = ExprDef;





// class Enclosed {
//   constructor(options) {
//     // Required: opening, closing, possiblities,
//     // Optional: name, escape, onOpen, onClose
//     let startIndex = -1
//     let sections = [];
//
//     this.clone = function() {return new Enclosed(options)};
//
//     function startIndexDetected(str, index, stack, name) {
//       if (isOpen()) {
//         stack.push(this.clone);
//       } else {
//         startIndex = index;
//         if ((typeof options.onOpen) === 'function') {
//           options.onOpen(name, str, startIndex);
//         }
//       }
//     }
//
//     function endIndexDetected(str, index, stack, name) {
//       if (isOpen()) {
//         let tos = stack.pop();
//         if (tos !== this) {
//           throw new Error('Tried to close section when section is not ontop of stack');
//         }
//         sections.push({startIndex, endIndex});
//         startIndex = -1;
//         if ((typeof options.onClose) === 'function') {
//           options.onClose(name, str, index);
//         }
//       } else {
//         throw new Error('closing symbol before opening')
//       }
//     }
//
//     function fullElemDetected(str, startIndex, endIndex, name) {
//       options.onOpen(name, str, startIndex, endIndex);
//       options.onClose(name, str, startIndex, endIndex);
//     }
//
//     this.check = function (str, index, stack, name) {
//       let sub = str.substr(index);
//       let nextStartIndex = nextIndex(str, index, options.opening);
//       let nextEndIndex = nextIndex(str, index, options.closing);
//       if (nextStartIndex) {
//         if (!options.closing) {
//           sections.push({index, nextStartIndex});
//           fullElemDetected(str, index, nextStartIndex, name);
//         } else {
//           startIndexDetected();
//         }
//         return index + nextEndIndex;
//       } else if (nextEndIndex) {
//         endIndexDetected();
//         return index + nextEndIndex;
//       }
//     }
//   }
// }
//
// function compile(str) {
//   let index = 0;
//   let defaultPssiblities = [];
//   let stack = [];
//
//   function topOfStack() {
//     return stack[stack.length - 1];
//   }
//
//   while (index < str.lenght) {
//     const tos = topOfStack();
//     const possiblities = tos === undefined ?
//             defaultPssiblities : tos.possiblities();
//     for (let pIndex = 0; tos === topOfStack() &&
//             pIndex < possiblities.length; pIndex += 1) {
//       index = possiblities.check(str, index, stack);
//     }
//   }
// }
const apiKey = 'f4ab4d93-c3ef-4af2-9d83-27b946471849';

class MerriamWebster extends Object {
  constructor(selection, success, failure) {
    const meriamTemplate = new $t('webster/webster');
    const meriamSugTemplate = new $t('webster/webster-suggestions');
    super();
    const instance = {};

    instance.success = function (data) {
      const elem = data[0];
      if (elem.meta && elem.meta.stems) {
        instance.data = data.filter(elem => elem.meta.stems.indexOf(selection) !== -1);;
        instance.defHtml = meriamTemplate.render({data: instance.data, key: selection});
      } else {
        instance.data = data;
        instance.suggestionHtml = meriamSugTemplate.render(data);
      }
      if ((typeof success) === 'function') success(instance);
    }

    instance.failure = function () {
      if ((typeof failure) === 'function') failure(instance);
      console.error('Call to Meriam Webster failed');
    }

    if ((typeof selection) === 'string') {
      const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${selection}?key=${apiKey}`;
      Request.get(url, instance.success, instance.failure);
    }
  }

}
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
let lookupTemplate;
function buildLookupHtml() {
  UI.innerHtml(lookupTemplate.render({
    MERRIAM_WEB_SUG_CNT_ID,
    cssUrl: chrome.runtime.getURL('css/lookup.css'),
    list: [{
      imageSrc: 'http://localhost:3000/images/icons/logo.png',
      cntId: CONTEXT_EXPLANATION_CNT_ID,
      active: true,
    },{
      imageSrc: 'http://localhost:3000/images/icons/Merriam-Webster.png',
      cntId: MERRIAM_WEB_DEF_CNT_ID
    },{
      imageSrc: 'http://localhost:3000/images/icons/wikapedia.png',
      cntId: WIKI_CNT_ID
    }]
  }));
}

function disableAll(elem) {
    const childs = elem.closest('.ce-tab-ctn').children;
    const lis = childs[0].children;
    for (let index = 0; index < lis.length; index += 1) {
        lis[index].className = lis[index].className.replace(/(^| )active($| )/g, ' ');
        childs[index + 1].style.display = 'none';
    }
}

function updateDisplayFunc(div) {
  console.log('lookup');
  return function (event) {
    const elem = event.target.closest('.ce-tab-list-item');
    disableAll(elem);
    elem.className = elem.className + ' active';
    div.style.display = 'block';
  }
}

function initTabs() {
  lookupTemplate = new $t('lookup');
  buildLookupHtml();
    const tabCtns = document.getElementsByClassName('ce-tab-ctn');
    for (let index = 0; index < tabCtns.length; index += 1) {
      const tabCtn = tabCtns[index];
      const childs = tabCtn.children;
      const lis = childs[0].children;
        for (let lIndex = 0; lIndex < lis.length; lIndex += 1) {
          const li = lis[lIndex];
          const div = childs[lIndex + 1];
          li.onclick = updateDisplayFunc(div);
            if (li.className.split(' ').indexOf('active') !== -1) {
                div.style.display = 'block';
            }
        }
    }
}

afterLoad.push(initTabs);
class Explanations {
  constructor(list) {
    this.list = list ? list : [];
    this.add = function (expl) {
      this.list.push(expl);
    }

    this.get = function (words, success, failure) {
      const url = `http://localhost:3000/content-explained/${words}`
      Request.get(url, success, failure);
    }

    this.like = function (words, index, success, failure) {
      const currUrl = window.location.href;
      const callUrl = `https://localhost:3001/content-explained/like/${words}/${index}?url=${currUrl}`;
      Request.get(callUrl, successfullOpinion, failedOpinion);
    }
    this.dislike = function (words, index, success, failure) {
      const currUrl = window.location.href;
      const callUrl = `https://localhost:3001/content-explained/like/${words}/${index}?url=${currUrl}`;
      Request.get(callUrl, successfullOpinion, failedOpinion);
    }
  }
}

console.log("HERE!!!!! ", chrome.runtime.getURL('./html/text-to-html.html'));
let eventCount = 0;
const TEXT_TO_HTML_NAME = 'text-to-html-page-identifier';
const menuTemplate = new $t('menu');
document.addEventListener('DOMContentLoaded', function () {
  function toggleEnable(onOff) {
    return function () {
      chrome.storage.local.set({ enabled: onOff });
      document.getElementById('control-ctn').innerHTML = menuTemplate.render({ enabled: onOff });

      document.getElementById('enable-btn').addEventListener('click', toggleEnable(true));
      document.getElementById('disable-btn').addEventListener('click', toggleEnable(false));

      chrome.tabs.executeScript({
        code: 'console.log('+ eventCount++ +');'
      });
    }
    chrome.tabs.executeScript({
      code: 'console.log('+ eventCount++ +');'
    });
  }

  function displayTextToHtmlPage(event) {
    function openTextToHtmlPage(props) {
      const tab = props.textToHtmlTab;
      const textToHtmlTab = window.open(chrome.runtime.getURL("html/text-to-html.html"), TEXT_TO_HTML_NAME);
      chrome.storage.local.set({ textToHtmlTab });
    }
    chrome.tabs.executeScript({
      code: 'console.log("hello state", "' + event + '");'
      // code: 'console.log("hello state", JSON.parse(' + JSON.stringify(event) + '));'
    });
    chrome.tabs.executeScript({
      code: 'console.log('+eventCount+++');'
    });

    chrome.storage.local.get(['textToHtmlTab'], openTextToHtmlPage);
  }

  function displayMenu(props) {
    document.getElementById('control-ctn').innerHTML = menuTemplate.render({ enabled: props.enabled });
    const nblBtn = document.getElementById('enable-btn');
    chrome.tabs.executeScript({
      // code: 'console.log("len: " + ' + document.getElementById('text-to-html-btn') + ');'
      code: 'console.log("len: " + "' + nblBtn + '");'
    });
    document.getElementById('enable-btn').addEventListener('click', toggleEnable(true));
    document.getElementById('disable-btn').addEventListener('click', toggleEnable(false));
    document.getElementById('text-to-html-btn').addEventListener('click', displayTextToHtmlPage);
  }

  chrome.storage.local.get(['enabled'], displayMenu);
});

chrome.storage.local.set({ state2: Math.random() });
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
const UI_ID = 'ce-ui';
const UI = new ShortCutCointainer(UI_ID, ['c', 'e'], '<h1>Hello ContentExplained</h1>');

const MERRIAM_WEB_DEF_CNT_ID = 'merriam-webster-def-cnt';
const MERRIAM_WEB_SUG_CNT_ID = 'merriam-webster-submission-cnt';
const CONTEXT_EXPLANATION_CNT_ID = 'content-explanation-cnt';
const WIKI_CNT_ID = 'wikapedia-cnt'

const USER_ADD_CALL_SUCCESS = new CustomEvent('user-add-call-success');
const USER_ADD_CALL_FAILURE = new CustomEvent('user-add-call-failure');
const CE_LOADED = new CustomEvent('user-add-call-failure');

$t.functions['467442134'] = function (get) {
	return `<span > <label>` + (get(`tag`)) + `</label> <input type='checkbox' value='` + (get(`tag`)) + `'> </span>`
}
$t.functions['995487500'] = function (get) {
	return `<li class='ce-tab-list-item ` + (get(`elem.active`) ? 'active' : '') + `'> <img class="lookup-img" src="` + (get(`elem.imageSrc`)) + `"> </li>`
}
$t.functions['1043478894'] = function (get) {
	return `<div class='ce-lookup-cnt' id='` + (get(`elem.cntId`)) + `'></div>`
}
$t.functions['popup'] = function (get) {
	return `<div> <div> <input type='text' placeholder="username"> <button type="button" onclick="register()">Register</button> </div> <div> <input type='text' placeholder="sync-key"> <button type='button' onclick="sync()">Sync</button> </div> </div> `
}
$t.functions['explanation'] = function (get) {
	return `<div>change ` + (new $t('<span > <label>{{tag}}</label> <input type=\'checkbox\' value=\'{{tag}}\'> </span>').render(get('scope'), 'tag in allTags', get)) + ` <div class='key-auth'> <span class='key'>` + (get(`words`)) + `</span> <button class='ce-btn ce-add-btn'>+</button> </div> ` + (new $t('<div class=\'ce-expl-card\' > <span class=\'ce-expl-rating-column\'> <div class=\'ce-expl-rating-cnt\'> <div class=\'like-ctn\'> <button class=\'ce-expl-voteup-button\'>Like<br>{{get(`explanation.likes`)}}</button> </div> <div class=\'like-ctn\'> <button class=\'ce-expl-votedown-button\'>Dislike<br>{{get(`explanation.dislikes`)}}</button> </div> </div> </span> <span class=\'ce-expl\'> {{get(`explanation.explanation`)}} </span> <span class=\'ce-expl-author-cnt\'> <div class=\'ce-expl-author\'> {{get(`explanation.author`)}} </div> </span> </div>').render(get('scope'), 'explanation in explanations', get)) + ` </div> `
}
$t.functions['-1973840257'] = function (get) {
	return `<div class='ce-expl-card' > <span class='ce-expl-rating-column'> <div class='ce-expl-rating-cnt'> <div class='like-ctn'> <button class='ce-expl-voteup-button'>Like<br>` + (get(`explanation.likes`)) + `</button> </div> <div class='like-ctn'> <button class='ce-expl-votedown-button'>Dislike<br>` + (get(`explanation.dislikes`)) + `</button> </div> </div> </span> <span class='ce-expl'> ` + (get(`explanation.explanation`)) + ` </span> <span class='ce-expl-author-cnt'> <div class='ce-expl-author'> ` + (get(`explanation.author`)) + ` </div> </span> </div>`
}
$t.functions['text-to-html'] = function (get) {
	return `<!DOCTYPE html> <html lang="en" dir="ltr"> <head> <link rel="stylesheet" href="/css/text-to-html.css"> <meta charset="utf-8"> <title>Text2Html</title> </head> <body> <p> This page is created from HTTP status code information found at ietf.org and Wikipedia. Click on the category heading or the status code link to read more. </p> </body> <script type="text/javascript" src='/index.js'></script> <!-- <script type="text/javascript" src='/src/textToHtml.js'></script> --> </html> `
}
$t.functions['register-login'] = function (get) {
	return `<div> <div> <input type='text' placeholder="username"> <button type="button" onclick="register()">Register</button> </div> <div> <input type='text' placeholder="sync-key"> <button type='button' onclick="sync()">Sync</button> </div> </div> `
}
$t.functions['menu'] = function (get) {
	return ` <menu> <link rel="stylesheet" href="file:///home/jozsef/projects/ContextExplained/css/menu.css"> <link rel="stylesheet" href="/css/menu.css"> <menuitem id='enable-btn' ` + (get(`enabled`) ? 'hidden': '') + `> Enable </menuitem> <menuitem id='disable-btn' ` + (!get(`enabled`) ? 'hidden': '') + `> Disable </menuitem> <menuitem id='text-to-html-btn'> Raw&nbsp;Text&nbsp;Tool </menuitem> <menuitem id='ce-login'> Login </menuitem> <menuitem id='ce-profile'> Profile </menuitem> <menuitem id='ce-favorite-lists'> Favorite&nbsp;Lists </menuitem> </menu> `
}
$t.functions['controls'] = function (get) {
	return `<!DOCTYPE html> <html> <head> </head> <body> <div id='control-ctn'> </div> <script type="text/javascript" src='/src/index/$t.js'></script> <script type="text/javascript" src='/bin/$templates.js'></script> <script type="text/javascript" src='/src/index/state.js'></script> </body> </html> `
}
$t.functions['test'] = function (get) {
	return `<div> <label>` + (get(`firstName`)) + `</label> <input/> <label>` + (get(`lastName`)) + `</label> <input/> <label>` + (get(`happy`)(get(`go`), get(`lucky`)) === get(`frail`)) + `</label> <input/> <label>` + (get(`lastName`)) + `</label> <input/> </div> s `
}
$t.functions['lookup'] = function (get) {
	return `<div> <link rel="stylesheet" href="` + (get(`cssUrl`)) + `"> <div id='` + (get(`MERRIAM_WEB_SUG_CNT_ID`)) + `'></div> <div class='ce-tab-ctn'> <ul class='ce-tab-list'> ` + (new $t('<li  class=\'ce-tab-list-item {{get(`elem.active`) ? \'active\' : \'\'}}\'> <img class="lookup-img" src="{{get(`elem.imageSrc`)}}"> </li>').render(get('scope'), 'elem in list', get)) + ` </ul> ` + (new $t('<div  class=\'ce-lookup-cnt\' id=\'{{get(`elem.cntId`)}}\'></div>').render(get('scope'), 'elem in list', get)) + ` </div> </div> `
}
$t.functions['webster/webster'] = function (get) {
	return `<div class='ce-expl-card'> <a href='https://www.merriam-webster.com/dictionary/hash' target='merriam-webster'> Merriam Webster '` + (get(`key`)) + `' </a> ` + (new $t('<div  class=\'expl\'> <div class=\'ce-expl-card\'> <h3>{{get(`item.hwi.hw`)}}</h3> {{new $t(\'<div  class=\\\'expl\\\'> <div class=\\\'expl\\\'> {{def}} </div> </div>\').render(scope, \'def in item.shortdef\', get)}} </div> </div>').render(get('scope'), 'item in data', get)) + ` </div> `
}
$t.functions['-1523046065'] = function (get) {
	return `<div class='expl'> <div class='expl'> ` + (get(`def`)) + ` </div> </div>`
}
$t.functions['-1722523422'] = function (get) {
	return `<div class='expl'> <div class='ce-expl-card'> <h3>` + (get(`item.hwi.hw`)) + `</h3> ` + (new $t('<div class=\'expl\'> <div class=\'expl\'> {{def}} </div> </div>').render(get('scope'), 'def in item.shortdef', get)) + ` </div> </div>`
}
$t.functions['wikapedia'] = function (get) {
	return `<iframe class='ce-wiki-frame' src="https://en.wikipedia.org/wiki/Second_Silesian_War"></iframe> `
}
$t.functions['share'] = function (get) {
	return `<h2>words</h2> <input type='text' placeholder='space seperated tags i.e. "science biology genetics"' id='ce-tag-input'> <trix-editor class="trix-content" id='ce-expl-input'></trix-editor> <button class='ce-btn'>Post</button> `
}
$t.functions['webster/webster-suggestions'] = function (get) {
	return `` + (new $t('<span >{{suggestion}}</span>').render(get('scope'), 'suggestion', get)) + ` `
}
$t.functions['-2000654215'] = function (get) {
	return `<span >` + (get(`suggestion`)) + `</span>`
}
$t.functions['./html/testExprDef.js'] = function (get) {
	return ``
}
$t.functions['testExprDef'] = function (get) {
	return `<!DOCTYPE html> <html lang="en" dir="ltr"> <head> <meta charset="utf-8"> <title></title> <script type="text/javascript" src='file:///home/jozsef/projects/ContextExplained/src/index/ExprDef.js'></script> <script type="text/javascript" src='file:///home/jozsef/projects/ContextExplained/test/ExprDef.js'></script> </head> <body> </body> </html> `
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

    this.always = function (exprDef) {alwaysPossible.push(exprDef);};
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
      return expressions.concat(alwaysPossible);
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
  while (loopCount < 500 && topOfStack() !== undefined) {
    const tos = topOfStack();
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
  return modified;
}


ExprDef.parse = parse
exports.ExprDef = ExprDef;

afterLoad.forEach((item) => {item();});
}
CE = CE()
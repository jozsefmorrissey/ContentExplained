
function $t(scope, template, itExp, parentScope) {
	function get(name) {
		if (name === 'scope') return scope;
		// htmlCreator = function () {alert('success')}
		// let scope = {htmlCreator};
		const split = name.split('.');
		let currObj = scope;
		for (let index = 0; currObj != undefined && index < split.length; index += 1) {
			currObj = currObj[split[index]];
		}
		// console.log('parentScope:\n\t', parentScope('scope'));
		// console.log('scope:\n\t', scope,);
		// console.log('name:\n\t', name);
		// console.log('template:\n\t', template);
		// console.log('currObj:\n\t', split);
		return currObj || parentScope(name);
	}

	function intToStr(integer) {
    let str = ''
    while(integer > 0) {
        let newChar = integer % 26;
        str += String.fromCharCode(97 + newChar);
        integer -= Math.floor(integer/newChar) + newChar * 7;
    }
    return str;
	}

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

	// eval('`<div>` + (get(\'htmlCreator\')()) + `</div>`');

	function prefixEverything(string) {
	  return string.replace(/([a-zA-Z][a-zA-Z0-9\.]*)(\s|:|\(|\)|,|\}|\{|$)/g, "get(`$1`)$2");
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

	function fixKeywords(string) {
	  return string.replace(/get\(`(new|typeof|true|false)`\)/g, '$1');
	}

	function fixTemplateReference(string) {
	  return string.replace(/\$get\(`t`\)/g, '$t');
	}

	function fixEmptyExpression(string) {
	    return string.replace(/^$/, 'scope');
	}

	function fixUserGetCalls(string) {
		return string.replace(/get\(`get`\)\((`.*?`)\)/, 'get($1)')
	}

	function isolateBlocks() {
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

	function build() {
		const blocks = isolateBlocks();
		let str = template;
	  for (let index = 0; index < blocks.length; index += 1) {
	    const block = blocks[index];
	    let modified = prefixEverything(block);
	    modified = fixObjects(modified);
	    // // modified = fixFunctionParams(modified);
	    modified = fixStrings(modified);
	    modified = fixTemplateReference(modified);
	    modified = fixKeywords(modified);
	    modified = fixEmptyExpression(modified);
			modified = fixUserGetCalls(modified);
	    str = str.replace(`{{${block}}}`, `\` + (${modified}) + \``);
	  }
	  return `\`${str}\``;
	}

	function defaultArray(elemName) {
		let resp = '';
		for (let index = 0; index < scope.length; index += 1) {
			if (elemName) {
				const obj = {};
				obj[elemName] = scope[index];
				resp += $t(obj, template, undefined, get);
			} else {
				resp += $t(scope[index], template, undefined, get);
			}
		}
		return `'${resp}'`;
	}

	function arrayExp() {
		const match = itExp.match($t.arrayItExpReg);
		const varName = match[1];
		const array = get(match[2]);
		let built = '';
		for (let index = 0; index < array.length; index += 1) {
			const obj = {};
			obj[varName] = array[index];
			obj.$index = index;
			built += $t(obj, template, undefined, get);
		}
		return built;
	}

	function itOverObject() {
		const match = itExp.match($t.objItExpReg);
		const keyName = match[1];
		const valueName = match[2];
		const obj = scope[match[3]];
		const keys = Object.keys(obj);
		let built = '';
		for (let index = 0; index < keys.length; index += 1) {
			const key = keys[index];
			const childScope = {};
			childScope[keyName] = {key};
			childScope[valueName] = obj[key];
			childScope.$index = index;
			built += $t(obj, template, undefined, get);
		}
	}

	function rangeExp() {
		const match = itExp.match($t.rangeItExpReg);
		const elemName = match[1];
		// console.log('matches', match[1],match[2], match[3])
		let startIndex = (typeof match[2]) === 'number' ||
					match[2].match(/^[0-9]*$/) ?
					match[2] : eval(`scope['${match[2]}']`);
		let endIndex = (typeof match[3]) === 'number' ||
					match[3].match(/^[0-9]*$/) ?
					match[3] : eval(`scope['${match[3]}']`);
		if (((typeof startIndex) !== 'string' &&
		 				(typeof	startIndex) !== 'number') ||
							(typeof endIndex) !== 'string' &&
							(typeof endIndex) !== 'number') {
								throw Error(`Invalid range '${itExp}' evaluates to '${startIndex}..${endIndex}'`);
		}

		try {
			startIndex = Number.parseInt(startIndex);
		} catch (e) {
			console.log(e)
			throw Error(`Invalid range '${itExp}' evaluates to '${startIndex}..${endIndex}'`);
		}
		try {
			endIndex = Number.parseInt(endIndex);
		} catch (e) {
			console.log(e)
			throw Error(`Invalid range '${itExp}' evaluates to '${startIndex}..${endIndex}'`);
		}
		// console.log(`${startIndex}..${endIndex}`);
		// throw new Error('success');


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
			built += $t(obj, template, undefined, get);
			index += increment;
		}
		return built;
	}

	const repeatReg = /<([a-zA-Z-]*):t( ([^>]* |))repeat=("|')([^>^\4]*?)\4([^>]*>((?!(<\1:t[^>]*>|<\/\1:t>)).)*<\/)\1:t>/;
	const repeatReplace = '{{$t(scope, `<div$3$7div>`, `$6`)}}';
	function formatRepeat(callback) {
		let string = template.replace(/\s{2,}/g, ' ');
	  // tagname:1 prefix:2 quote:4 exlpression:5 suffix:6
	  while (match = string.match(repeatReg)) {
	    let template = `<${match[1]}${match[2] + match[6]}${match[1]}>`.replace(/\\'/g, '\\\\\\\'').replace(/([^\\])'/g, '$1\\\'').replace(/''/g, '\'\\\'');
	    string = string.replace(match[0], `{{$t(scope, '${template}', '${match[5]}')}}`);
	  }
	  return string;
	}

	function type() {
		if ((typeof itExp) === 'string' && itExp.match($t.rangeAttemptExpReg)) {
			if (itExp.match($t.rangeItExpReg)) {
				return 'rangeExp'
			}
			valid = false;
			return 'rangeExpFormatError';
		} else if (Array.isArray(scope)) {
			if (itExp === undefined) {
				return 'defaultArray';
			} else if (itExp.match($t.nameScopeExpReg)) {
				return 'nameArrayExp';
			} else {
				valid = false;
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
				valid = false;
				return 'invalidObject';
			}
		} else {
			return 'defaultObject';
		}
	}

	function compile() {
		let built = '';
		switch (type()) {
			case 'rangeExp':
				compiled = $t.quoteStr(rangeExp());
				break;
			case 'rangeExpFormatError':
				throw new Error(`Invalid range itteration expression "${itExp}"`);
			case 'defaultArray':
				compiled = defaultArray();
				break;
			case 'nameArrayExp':
				compiled = defaultArray(itExp);
				break;
			case 'arrayExp':
				compiled = $t.quoteStr(arrayExp(build));
				break;
			case 'invalidArray':
				throw new Error(`Invalid iterative expression for an array "${itExp}"`);
			case 'defaultObject':
				compiled = build();
				break;
			case 'itOverObject':
				compiled = itOverObject();
				break;
			case 'invalidObject':
				throw new Error(`Invalid iterative expression for an object "${itExp}"`);
			default:
				throw new Error(`Programming error defined type '${type()}' not implmented in switch`);
		}
		return compiled;
	}

	let valid = true;
	let varPrefix = '';
	let compiled = '';
	parentScope = parentScope || function () {return undefined};
	if ($t.functions[template]) {
		return $t.functions[template](get);
	}

	const hash = scope === undefined && itExp !== undefined
	 				? $t.formatName(itExp) : intToStr(stringHash(template));
	template = $t.templates[template] || template;
	$t.templates[hash] = template;


	template = formatRepeat(template);
	console.log(template);
	compile();

	if (scope === undefined) {
		return { type, compile, isolateBlocks, build, compiled };
	} else {
		return eval(compiled);
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
			templateFunctions += `\n$t.functions['${tempName}'] = function (get) {\n\treturn ${$t(undefined, template).compile()}\n}`;
		}
	}
	// console.log($t.templates);
	return templateFunctions;
}

try{
	exports.$t = $t;
} catch (e) {}

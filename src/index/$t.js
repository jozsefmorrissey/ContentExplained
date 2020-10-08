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

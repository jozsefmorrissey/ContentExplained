const testing = require('testing');
const ExprDef = require('../src/index/ExprDef').ExprDef;

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
const multiplierProps = {opening: /(===|([-+=*\/](=|)))/};
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

function testRoutes(exprDef, expectedRoutes) {
  return function(callback) {
    const exprRoutes = exprDef.allRoutes();
    for (let index = 0; index < expectedRoutes.length; index += 1) {
      const expectedRoute = expectedRoutes[index];
      const exprRouteIndex = exprRoutes.indexOf(expectedRoute);
      if (exprRouteIndex === -1) {
        throw new Error(`Cannot find  expected route '${expectedRoute}'`);
      } else {
        exprRoutes.splice(exprRouteIndex, 1);
      }
    }
    if (exprRoutes.length > 0) {
      const excessRoutes = JSON.stringify(exprRoutes, null, 2);
      testing.fail(`Routes that were not expected: \n${excessRoutes}`, callback);
    } else {
      testing.success(`${exprDef.getName()} route test was successfull`, callback);
    }
  }
}

const testExprRoutes = testRoutes(expression, [
  'string.multiplier.repeat',
  'number.multiplier.repeat',
  'func.multiplier.repeat',
  'variable.multiplier.repeat',
  'array.multiplier.repeat',
  'group.multiplier.repeat',
  'string.sign.repeat',
  'number.sign.repeat',
  'func.sign.repeat',
  'variable.sign.repeat',
  'array.sign.repeat',
  'group.sign.repeat',
  'sign.expression.multiplier.repeat',
  'sign.expression.sign.repeat',
  "string.ternary.expression.colon.expression.end",
  "number.ternary.expression.colon.expression.end",
  "func.ternary.expression.colon.expression.end",
  "array.ternary.expression.colon.expression.end",
  "variable.ternary.expression.colon.expression.end",
  "group.ternary.expression.colon.expression.end",
  "string.relational.repeat",
  "number.relational.repeat",
  "func.relational.repeat",
  "array.relational.repeat",
  "variable.relational.repeat",
  "group.relational.repeat",
  "sign.expression.relational.repeat",
  'object.end',
  'string.end',
  'number.end',
  'func.end',
  'variable.end',
  'array.end',
  'group.end',
  'sign.number.end'
]);

const testObjectRoutes = testRoutes(object, [
  'objectShorthand.comma.repeat',
  'objectLabel.expression.comma.repeat',
  'objectShorthand.end',
  'objectLabel.expression.end'
]);
const testGroupRoutes = testRoutes(group, [
  'expression.end'
]);
const testArrayRoutes = testRoutes(array, [
  'expression.comma.repeat',
  'expression.end'
]);
const testFuncRoutes = testRoutes(func, [
  'expression.comma.repeat',
  'expression.end'
]);

const expressions = [
  '`` + "" + \'\' + `hello` + ` ` + \'world\\\'s\' + \'\\\'\' + "\'"',
  '`` + "" + \'\' + `hello` + ` ` + \'world\\\'s\' + \'\\\'\' + "\'"',
  'func()',
  'get("func")()',
  'func(a, "string", -3)',
  'get("func")(get("a"), "string", -3)',
  'array[23]',
  'get("array")[23]',
  'array[a, "string", -43, !true]',
  'get("array")[get("a"), "string", -43, !true]',
  '{one: "one", two: {three, four: +4, five: {six: ``}}}',
  '{one: "one", two: {three: get("three"), four: +4, five: {six: ``}}}',
  '(ter ? nar : !ey)',
  '(get("ter") ? get("nar") : !get("ey"))',
  '$index === openTab',
  'get(\"$index\") === get(\"openTab\")',
  "$index === openTab ? '' : 'hidden'",
  "get(\"$index\") === get(\"openTab\") ? '' : 'hidden'",
  "child.children.length > 0 ? '' : 'hidden'",
  "get(\"child.children.length\") > 0 ? '' : 'hidden'",
  '(((((alpha + beta) - func(party, on, wayne) / arr[45 + func(sauce)] * newFUnc({shorthand, label: "value"})))))',
  '(((((get("alpha") + get("beta")) - get("func")(get("party"), get("on"), get("wayne")) / get("arr")[45 + get("func")(get("sauce"))] * get("newFUnc")({shorthand: get("shorthand"), label: "value"})))))'
]

function testExpressions(callback) {
  for (let index = 0; index < expressions.length; index += 2) {
    const parced = ExprDef.parse(expression, expressions[index]);
    if (parced !== expressions[index + 1]) {
      let msg = 'Modified expression does not match expected:\n';
      msg += `\toriginal: ${expressions[index]}\n`;
      msg += `\texpected: ${expressions[index + 1]}\n`;
      msg += `\tmodified: ${parced}\n`;
      testing.fail(msg, callback);
    }
    // console.log(parced === expressions[index + 1]);

  }
  testing.success(callback);
}

testing.run([testExprRoutes, testObjectRoutes, testGroupRoutes, testArrayRoutes,
  testFuncRoutes, testExpressions]);

const testing = require('testing');
const $t = require('../src/$t.js').$t;

const Formatter = {
  html: function () {return '^'},
  css: function (one, three, four, five, tr, fal, one24) {return `${one}${tr}${one24.two}`},

}

const testData = [{
  scope: {htmlCreator: function() {return 'hello';}},
  template: '<div>{{htmlCreator()}}</div>',
  exp: 'index in 0..1',
  built: '`<div>` + (get(`htmlCreator`)()) + `</div>`',
  compiled: '<div>hello</div>',
  type: 'rangeExp',
  numberOfBlocks: 1,
  typeError: 'IntegerRangeExpression'
},{
  scope: {start: 4, end: 15},
  template: '{{jindex}}',
  built: '`` + (get(`jindex`)) + ``',
  compiled: '4567891011121314',
  exp: 'jindex in start..end',
  type: 'rangeExp',
  numberOfBlocks: 1,
  typeError: 'variableRangeExpression'
},{
  scope: {start: '0', end:  '-12', Formatter},
  template: '<div>{{Formatter.html()}}</div>',
  built: '`<div>` + (get(`Formatter.html`)()) + `</div>`',
  compiled: '<div>^</div><div>^</div><div>^</div><div>^</div><div>^</div><div>^</div><div>^</div><div>^</div><div>^</div><div>^</div><div>^</div><div>^</div>',
  numberOfBlocks: 1,
  exp: 'index in start..end',
  type: 'rangeExp',
  typeError: 'stringRangeExpression'
},{
  scope: {end: 15, Formatter},
  template: '<div>{{Formatter.css(1, 3, 4, 5, true, false, {one: 3, two: 5, four: 20})}}</div>',
  built: '`<div>` + (get(`Formatter.css`)(1, 3, 4, 5, true, false, {one: 3, two: 5, four: 20})) + `</div>`',
  compiled: '<div>1true5</div><div>1true5</div>',
  numberOfBlocks: 1,
  exp: 'index in 13..end',
  type: 'rangeExp',
  typeError: 'mixedRangeExpression'
},{
  scope: {start: 4, end: 15},
  template: '<div>{{new Formatter.htmlFormatter(\'Sally took the dog walking\', "and It was a lot of obj.fun", \'turtle shell island\')}}</div>',
  built: '`<div>` + (new get(`Formatter.htmlFormatter`)(\'Sally took the dog walking\', "and It was a lot of obj.fun", \'turtle shell island\')) + `</div>`',
  throwsError: true,
  numberOfBlocks: 1,
  exp: 'index in 0..43-',
  type: 'rangeExpFormatError',
  typeError: 'invalidRangeExpression'
},{
  scope: [],
  template: '<ul>{{$t({egg, shell, funct}, \'<li>{{egg}}, {{shell}}, {{(typeof funct) === "function"}}\')}}',
  built: '`<ul>` + ($t({egg: get(`egg`), shell: get(`shell`), funct: get(`funct`)}, \'<li>{{egg}}, {{shell}}, {{(typeof funct) === "function"}}\')) + ``',
  numberOfBlocks: 1,
  throwsError: true,
  exp: 'index in start..10',
  type: 'rangeExp',
  typeError: 'undefindVariable'
},{
  scope: ['j', 'o', 'e', 'y'],
  template: '<p>{{}}</p>',
  built: '`<p>` + (scope) + `</p>`',
  compiled: '<p>j</p><p>o</p><p>e</p><p>y</p>',
  numberOfBlocks: 1,
  type: 'defaultArray',
  typeError: 'defaultArray'
},{
  scope: [5,7,3,6],
  template: '<div>{{elem}}</div>',
  built: '`<div>` + (get(`elem`)) + `</div>`',
  compiled: '<div>5</div><div>7</div><div>3</div><div>6</div>',
  numberOfBlocks: 1,
  exp: 'elem',
  type: 'nameArrayExp',
  typeError: 'nameArrayExp'
},{
  scope: [],
  template: '<div>Hello</div>',
  built: '`<div>Hello</div>`',
  numberOfBlocks: 0,
  throwsError: true,
  exp: ' 0arr in array ',
  type: 'invalidArray',
  typeError: 'varStartsWithNumber'
},{
  scope: {Formatter},
  template: '<div>{{Formatter.html(hello, obj.world, {party, on, dust: settles}, skittles, pizza)}}</div>',
  built: '`<div>` + (get(`Formatter.html`)(get(`hello`), get(`obj.world`), {party: get(`party`), on: get(`on`), dust: get(`settles`)}, get(`skittles`), get(`pizza`))) + `</div>`',
  compiled: '<div>^</div>',
  numberOfBlocks: 1,
  type: 'defaultObject',
  typeError: 'defaultObjectObject'
},{
  scope: {object: {key1: 'value1', key2: 'value2', key3: 'value3'}},
  template: '<div>{{(this || that) && somthingElse}}</div>',
  built: '`<div>` + ((get(`this`) || get(`that`)) && get(`somthingElse`)) + `</div>`',
  numberOfBlocks: 1,
  exp: 'key, value in object',
  type: 'itOverObject',
  typeError: 'iterateOverObject'
},{
  scope: {},
  template: '<div>{{}}<p>{{alpha + \'do you get(`want`) get(`to`) get(`popsicle`) a popsicle\'}}</p></div>',
  built: '`<div>` + (scope) + `<p>` + (get(`alpha`) + \'do you get(`want`) get(`to`) get(`popsicle`) a popsicle\') + `</p></div>`',
  numberOfBlocks: 2,
  throwsError: true,
  exp: 'key,: value in object',
  type: 'invalidObject',
  typeError: 'invalidObject'
}];

const repeatTemplate = `<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>{{title}}</title>
  </head>
  <body>
    <!-- object -->
    <div:t repeat='person in people'>
      Name: {{person.firstName}} {{person.lastName}}
      <!-- array -->
      <div:t class='red' repeat='child in person.children'>
        <br><br>
        Child: {{child.firstName}} {{person.lastName}}
        <br><br>
        <div {{child.children.length > 0 ? '' : 'hidden'}}>
          Grand Children From {{child.firstName}}:
        </div>
        <div:t repeat='child in child.children'>{{child.firstName}} {{child.lastName}}</div:t>
      </div:t>
      <div:t repeat='i in 20..15'>'{{i}}'</div:t>
      <br><br><br><br>
    </div:t>
    <div:t repeat='greeting in greetings'>{{greeting}}</div:t>
  </body>
</html>`;

function mainTest(callback) {
  for (let index = 0; index < testData.length; index += 1) {
    console.log(`Running case ${index + 1}`);
    const tdElem = testData[index];
    const template = $t(undefined, tdElem.template, tdElem.exp);
    const type = template.type();
    testing.assertEquals(type, tdElem.type, callback);
    const blocks = template.isolateBlocks();
    testing.assertEquals(blocks.length, tdElem.numberOfBlocks, callback);
    const built = template.build();
    testing.assertEquals(built, tdElem.built, callback);
    try {
      const compiled = $t(tdElem.scope, tdElem.template, tdElem.exp);
      testing.assertEquals(compiled, tdElem.compiled, callback);
      if (tdElem.throwsError) {
        testing.fail(`Error not detected`, callback);
      }
    } catch (e) {
      if (e.message !== 'success' && !tdElem.throwsError) {
        testing.fail('unexpected error was thrown\n' + e, callback);
        console.log(e);
      }
    }
    testing.success(`Case ${index + 1} successfull`);
  }
  testing.success(callback);
}

const repeatReg = /<(\$t)( ([^>]* |))repeat=("|')([^>^\4]*?)\4([^>]*>((?!(<\1[^>]*>|<\/\1>)).)*<\/)\1>/;
const repeatReplace = '{{$t(scope, `<div$2$6div>`, `$5`)}}';
let string = repeatTemplate.replace(/\s{2,}/g, ' ');
function parseTest(callback) {
  // prefix:2 exlpression:5 suffix:6
  while (match = string.match(repeatReg)) {
    let template = `<div${match[2] + match[6]}div>`.replace(/\\'/g, '\\\\\\\'').replace(/([^\\])'/g, '$1\\\'');
    string = string.replace(match[0], `{{$t(scope, '${template}', '${match[5]}')}}`);
  }
  console.log(string);
}

// testing.run([mainTest]);
// testing.run([parseTest]);

class Person {
  constructor(firstName, lastName, children) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.children = children || [];
  }
}
const julia = new Person('julia', 'smith', []);
const justin = new Person('justin', 'smith', []);
const jake = new Person('jake', 'smith', [julia]);

const people = [
  new Person('jhon', 'smith', [jake, justin]),
  new Person('judy', 'smith', [jake, justin]),
  julia, justin, jake
]

const greetings = ['hello', 'hola'];

console.log("final\n\n\n",$t({people, title: 'The Smiths', greetings}, repeatTemplate))
// console.log("final\n\n\n",$t(undefined, repeatTemplate))
// console.log($t.templates);

// console.log("final\n\n\n",$t({greeting: 'Hello World!'}, 'helloWorld'))

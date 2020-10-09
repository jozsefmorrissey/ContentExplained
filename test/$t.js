const testing = require('testing');
const $t = require('../bin/builder.js').$t;

const Formatter = {
  html: function () {return '^'},
  css: function (one, three, four, five, tr, fal, one24) {return `${one}${tr}${one24.two}`},

}

const testData = [{
  scope: {htmlCreator: function() {return 'hello';}},
  template: '<div>{{htmlCreator()}}</div>',
  exp: 'index in 0..1',
  built: '`<div>` + (get("htmlCreator")()) + `</div>`',
  compiled: '<div>hello</div>',
  type: 'rangeExp',
  numberOfBlocks: 1,
  typeError: 'IntegerRangeExpression'
},{
  scope: {start: 4, end: 15},
  template: '{{jindex}}',
  built: '`` + (get("jindex")) + ``',
  compiled: '4567891011121314',
  exp: 'jindex in start..end',
  type: 'rangeExp',
  numberOfBlocks: 1,
  typeError: 'variableRangeExpression'
},{
  scope: {start: '0', end:  '-12', Formatter},
  template: '<div>{{Formatter.html()}}</div>',
  built: '`<div>` + (get("Formatter.html")()) + `</div>`',
  compiled: '<div>^</div><div>^</div><div>^</div><div>^</div><div>^</div><div>^</div><div>^</div><div>^</div><div>^</div><div>^</div><div>^</div><div>^</div>',
  numberOfBlocks: 1,
  exp: 'index in start..end',
  type: 'rangeExp',
  typeError: 'stringRangeExpression'
},{
  scope: {end: 15, Formatter},
  template: '<div>{{Formatter.css(1, 3, 4, 5, true, false, {one: 3, two: 5, four: 20})}}</div>',
  built: '`<div>` + (get("Formatter.css")(1, 3, 4, 5, true, false, {one: 3, two: 5, four: 20})) + `</div>`',
  compiled: '<div>1true5</div><div>1true5</div>',
  numberOfBlocks: 1,
  exp: 'index in 13..end',
  type: 'rangeExp',
  typeError: 'mixedRangeExpression'
},{
  scope: {start: 4, end: 15},
  template: '<div>{{new Formatter.htmlFormatter(\'Sally took the dog walking\', "and It was a lot of obj.fun", \'turtle shell island\')}}</div>',
  built: '`<div>` + (new get("Formatter.htmlFormatter")(\'Sally took the dog walking\', "and It was a lot of obj.fun", \'turtle shell island\')) + `</div>`',
  throwsError: true,
  numberOfBlocks: 1,
  exp: 'index in 0..43-',
  type: 'rangeExpFormatError',
  typeError: 'invalidRangeExpression'
// },{
//   scope: [],
//   template: '<ul>{{new $t({egg, shell, funct}, \'<li>{{egg}}, {{shell}}, {{(typeof funct) === "function"}}\')}}',
//   built: '`<ul>` + ($t({egg: get("egg"), shell: get("shell"), funct: get("funct")}, \'<li>{{egg}}, {{shell}}, {{(typeof funct) === "function"}}\')) + ``',
//   numberOfBlocks: 1,
//   throwsError: true,
//   exp: 'index in start..10',
//   type: 'rangeExp',
//   typeError: 'undefindVariable'
},{
  scope: ['j', 'o', 'e', 'y'],
  template: '<p>{{}}</p>',
  built: '`<p>` + (get(\'scope\')) + `</p>`',
  compiled: '<p>j</p><p>o</p><p>e</p><p>y</p>',
  numberOfBlocks: 1,
  type: 'defaultArray',
  typeError: 'defaultArray'
},{
  scope: [5,7,3,6],
  template: '<div>{{elem}}</div>',
  built: '`<div>` + (get("elem")) + `</div>`',
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
  built: '`<div>` + (get("Formatter.html")(get("hello"), get("obj.world"), {party: get("party"), on: get("on"), dust: get("settles")}, get("skittles"), get("pizza"))) + `</div>`',
  compiled: '<div>^</div>',
  numberOfBlocks: 1,
  type: 'defaultObject',
  typeError: 'defaultObjectObject'
},{
  scope: {object: {key1: 'value1', key2: 'value2', key3: 'value3'}},
  template: '<div>{{(this || that) && somthingElse}}</div>',
  built: '`<div>` + ((get("this") || get("that")) && get("somthingElse")) + `</div>`',
  numberOfBlocks: 1,
  exp: 'key, value in object',
  type: 'itOverObject',
  typeError: 'iterateOverObject'
},{
  scope: {},
  template: '<div>{{}}<p>{{alpha + \'do you get("want") get("to") get("popsicle") a popsicle\'}}</p></div>',
  built: '`<div>` + (get(\'scope\')) + `<p>` + (get("alpha") + \'do you get("want") get("to") get("popsicle") a popsicle\') + `</p></div>`',
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

function typeTest(callback) {
  for (let index = 0; index < testData.length; index += 1) {
    console.log(`Running type case ${index + 1}`);
    const tdElem = testData[index];
    const template = new $t(tdElem.template);//.compiled(undefined, tdElem.exp);
    const type = template.type(tdElem.scope, tdElem.exp);
    testing.assertEquals(type, tdElem.type, callback);
    testing.success(`Type case ${index + 1} successfull`);
  }
  testing.success(callback);
}


function isolateBlocksTest(callback) {
  for (let index = 0; index < testData.length; index += 1) {
    console.log(`Running isolate block case ${index + 1}`);
    const tdElem = testData[index];
    const template = new $t(tdElem.template);//.compiled(undefined, tdElem.exp);

    const blocks = template.isolateBlocks(tdElem.template);
    testing.assertEquals(blocks.length, tdElem.numberOfBlocks, callback);

    testing.success(`Isolate block case ${index + 1} successfull`);
  }
  testing.success(callback);
}

function compileTest(callback) {
  for (let index = 0; index < testData.length; index += 1) {
    console.log(`Running compile case ${index + 1}`);
    const tdElem = testData[index];
    const template = new $t(tdElem.template);//.compiled(undefined, tdElem.exp);

    const built = template.compiled();
    testing.assertEquals(built, tdElem.built, callback);

    testing.success(`Compile case ${index + 1} successfull`);
  }
  testing.success(callback);
}

function renderTest(callback) {
  for (let index = 0; index < testData.length; index += 1) {
    console.log(`Running render case ${index + 1}`);
    const tdElem = testData[index];
    const template = new $t(tdElem.template);//.compiled(undefined, tdElem.exp);
    try {
      const compiled = new $t(tdElem.template).render(tdElem.scope, tdElem.exp);
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
    testing.success(`Render case ${index + 1} successfull`);
  }
  testing.success(callback);
}

function peopleTest(callback) {
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

  const html = new $t(repeatTemplate).render({people, title: 'The Smiths', greetings});
  const answer = `<!DOCTYPE html> <html lang="en" dir="ltr"> <head> <meta charset="utf-8"> <title>The Smiths</title> </head> <body> <!-- object --> <div > Name: jhon smith <!-- array --> <div class='red' > <br><br> Child: jake smith <br><br> <div > Grand Children From jake: </div> <div >julia smith</div> </div><div class='red' > <br><br> Child: justin smith <br><br> <div hidden> Grand Children From justin: </div>  </div> <div >'20'</div><div >'19'</div><div >'18'</div><div >'17'</div><div >'16'</div> <br><br><br><br> </div><div > Name: judy smith <!-- array --> <div class='red' > <br><br> Child: jake smith <br><br> <div > Grand Children From jake: </div> <div >julia smith</div> </div><div class='red' > <br><br> Child: justin smith <br><br> <div hidden> Grand Children From justin: </div>  </div> <div >'20'</div><div >'19'</div><div >'18'</div><div >'17'</div><div >'16'</div> <br><br><br><br> </div><div > Name: julia smith <!-- array -->  <div >'20'</div><div >'19'</div><div >'18'</div><div >'17'</div><div >'16'</div> <br><br><br><br> </div><div > Name: justin smith <!-- array -->  <div >'20'</div><div >'19'</div><div >'18'</div><div >'17'</div><div >'16'</div> <br><br><br><br> </div><div > Name: jake smith <!-- array --> <div class='red' > <br><br> Child: julia smith <br><br> <div hidden> Grand Children From julia: </div>  </div> <div >'20'</div><div >'19'</div><div >'18'</div><div >'17'</div><div >'16'</div> <br><br><br><br> </div> <div >hello</div><div >hola</div> </body> </html>`;
  testing.assertEquals(html, answer);
  testing.success(callback);
}

testing.run([typeTest, isolateBlocksTest, compileTest, renderTest, peopleTest]);


$t.functions['explanation'] = function (get) {
	return `<div class='ce-expl-card'> <button class='ce-btn ce-add-btn'>+</button> <div class='key-auth'> <span class='key'>Key</span> <span class='auth'>(author)</span> </div> <div class='expl'> explinations </div> <div class='tags'> <span>tag1</span> <span>tag2</span> <span>tag3</span> </div>
</div>
`
}
$t.functions['popUp'] = function (get) {
	return `<div> <div>` + (get(`body`)) + `</div> <button ` + (get(`hidden`) ? 'hidden' : '') + `>See More</button>
</div>
`
}
$t.functions['menu'] = function (get) {
	return `
<menu> <link rel="stylesheet" href="file:///home/jozsef/projects/ContextExplained/css/menu.css"> <link rel="stylesheet" href="/css/menu.css"> <menuitem id='enable-btn' ` + (get(`enabled`) ? 'hidden': '') + `> Enable </menuitem> <menuitem id='disable-btn' ` + (!get(`enabled`) ? 'hidden': '') + `> Disable </menuitem> <menuitem id='text-to-html-btn'> Raw&nbsp;Text&nbsp;Tool </menuitem> <menuitem id='dummy-btn'> dummy </menuitem>
</menu>
`
}
$t.functions['textToHtml'] = function (get) {
	return `<!DOCTYPE html>
<html lang="en" dir="ltr"> <head> <link rel="stylesheet" href="/css/text-to-html.css"> <meta charset="utf-8"> <title>Text2Html</title> </head> <body> <p> This page is created from HTTP status code information found at ietf.org and Wikipedia. Click on the category heading or the status code link to read more. </p> </body> <script type="text/javascript" src='/src/short-cut-container.js'></script> <script type="text/javascript" src='/src/textToHtml.js'></script>
</html>
`
}
$t.functions['controls'] = function (get) {
	return `<!DOCTYPE html>
<html>
<head>
</head>
<body> <div id='control-ctn'> </div> <script type="text/javascript" src='/src/$t.js'></script> <script type="text/javascript" src='/bin/$templates.js'></script> <script type="text/javascript" src='/src/state.js'></script>
</body>
</html>
`
}
$t.functions['test'] = function (get) {
	return `<div> <label>` + (get(`firstName`)) + `</label> <input/> <label>` + (get(`lastName`)) + `</label> <input/> <label>` + (get(`happy`)(get(`go`), get(`lucky`)) === get(`frail`)) + `</label> <input/> <label>` + (get(`lastName`)) + `</label> <input/>
</div>
`
}
$t.functions['lookup'] = function (get) {
	return `<div class='ce-tab-ctn'> <ul class='ce-tab-list'> ` + ($t(get(`scope`), '<li  class=\'ce-tab-list-item {{get(`elem.active`) ? \'active\' : \'\'}}\'> {{get(`elem.title`)}} </li>', 'elem in list')) + ` </ul> ` + ($t(get(`scope`), '<div > {{get(`elem.content`)}} </div>', 'elem in list')) + `
</div>
`
}
$t.functions['websterWebsterSuggestions'] = function (get) {
	return `` + ($t(get(`scope`), '<span >{{suggestion}}</span>', 'suggestion')) + `
`
}
$t.functions['websterWebster'] = function (get) {
	return `<div class='ce-expl-card'> <a href='https://www.merriam-webster.com/dictionary/hash' target='merriam-webster'> Merriam Webster '` + (get(`key`)) + `' </a> ` + ($t(get(`scope`), '<div  class=\'expl\'> <div class=\'ce-expl-card\'> <h3>{{get(`item.hwi.hw`)}}</h3> {{$t(scope, \'<div  class=\\\'expl\\\'> <div class=\\\'expl\\\'> {{def}} </div> </div>\', \'def in item.shortdef\')}} </div> </div>', 'item in data')) + `
</div>
`
}
$t.functions['wikapedia'] = function (get) {
	return `<iframe class='ce-wiki-frame' src="https://en.wikipedia.org/wiki/Second_Silesian_War"></iframe>
`
}
$t.functions['share'] = function (get) {
	return `<h2>words</h2>
<input type='text' placeholder='space seperated tags i.e. "science biology genetics"' id='ce-tag-input'>
<trix-editor class="trix-content" id='ce-expl-input'></trix-editor>
<button class='ce-btn'>Post</button>
`
}
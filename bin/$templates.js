
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
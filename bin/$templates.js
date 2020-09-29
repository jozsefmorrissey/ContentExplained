
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
$t.functions['menu'] = function (get) {
	return `
<menu> <link rel="stylesheet" href="file:///home/jozsef/projects/ContextExplained/css/menu.css"> <link rel="stylesheet" href="/css/menu.css"> <menuitem id='enable-btn' ` + (get(`enabled`) ? 'hidden': '') + `> Enable </menuitem> <menuitem id='disable-btn' ` + (!get(`enabled`) ? 'hidden': '') + `> Disable </menuitem> <menuitem id='text-to-html-btn'> Raw&nbsp;Text&nbsp;Tool </menuitem> <menuitem id='ce-login'> Login </menuitem> <menuitem id='ce-profile'> Profile </menuitem> <menuitem id='ce-favorite-lists'> Favorite&nbsp;Lists </menuitem>
</menu>
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
$t.functions['popUp'] = function (get) {
	return `<div> <div id='` + (get(`MERRIAM_WEB_SUG_CNT_ID`)) + `'></div> <div class='ce-tab-ctn'> <ul class='ce-tab-list'> ` + ($t(get(`scope`), '<li  class=\'ce-tab-list-item {{get(`elem.active`) ? \'active\' : \'\'}}\'> <img class="lookup-img" src="{{get(`elem.imageSrc`)}}"> </li>', 'elem in list')) + ` </ul> ` + ($t(get(`scope`), '<div  class=\'ce-lookup-cnt\' id=\'{{get(`elem.cntId`)}}\'></div>', 'elem in list')) + ` </div>
</div>
`
}
$t.functions['wikapedia'] = function (get) {
	return `<iframe class='ce-wiki-frame' src="https://en.wikipedia.org/wiki/Second_Silesian_War"></iframe>
`
}
$t.functions['test'] = function (get) {
	return `<div> <label>` + (get(`firstName`)) + `</label> <input/> <label>` + (get(`lastName`)) + `</label> <input/> <label>` + (get(`happy`)(get(`go`), get(`lucky`)) === get(`frail`)) + `</label> <input/> <label>` + (get(`lastName`)) + `</label> <input/>
</div>
`
}
$t.functions['explanation'] = function (get) {
	return `<div> ` + ($t(get(`scope`), '<span > <label>{{tag}}</label> <input type=\'checkbox\' value=\'{{tag}}\'> </span>', 'tag in allTags')) + ` <div class='key-auth'> <span class='key'>` + (get(`words`)) + `</span> <button class='ce-btn ce-add-btn'>+</button> </div> ` + ($t(get(`scope`), '<div class=\'ce-expl-card\' > <span class=\'ce-expl-rating-column\'> <div class=\'like-ctn\'> <button class=\'ce-like-btn\'>Like {{get(`explanation.likes`)}}</button> </div> <div class=\'like-ctn\'> <button class=\'ce-like-btn\'>Dislike {{get(`explanation.dislikes`)}}</button> </div> </span> <span class=\'ce-expl\'> {{get(`explanation.explanation`)}} </span> <span class=\'ce-expl-author-cnt\'>{{get(`explanation.author`)}}</span> </div>', 'explanation in explanations')) + `
</div>
`
}
$t.functions['lookup'] = function (get) {
	return `<div> <div id='` + (get(`MERRIAM_WEB_SUG_CNT_ID`)) + `'></div> <div class='ce-tab-ctn'> <ul class='ce-tab-list'> ` + ($t(get(`scope`), '<li  class=\'ce-tab-list-item {{get(`elem.active`) ? \'active\' : \'\'}}\'> <img class="lookup-img" src="{{get(`elem.imageSrc`)}}"> </li>', 'elem in list')) + ` </ul> ` + ($t(get(`scope`), '<div  class=\'ce-lookup-cnt\' id=\'{{get(`elem.cntId`)}}\'></div>', 'elem in list')) + ` </div>
</div>
`
}
$t.functions['share'] = function (get) {
	return `<h2>words</h2>
<input type='text' placeholder='space seperated tags i.e. "science biology genetics"' id='ce-tag-input'>
<trix-editor class="trix-content" id='ce-expl-input'></trix-editor>
<button class='ce-btn'>Post</button>
`
}
$t.functions['textToHtml'] = function (get) {
	return `<!DOCTYPE html>
<html lang="en" dir="ltr"> <head> <link rel="stylesheet" href="/css/text-to-html.css"> <meta charset="utf-8"> <title>Text2Html</title> </head> <body> <p> This page is created from HTTP status code information found at ietf.org and Wikipedia. Click on the category heading or the status code link to read more. </p> </body> <script type="text/javascript" src='/src/short-cut-container.js'></script> <script type="text/javascript" src='/src/textToHtml.js'></script>
</html>
`
}
$t.functions['dzqutghcnrueb'] = function (get) {
	return `` + ($t(get(`scope`), '<span >{{suggestion}}</span>', 'suggestion in suggestions')) + `
`
}
$t.functions['einfqdqlja'] = function (get) {
	return `<div> <label>` + (get(`firstName`)) + `</label> <input/> <label>` + (get(`lastName`)) + `</label> <input/> <label>` + (get(`happy`)(get(`go`), get(`lucky`)) === get(`frail`)) + `</label> <input/> <label>` + (get(`lastName`)) + `</label> <input/>
</div>
`
}
$t.functions['hruppmmkmikzkrsuuruunvgcnfb'] = function (get) {
	return `<div> <div id='` + (get(`MERRIAM_WEB_SUG_CNT_ID`)) + `'></div> <div class='ce-tab-ctn'> <ul class='ce-tab-list'> ` + ($t(get(`scope`), '<li  class=\'ce-tab-list-item {{get(`elem.active`) ? \'active\' : \'\'}}\'> <img class="lookup-img" src="{{get(`elem.imageSrc`)}}"> </li>', 'elem in list')) + ` </ul> ` + ($t(get(`scope`), '<div  id=\'{{get(`elem.cntId`)}}\'></div>', 'elem in list')) + ` </div>
</div>
`
}
$t.functions['eoxmmqmikca'] = function (get) {
	return `<h2>words</h2>
<input type='text' placeholder='space seperated tags i.e. "science biology genetics"' id='ce-tag-input'>
<trix-editor class="trix-content" id='ce-expl-input'></trix-editor>
<button class='ce-btn'>Post</button>
`
}
$t.functions['ovhguhrflvkrmmfvb'] = function (get) {
	return `<!DOCTYPE html>
<html lang="en" dir="ltr"> <head> <link rel="stylesheet" href="/css/text-to-html.css"> <meta charset="utf-8"> <title>Text2Html</title> </head> <body> <p> This page is created from HTTP status code information found at ietf.org and Wikipedia. Click on the category heading or the status code link to read more. </p> </body> <script type="text/javascript" src='/src/short-cut-container.js'></script> <script type="text/javascript" src='/src/textToHtml.js'></script>
</html>
`
}
$t.functions['turb'] = function (get) {
	return `` + ($t(get(`scope`), '<span >{{suggestion}}</span>', 'suggestion')) + `
`
}
$t.functions['pyqdqb'] = function (get) {
	return `<div class='ce-expl-card'> ` + ($t(get(`scope`), '<span > <label>{{tag}}</label> <input type=\'checkbox\' value=\'{{tag}}\'> </span>', 'tag in allTags')) + ` <div class='key-auth'> <span class='key'>` + (get(`words`)) + `</span> </div> <div:t repeat='explanation in explanations'> <button class='ce-btn ce-add-btn'>+</button> <span> <div class='like-ctn'>` + (get(`likes`)) + `</div> <div class='like-ctn'>` + (get(`disLikes`)) + `</div> </span> <span class='expl'> ` + (get(`explination`)) + ` </span> <span>` + (get(`author`)) + `</span> </div>
</div>
`
}
$t.functions['lxyhndzjprjvb'] = function (get) {
	return `<div class='ce-expl-card'> ` + ($t(get(`scope`), '<span > <label>{{tag}}</label> <input type=\'checkbox\' value=\'{{tag}}\'> </span>', 'tag in allTags')) + ` <div class='key-auth'> <span class='key'>` + (get(`words`)) + `</span> </div> ` + ($t(get(`scope`), '<div > <button class=\'ce-btn ce-add-btn\'>+</button> <span> <div class=\'like-ctn\'>{{likes}}</div> <div class=\'like-ctn\'>{{disLikes}}</div> </span> <span class=\'expl\'> {{explination}} </span> <span>{{author}}</span> </div>', 'explanation in explanations')) + `
</div>
`
}
$t.functions['lca'] = function (get) {
	return `<div class='ce-expl-card'> ` + ($t(get(`scope`), '<span > <label>{{tag}}</label> <input type=\'checkbox\' value=\'{{tag}}\'> </span>', 'tag in allTags')) + ` <div class='key-auth'> <span class='key'>` + (get(`words`)) + `</span> </div> ` + ($t(get(`scope`), '<div > <button class=\'ce-btn ce-add-btn\'>+</button> <span> <div class=\'like-ctn\'>{{get(`explination.likes`)}}</div> <div class=\'like-ctn\'>{{get(`explination.disLikes`)}}</div> </span> <span class=\'expl\'> {{get(`explination.explanation`)}} </span> <span>{{get(`explination.author`)}}</span> </div>', 'explanation in explanations')) + `
</div>
`
}
$t.functions['vlhjmdzeiumqrlloqwsxlljdzwxpwkhvvlqzfb'] = function (get) {
	return `<div class='ce-expl-card'> ` + ($t(get(`scope`), '<span > <label>{{tag}}</label> <input type=\'checkbox\' value=\'{{tag}}\'> </span>', 'tag in allTags')) + ` <div class='key-auth'> <span class='key'>` + (get(`words`)) + `</span> </div> ` + ($t(get(`scope`), '<div > <button class=\'ce-btn ce-add-btn\'>+</button> <span> <div class=\'like-ctn\'>{{get(`explanation.likes`)}}</div> <div class=\'like-ctn\'>{{get(`explanation.disLikes`)}}</div> </span> <span class=\'expl\'> {{get(`explanation.explanation`)}} </span> <span>{{get(`explanation.author`)}}</span> </div>', 'explanation in explanations')) + `
</div>
`
}
$t.functions['rypyydhjvfb'] = function (get) {
	return `<div> ` + ($t(get(`scope`), '<span > <label>{{tag}}</label> <input type=\'checkbox\' value=\'{{tag}}\'> </span>', 'tag in allTags')) + ` <div class='key-auth'> <span class='key'>` + (get(`words`)) + `</span> </div> ` + ($t(get(`scope`), '<div class=\'ce-expl-card\' > <button class=\'ce-btn ce-add-btn\'>+</button> <span> <div class=\'like-ctn\'>{{get(`explanation.likes`)}}</div> <div class=\'like-ctn\'>{{get(`explanation.disLikes`)}}</div> </span> <span class=\'expl\'> {{get(`explanation.explanation`)}} </span> <span>{{get(`explanation.author`)}}</span> </div>', 'explanation in explanations')) + `
</div>
`
}
$t.functions['gypyuja'] = function (get) {
	return `<div> ` + ($t(get(`scope`), '<span > <label>{{tag}}</label> <input type=\'checkbox\' value=\'{{tag}}\'> </span>', 'tag in allTags')) + ` <div class='key-auth'> <span class='key'>` + (get(`words`)) + `</span> </div> ` + ($t(get(`scope`), '<div class=\'ce-expl-card\' > <button class=\'ce-btn ce-add-btn\'>+</button> <span class=\'expl-rating-column\'> <div class=\'like-ctn\'>{{get(`explanation.likes`)}}</div> <div class=\'like-ctn\'>{{get(`explanation.disLikes`)}}</div> </span> <span class=\'expl\'> {{get(`explanation.explanation`)}} </span> <span class=\'expl-author\'>{{get(`explanation.author`)}}</span> </div>', 'explanation in explanations')) + `
</div>
`
}
$t.functions['sb'] = function (get) {
	return `<div> ` + ($t(get(`scope`), '<span > <label>{{tag}}</label> <input type=\'checkbox\' value=\'{{tag}}\'> </span>', 'tag in allTags')) + ` <div class='key-auth'> <span class='key'>` + (get(`words`)) + `</span> </div> ` + ($t(get(`scope`), '<div class=\'ce-expl-card\' > <button class=\'ce-btn ce-add-btn\'>+</button> <span class=\'expl-rating-column\'> <div class=\'like-ctn\'>{{get(`explanation.likes`)}}</div> <div class=\'like-ctn\'>{{get(`explanation.disLikes`)}}</div> </span> <span class=\'expl\'> {{get(`explanation.explanation`)}} </span> <span class=\'expl-author-cnt\'>{{get(`explanation.author`)}}</span> </div>', 'explanation in explanations')) + `
</div>
`
}
$t.functions['pa'] = function (get) {
	return `<div> ` + ($t(get(`scope`), '<span > <label>{{tag}}</label> <input type=\'checkbox\' value=\'{{tag}}\'> </span>', 'tag in allTags')) + ` <div class='key-auth'> <span class='key'>` + (get(`words`)) + `</span> </div> ` + ($t(get(`scope`), '<div class=\'ce-expl-card\' > <button class=\'ce-btn ce-add-btn\'>+</button> <span class=\'ce-expl-rating-column\'> <div class=\'like-ctn\'>{{get(`explanation.likes`)}}</div> <div class=\'like-ctn\'>{{get(`explanation.disLikes`)}}</div> </span> <span class=\'ce-expl\'> {{get(`explanation.explanation`)}} </span> <span class=\'ce-expl-author-cnt\'>{{get(`explanation.author`)}}</span> </div>', 'explanation in explanations')) + `
</div>
`
}
$t.functions['b'] = function (get) {
	return `<div> ` + ($t(get(`scope`), '<span > <label>{{tag}}</label> <input type=\'checkbox\' value=\'{{tag}}\'> </span>', 'tag in allTags')) + ` <div class='key-auth'> <span class='key'>` + (get(`words`)) + `</span> <button class='ce-btn ce-add-btn'>+</button> </div> ` + ($t(get(`scope`), '<div class=\'ce-expl-card\' > <span class=\'ce-expl-rating-column\'> <div class=\'like-ctn\'>{{get(`explanation.likes`)}}</div> <div class=\'like-ctn\'>{{get(`explanation.dislikes`)}}</div> </span> <span class=\'ce-expl\'> {{get(`explanation.explanation`)}} </span> <span class=\'ce-expl-author-cnt\'>{{get(`explanation.author`)}}</span> </div>', 'explanation in explanations')) + `
</div>
`
}
$t.functions['vnphjvfb'] = function (get) {
	return `<div> ` + ($t(get(`scope`), '<span > <label>{{tag}}</label> <input type=\'checkbox\' value=\'{{tag}}\'> </span>', 'tag in allTags')) + ` <div class='key-auth'> <span class='key'>` + (get(`words`)) + `</span> <button class='ce-btn ce-add-btn'>+</button> </div> ` + ($t(get(`scope`), '<div class=\'ce-expl-card\' > <span class=\'ce-expl-rating-column\'> <div class=\'like-ctn\'> <button class=\'ce-like-btn\'>Like {{get(`explanation.likes`)}}</button> </div> <div class=\'like-ctn\'> <button class=\'ce-like-btn\'>Dislike {{get(`explanation.dislikes`)}}</button> </div> </span> <span class=\'ce-expl\'> {{get(`explanation.explanation`)}} </span> <span class=\'ce-expl-author-cnt\'>{{get(`explanation.author`)}}</span> </div>', 'explanation in explanations')) + `
</div>
`
}
$t.functions['mb'] = function (get) {
	return `<div> <div> <input type='text' placeholder="username"> <button type="button" onclick="register()">Register</button> </div> <div> <input type='text' placeholder="sync-key"> <button type='button' onclick="sync()">Sync</button> </div>
</div>
`
}
$t.functions['popUp0'] = function (get) {
	return `<div> <div id='` + (get(`MERRIAM_WEB_SUG_CNT_ID`)) + `'></div> <div class='ce-tab-ctn'> <ul class='ce-tab-list'> ` + ($t(get(`scope`), '<li  class=\'ce-tab-list-item {{get(`elem.active`) ? \'active\' : \'\'}}\'> <img class="lookup-img" src="{{get(`elem.imageSrc`)}}"> </li>', 'elem in list')) + ` </ul> ` + ($t(get(`scope`), '<div  class=\'ce-lookup-cnt\' id=\'{{get(`elem.cntId`)}}\'></div>', 'elem in list')) + ` </div>
</div>
`
}
$t.functions['registerLogin'] = function (get) {
	return `<div> <div> <input type='text' placeholder="username"> <button type="button" onclick="register()">Register</button> </div> <div> <input type='text' placeholder="sync-key"> <button type='button' onclick="sync()">Sync</button> </div>
</div>
`
}
$t.functions['popup'] = function (get) {
	return `<div> <div> <input type='text' placeholder="username"> <button type="button" onclick="register()">Register</button> </div> <div> <input type='text' placeholder="sync-key"> <button type='button' onclick="sync()">Sync</button> </div>
</div>
`
}
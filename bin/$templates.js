
$t.functions['467442134'] = function (get) {
	return `<span > <label>` + (get("tag")) + `</label> <input type='checkbox' value='` + (get("tag")) + `'> </span>`
}
$t.functions['1870015841'] = function (get) {
	return `<div class='ce-margin'> <div class='ce-merriam-expl-card'> <div class='ce-merriam-expl-cnt'> <h3>` + (get("item.hwi.hw")) + `</h3> ` + (new $t('<div class=\'ce-merriam-expl\'> {{def}} <br><br> </div>').render(get('scope'), 'def in item.shortdef', get)) + ` </div> </div> </div>`
}
$t.functions['icon-menu/controls'] = function (get) {
	return `<!DOCTYPE html> <html> <head> </head> <body> <div id='control-ctn'> </div> <script type="text/javascript" src='/index.js'></script> <script type="text/javascript" src='/src/index/ExprDef.js'></script> <script type="text/javascript" src='/src/index/$t.js'></script> <script type="text/javascript" src='/bin/$templates.js'></script> <script type="text/javascript" src='/src/manual/state.js'></script> </body> </html> `
}
$t.functions['icon-menu/menu'] = function (get) {
	return ` <menu> <link rel="stylesheet" href="file:///home/jozsef/projects/ContextExplained/css/menu.css"> <link rel="stylesheet" href="/css/menu.css"> <menuitem id='enable-btn' ` + (get("enabled") ? 'hidden': '') + `> Enable </menuitem> <menuitem id='disable-btn' ` + (!get("enabled") ? 'hidden': '') + `> Disable </menuitem> <menuitem id='ce-settings'> Settings </menuitem> </menu> `
}
$t.functions['icon-menu/links/profile'] = function (get) {
	return `<h1>Profile</h1> `
}
$t.functions['icon-menu/settings'] = function (get) {
	return `<!DOCTYPE html> <html lang="en" dir="ltr"> <head> <meta charset="utf-8"> <title>CE Settings</title> <link rel="stylesheet" href="/css/settings.css"> </head> <body> <div class='ce-setting-cnt'> <div id='ce-setting-list-cnt'> <ul id='ce-setting-list'></ul> </div> <div id='ce-settings-cnt'><h1>Hello World</h1></div> </div> <script type="text/javascript" src='/index.js'></script> <script type="text/javascript" src='/src/manual/settings.js'></script> </body> </html> `
}
$t.functions['icon-menu/links/favorite-lists'] = function (get) {
	return `<h1>favorite lists</h1> `
}
$t.functions['icon-menu/links/login'] = function (get) {
	return `<div> <div> <input type='text' placeholder="username"> <button type="button" onclick="register()">Register</button> </div> <div> <input type='text' placeholder="sync-key"> <button type='button' onclick="sync()">Sync</button> </div> </div> `
}
$t.functions['popup-cnt/linear-tab'] = function (get) {
	return `<span class='ce-linear-tab'>` + (get("scope")) + `</span> `
}
$t.functions['popup-cnt/tab-contents/explanation-cnt'] = function (get) {
	return `<div> <div> ` + (new $t('<span > <label>{{tag}}</label> <input type=\'checkbox\' value=\'{{tag}}\'> </span>').render(get('scope'), 'tag in allTags', get)) + ` </div> <div class='ce-key-cnt'> <h2 class='ce-key'>` + (get("words")) + `</h2> <button class='ce-btn ce-add-btn'>+</button> </div> <div class="ce-add-cnt"> ` + (new $t('popup-cnt/explanation').render(get('scope'), 'explanation in 0..1', get)) + ` <textarea id='` + (get("ADD_EDITOR_ID")) + `' rows="8" cols="80"></textarea> </div> <div> ` + (new $t('popup-cnt/explanation').render(get('scope'), 'explanation in explanations', get)) + ` </div> </div> `
}
$t.functions['-1132695726'] = function (get) {
	return `popup-cnt/explanation`
}
$t.functions['popup-cnt/tab-contents/wikapedia'] = function (get) {
	return `<iframe class='ce-wiki-frame' src="https://en.wikipedia.org/wiki/Second_Silesian_War"></iframe> `
}
$t.functions['popup-cnt/tab-contents/webster'] = function (get) {
	return `<div class='ce-merriam-expl-card'> <a href='https://www.merriam-webster.com/dictionary/hash' target='merriam-webster'> <h3>Merriam Webster '` + (get("key")) + `'</h3> </a> ` + (new $t('<div  class=\'ce-margin\'> <div class=\'ce-merriam-expl-card\'> <div class=\'ce-merriam-expl-cnt\'> <h3>{{item.hwi.hw}}</h3> {{new $t(\'<div  class=\\\'ce-merriam-expl\\\'> {{def}} <br><br> </div>\').render(get(\'scope\'), \'def in item.shortdef\', get)}} </div> </div> </div>').render(get('scope'), 'item in data', get)) + ` </div> `
}
$t.functions['-1925646037'] = function (get) {
	return `<div class='ce-merriam-expl'> ` + (get("def")) + ` <br><br> </div>`
}
$t.functions['popup-cnt/tab-contents/share'] = function (get) {
	return `<h2>words</h2> <input type='text' placeholder='space seperated tags i.e. "science biology genetics"' id='ce-tag-input'> <trix-editor class="trix-content" id='ce-expl-input'></trix-editor> <button class='ce-btn'>Post</button> `
}
$t.functions['popup-cnt/explanation'] = function (get) {
	return `<div class='ce-expl-card'> <span class='ce-expl-rating-column'> <div class='ce-expl-rating-cnt'> <div class='like-ctn'> <button class='ce-expl-voteup-button'>Like<br>` + (get("explanation.likes")) + `</button> </div> <div class='like-ctn'> <button class='ce-expl-votedown-button'>Dislike<br>` + (get("explanation.dislikes")) + `</button> </div> </div> </span> <span class='ce-expl'> ` + (get("explanation.explanation")) + ` </span> <span class='ce-expl-author-cnt'> <div class='ce-expl-author'> ` + (get("explanation.author")) + ` </div> </span> </div> `
}
$t.functions['popup-cnt/lookup'] = function (get) {
	return `<div> <link rel="stylesheet" href="` + (get("cssUrl")) + `"> <div id='` + (get("HISTORY_CNT_ID")) + `'></div> <div id='` + (get("MERRIAM_WEB_SUG_CNT_ID")) + `'></div> <div class='ce-tab-ctn'> <ul class='ce-tab-list'> ` + (new $t('<li  class=\'ce-tab-list-item {{elem.active ? \'active\' : \'\'}}\'> <img class="lookup-img" src="{{elem.imageSrc}}"> </li>').render(get('scope'), 'elem in list', get)) + ` </ul> ` + (new $t('<div  class=\'ce-lookup-cnt\' id=\'{{elem.cntId}}\'></div>').render(get('scope'), 'elem in list', get)) + ` </div> </div> `
}
$t.functions['-837702886'] = function (get) {
	return `<li class='ce-tab-list-item ` + (get("elem.active") ? 'active' : '') + `'> <img class="lookup-img" src="` + (get("elem.imageSrc")) + `"> </li>`
}
$t.functions['-364439612'] = function (get) {
	return `<div class='ce-lookup-cnt' id='` + (get("elem.cntId")) + `'></div>`
}
$t.functions['icon-menu/links/raw-text-tool'] = function (get) {
	return `<!DOCTYPE html> <html lang="en" dir="ltr"> <head> <meta charset="utf-8"> <title>Text2Html</title> </head> <body> <h1>hash</h1> <p> This page is created from HTTP status code information found at ietf.org and Wikipedia. Click on the category heading or the status code link to read more. </p> </body> <script type="text/javascript" src='/index.js'></script> </html> `
}
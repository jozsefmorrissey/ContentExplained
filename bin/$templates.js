// ./src/index/services/$t.js

$t.functions['483114051'] = function (get) {
	return `<span class='ce-linear-tab'>` + (get("sug")) + `</span>`
}
$t.functions['492362584'] = function (get) {
	return `<div class='ce-full-width' id='` + (get("elem").id()) + `'></div>`
}
$t.functions['755294900'] = function (get) {
	return `<li class='ce-hover-list` + (get("expl").id === get("active").expl.id ? " active": "") + `' > ` + (get("expl").words) + `&nbsp;<b class='ce-small-text'>(` + (get("expl").popularity) + `%)</b> </li>`
}
$t.functions['863427587'] = function (get) {
	return `<li class='ce-tab-list-item' ` + (get("elem").show() ? '' : 'hidden') + `> <img class="lookup-img" src="` + (get("elem").imageSrc()) + `"> </li>`
}
$t.functions['1870015841'] = function (get) {
	return `<div class='ce-margin'> <div class='ce-merriam-expl-card'> <div class='ce-merriam-expl-cnt'> <h3>` + (get("item").hwi.hw) + `</h3> ` + (new $t('<div class=\'ce-merriam-expl\'> {{def}} <br><br> </div>').render(get('scope'), 'def in item.shortdef', get)) + ` </div> </div> </div>`
}
$t.functions['hover-explanation'] = function (get) {
	return `<div> <div class="ce-inline ce-width-full"> <div class=""> <ul id='` + (get("HOVER_SWITCH_LIST_ID")) + `'> ` + (new $t('<li class=\'ce-hover-list{{expl.id === active.expl.id ? " active": ""}}\' > {{expl.words}}&nbsp;<b class=\'ce-small-text\'>({{expl.popularity}}%)</b> </li>').render(get('scope'), 'expl in active.list', get)) + ` </ul> </div> <div class='ce-width-full'> <div class='ce-hover-expl-title-cnt'> <div class='ce-center'> <button id='ce-expl-voteup-btn'` + (get("canLike") ? '' : ' disabled') + `></button> <br> ` + (get("likes")) + ` </div> <h3>` + (get("active").expl.words) + `</h3> <div class='ce-center'> ` + (get("dislikes")) + ` <br> <button id='ce-expl-votedown-btn'` + (get("canDislike") ? '' : ' disabled') + `></button> </div> &nbsp;&nbsp;&nbsp;&nbsp; </div> <div class=''> <div>` + (get("content")) + `</div> </div> </div> </div> <div class='ce-center'> <button ` + (get("loggedIn") ? ' hidden' : '') + ` id='` + (get("HOVER_LOGIN_BTN_ID")) + `'> Login </button> </div> </div> `
}
$t.functions['icon-menu/controls'] = function (get) {
	return `<!DOCTYPE html> <html> <head> </head> <body> <div id='control-ctn'> </div> <script type="text/javascript" src='/index.js'></script> <script type="text/javascript" src='/src/manual/state.js'></script> </body> </html> `
}
$t.functions['icon-menu/links/favorite-lists'] = function (get) {
	return `<h1>favorite lists</h1> `
}
$t.functions['icon-menu/links/login'] = function (get) {
	return `<div id='ce-login-cnt'> <div id='ce-login-center'> <h3 class='ce-error-msg'>` + (get("errorMsg")) + `</h3> <div ` + (get("state") === get("LOGIN") ? '' : 'hidden') + `> <input type='text' placeholder="Email" id='` + (get("EMAIL_INPUT")) + `' value='` + (get("email")) + `'> <br/><br/> <button type="button" id='` + (get("LOGIN_BTN_ID")) + `'>Submit</button> </div> <div ` + (get("state") === get("REGISTER") ? '' : 'hidden') + `> <input type='text' placeholder="Username" id='` + (get("USERNAME_INPUT")) + `' value='` + (get("username")) + `'> <br/><br/> <button type="button" id='` + (get("REGISTER_BTN_ID")) + `'>Register</button> </div> <div ` + (get("state") === get("CHECK") ? '' : 'hidden') + `> <h4>To proceed check your email confirm your request</h4> <br/><br/> <button type="button" id='` + (get("RESEND_BTN_ID")) + `'>Resend</button> <h2>or<h2/> <button type="button" id='` + (get("LOGOUT_BTN_ID")) + `'>Use Another Email</button> </div> </div> </div> `
}
$t.functions['icon-menu/links/profile'] = function (get) {
	return `<div> <div id='ce-profile-header-ctn'> <h1>` + (get("username")) + `</h1> &nbsp;&nbsp;&nbsp;&nbsp; <div> <button id='` + (get("LOGOUT_BTN_ID")) + `' type="submit">Logout</button> </div> </div> <h3>` + (get("importantMessage")) + `</h3> <form id=` + (get("UPDATE_FORM_ID")) + `> <div> <label for="` + (get("USERNAME_INPUT_ID")) + `">New Username:</label> <input class='ce-float-right' id='` + (get("USERNAME_INPUT_ID")) + `' type="text" name="username" value=""> <br><br> <label for="` + (get("NEW_EMAIL_INPUT_ID")) + `">New Email:&nbsp;&nbsp;&nbsp;&nbsp;</label> <input class='ce-float-right' id='` + (get("NEW_EMAIL_INPUT_ID")) + `' type="email" name="email" value=""> </div> <br><br><br> <div> <label for="` + (get("CURRENT_EMAIL_INPUT_ID")) + `">Confirm Current Email:</label> <input required class='ce-float-right' id='` + (get("CURRENT_EMAIL_INPUT_ID")) + `' type="email" name="currentEmail" value=""> </div> <br> <div class="ce-center"> <button id='` + (get("UPDATE_BTN_ID")) + `' type="submit" name="button">Update</button> </div> </form> <div> <label>Likes:</label> <b>` + (get("likes")) + `</b> </div> <br> <div> <label>DisLikes:</label> <b>` + (get("dislikes")) + `</b> </div> </div> `
}
$t.functions['icon-menu/links/raw-text-tool'] = function (get) {
	return `<div id='` + (get("RAW_TEXT_CNT_ID")) + `'> Enter text to update this content. </div> `
}
$t.functions['hover-resources'] = function (get) {
	return `<div id='` + (get("POPUP_CNT_ID")) + `'> <div class='ce-relative'> <div class='ce-hover-max-min-abs-cnt'> <div class='ce-hover-max-min-cnt'> <button class='ce-upper-right-btn' id='` + (get("MAXIMIZE_BTN_ID")) + `'> &plus; </button> <button class='ce-upper-right-btn' hidden id='` + (get("MINIMIZE_BTN_ID")) + `'> &minus; </button> </div> </div> </div> <div id='` + (get("POPUP_CONTENT_ID")) + `' class='ce-full'></div> </div> `
}
$t.functions['icon-menu/links/developer'] = function (get) {
	return `<div> <label>Environment</label> <select id='` + (get("ENV_SELECT_ID")) + `'> ` + (new $t('<option  value="{{env}}" {{env === currEnv ? \'selected\' : \'\'}}> {{env}} </option>').render(get('scope'), 'env in envs', get)) + ` </select> </div> <div> <label>Debug Gui Host</label> <input type="text" id=` + (get("DEBUG_GUI_HOST_INPUT")) + ` value="` + (get("debugGuiHost")) + `"> </div> `
}
$t.functions['-67159008'] = function (get) {
	return `<option value="` + (get("env")) + `" ` + (get("env") === get("currEnv") ? 'selected' : '') + `> ` + (get("env")) + ` </option>`
}
$t.functions['icon-menu/settings'] = function (get) {
	return `<!DOCTYPE html> <html lang="en" dir="ltr"> <head> <meta charset="utf-8"> <title>CE Settings</title> <link rel="stylesheet" href="/css/index.css"> <link rel="stylesheet" href="/css/settings.css"> <link rel="stylesheet" href="/css/lookup.css"> <link rel="stylesheet" href="/css/hover-resource.css"> </head> <body> <div class='ce-setting-cnt'> <div id='ce-setting-list-cnt'> <ul id='ce-setting-list'></ul> </div> <div id='ce-setting-cnt'></div> </div> <script type="text/javascript" src='/index.js'></script> <script type="text/javascript" src='/src/manual/key-short-cut.js'></script> <script type="text/javascript" src='/src/manual/short-cut-container.js'></script> <script type="text/javascript" src='/src/manual/settings.js'></script> </body> </html> `
}
$t.functions['popup-cnt/linear-tab'] = function (get) {
	return `<span class='ce-linear-tab'>` + (get("scope")) + `</span> `
}
$t.functions['popup-cnt/lookup'] = function (get) {
	return `<div> <div class='ce-inline-flex' id='` + (get("HISTORY_CNT_ID")) + `'></div> <div class='ce-inline-flex' id='` + (get("MERRIAM_WEB_SUG_CNT_ID")) + `'></div> <div class='ce-tab-ctn'> <ul class='ce-tab-list'> ` + (new $t('<li  class=\'ce-tab-list-item\' {{elem.show() ? \'\' : \'hidden\'}}> <img class="lookup-img" src="{{elem.imageSrc()}}"> </li>').render(get('scope'), 'elem in list', get)) + ` </ul> <div class='ce-lookup-cnt'> ` + (new $t('<div  class=\'ce-full-width\' id=\'{{elem.id()}}\'></div>').render(get('scope'), 'elem in list', get)) + ` </div> </div> </div> `
}
$t.functions['popup-cnt/tab-contents/add-explanation'] = function (get) {
	return `<div class='ce-full'> <div class='ce-inline ce-full'> <div class="ce-full" id='` + (get("ADD_EDITOR_CNT_ID")) + `'> <div class='ce-center'> <h3>` + (get("words")) + `</h3> </div> <textarea id='` + (get("ADD_EDITOR_ID")) + `' class='ce-full'></textarea> </div> <div> <button id='` + (get("SUBMIT_EXPL_BTN_ID")) + `'>Add&nbsp;To&nbsp;Url</button> </div> </div> </div> `
}
$t.functions['popup-cnt/tab-contents/explanation-cnt'] = function (get) {
	return `<div> <div class='ce-center'> <h2 ` + (get("explanations").length > 0 ? 'hidden' : '') + `>No Explanations Found</h2> </div> <div class='ce-expls-cnt'` + (get("explanations").length > 0 ? '' : ' hidden') + `> <div class='ce-lookup-expl-list-cnt'> ` + (new $t('popup-cnt/explanation').render(get('scope'), 'explanation in explanations', get)) + ` </div> </div> <div class='ce-center'> <button` + (get("loggedIn") ? '' : ' hidden') + ` id='` + (get("CREATE_YOUR_OWN_BTN_ID")) + `'> Create Your Own </button> <button` + (!get("loggedIn") ? '' : ' hidden') + ` id='` + (get("LOGIN_BTN_ID")) + `'> Login </button> </div> </div> `
}
$t.functions['-1132695726'] = function (get) {
	return `popup-cnt/explanation`
}
$t.functions['popup-cnt/tab-contents/explanation-header'] = function (get) {
	return `<div> <div class='ce-lookup-expl-heading-cnt'> <div class='ce-key-cnt'> <input type='text' style='font-size: x-large;margin: 0;' value='` + (get("words")) + `' id='` + (get("EXPL_SEARCH_INPUT_ID")) + `'> <button class='ce-words-search-btn' id='` + (get("SEARCH_BTN_ID")) + `'>Search</button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </div> <div` + (get("explanations").length > 0 ? '' : ' hidden') + `> <div class='ce-expl-tag-cnt'> ` + (new $t('<span > <input type=\'checkbox\' class=\'ce-expl-tag\' value=\'{{tag}}\' {{selected.indexOf(tag) === -1 ? \'\' : \'checked\'}}> <label>{{tag}}</label> </span>').render(get('scope'), 'tag in allTags', get)) + ` </div> </div> </div> </div> `
}
$t.functions['-1828676604'] = function (get) {
	return `<span > <input type='checkbox' class='ce-expl-tag' value='` + (get("tag")) + `' ` + (get("selected").indexOf(get("tag")) === -1 ? '' : 'checked') + `> <label>` + (get("tag")) + `</label> </span>`
}
$t.functions['popup-cnt/tab-contents/webster-header'] = function (get) {
	return `<div class='ce-merriam-header-cnt'> <a href='https://www.merriam-webster.com/dictionary/` + (get("key")) + `' target='merriam-webster'> Merriam&nbsp;Webster&nbsp;'` + (get("key")) + `' </a> <div id='` + (get("MERRIAM_WEB_SUG_CNT_ID")) + `'> ` + (new $t('<span  class=\'ce-linear-tab\'>{{sug}}</span>').render(get('scope'), 'sug in suggestions', get)) + ` </div> </div> `
}
$t.functions['icon-menu/raw-text-input'] = function (get) {
	return `<div class='ce-padding ce-full'> <div class='ce-padding'> <label>TabSpacing</label> <input type="number" id="` + (get("TAB_SPACING_INPUT_ID")) + `" value="` + (get("tabSpacing")) + `"> </div> <textarea id='` + (get("RAW_TEXT_INPUT_ID")) + `' style='height: 90%; width: 95%;'></textarea> </div> `
}
$t.functions['icon-menu/menu'] = function (get) {
	return ` <menu> <link rel="stylesheet" href="file:///home/jozsef/projects/ContextExplained/css/menu.css"> <link rel="stylesheet" href="/css/menu.css"> <menuitem id='login-btn' ` + (get("loggedIn") ? 'hidden': '') + `> Login </menuitem> <menuitem id='logout-btn' ` + (!get("loggedIn") ? 'hidden': '') + `> Logout </menuitem> <menuitem id='enable-btn' ` + (get("enabled") ? 'hidden': '') + `> Enable </menuitem> <menuitem id='disable-btn' ` + (!get("enabled") ? 'hidden': '') + `> Disable </menuitem> <menuitem id='ce-settings'> Settings </menuitem> </menu> `
}
$t.functions['popup-cnt/explanation'] = function (get) {
	return `<div class='ce-expl-card'> <span class='ce-expl-cnt'> <div class='ce-expl-apply-cnt'> <button expl-id="` + (get("explanation").id) + `" class='ce-expl-apply-btn' ` + (get("explanation").canApply ? '' : 'disabled') + `> Apply </button> </div> <span class='ce-expl'> <div> <h5> ` + (get("explanation").author.percent) + `% ` + (get("explanation").words) + ` - ` + (get("explanation").shortUsername) + ` </h5> ` + (get("explanation").rendered) + ` </div> </span> </span> </div> `
}
$t.functions['tabs'] = function (get) {
	return `<div class='ce-inline ce-full' id='` + (get("TAB_CNT_ID")) + `'> <div> <div position='fixed' id='` + (get("NAV_CNT_ID")) + `'> <ul class='ce-width-full ` + (get("LIST_CLASS")) + `' id='` + (get("LIST_ID")) + `'> ` + (new $t('<li  {{page.hide() ? \'hidden\' : \'\'}} class=\'{{activePage === page ? ACTIVE_CSS_CLASS : CSS_CLASS}}\'> {{page.label()}} </li>').render(get('scope'), 'page in pages', get)) + ` </ul> </div> <div id='` + (get("NAV_SPACER_ID")) + `'></div> </div> <div class='ce-width-full'> <div position='fixed' id='` + (get("HEADER_CNT_ID")) + `'> ` + (get("header")) + ` </div> <div class='ce-full-width' id='` + (get("CNT_ID")) + `'> ` + (get("content")) + ` </div> </div> </div> `
}
$t.functions['-888280636'] = function (get) {
	return `<li ` + (get("page").hide() ? 'hidden' : '') + ` class='` + (get("activePage") === get("page") ? get("ACTIVE_CSS_CLASS") : get("CSS_CLASS")) + `'> ` + (get("page").label()) + ` </li>`
}
$t.functions['popup-cnt/tab-contents/wikapedia'] = function (get) {
	return `<iframe class='ce-wiki-frame' src="https://en.wikipedia.org/wiki/Second_Silesian_War"></iframe> `
}
$t.functions['popup-cnt/tab-contents/webster'] = function (get) {
	return `<div class='ce-merriam-cnt'> <div id='` + (get("MERRIAM_WEB_SUG_CNT_ID")) + `'> ` + (new $t('<span  class=\'ce-linear-tab\'>{{sug}}</span>').render(get('scope'), 'sug in suggestions', get)) + ` </div> ` + (new $t('<div  class=\'ce-margin\'> <div class=\'ce-merriam-expl-card\'> <div class=\'ce-merriam-expl-cnt\'> <h3>{{item.hwi.hw}}</h3> {{new $t(\'<div  class=\\\'ce-merriam-expl\\\'> {{def}} <br><br> </div>\').render(get(\'scope\'), \'def in item.shortdef\', get)}} </div> </div> </div>').render(get('scope'), 'item in definitions', get)) + ` </div> `
}
$t.functions['-1925646037'] = function (get) {
	return `<div class='ce-merriam-expl'> ` + (get("def")) + ` <br><br> </div>`
}
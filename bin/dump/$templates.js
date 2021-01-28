// ./src/index/services/$t.js

$t.functions['122441455'] = function (get) {
	return `<div question-id='` + (get("question").id) + `'> <div class='ce-full ce-center'> <button type="button" class='ce-slim-btn ce-question-answer'>Answer</button> <button type="button" class='ce-slim-btn ce-question-unclear'>Un Clear</button> <button type="button" class='ce-slim-btn ce-question-answered'>Answered</button> <h3>` + (get("question").words) + `</h3> </div> ` + (get("question").elaboration) + ` </div>`
}
$t.functions['492362584'] = function (get) {
	return `<div class='ce-full-width' id='` + (get("elem").id()) + `'></div>`
}
$t.functions['863427587'] = function (get) {
	return `<li class='ce-tab-list-item' ` + (get("elem").show() ? '' : 'hidden') + `> <img class="lookup-img" src="` + (get("elem").imageSrc()) + `"> </li>`
}
$t.functions['906579606'] = function (get) {
	return `<li class='ce-hover-list-elem` + (get("expl").id === get("active").expl.id ? " active": "") + `' > ` + (get("expl").words) + `&nbsp;<b class='ce-small-text'>(` + (get("expl").popularity) + `%)</b> </li>`
}
$t.functions['1165578666'] = function (get) {
	return `<option value='` + (get("sug")) + `' ></option>`
}
$t.functions['1175765711'] = function (get) {
	return `<div id='ce-hover-expl-` + (get("tab").label) + `-cnt' ` + (get("tab").active === true ? "" : " hidden") + ` ` + (get("tab").hide() ? "hidden" : "") + `> ` + (get("tab").html()) + ` </div>`
}
$t.functions['1266551310'] = function (get) {
	return `<option value='` + (get("words")) + `' ></option>`
}
$t.functions['1496787416'] = function (get) {
	return `<menuitem > ` + (get("notification")) + ` </menuitem>`
}
$t.functions['1663607604'] = function (get) {
	return `<menuitem > ` + (get("site")) + ` </menuitem>`
}
$t.functions['1870015841'] = function (get) {
	return `<div class='ce-margin'> <div class='ce-merriam-expl-card'> <div class='ce-merriam-expl-cnt'> <h3>` + (get("item").hwi.hw) + `</h3> ` + (new $t('<div class=\'ce-merriam-expl\'> {{def}} <br><br> </div>').render(get('scope'), 'def in item.shortdef', get)) + ` </div> </div> </div>`
}
$t.functions['2085205162'] = function (get) {
	return `<li ><button toggle-id='` + (get("toggle").id) + `' ` + (get("toggle").disabled ? ' hidden disabled' : '') + `> ` + (get("toggle").showing ? get("toggle").hide.text : get("toggle").show.text) + ` </button></li>`
}
$t.functions['history'] = function (get) {
	return `<div> <ul class='ce-history-list'> ` + (new $t('<li  value=\'{{elem.index}}\' class=\'{{!filtered && elem.index === history.currentPosition ? \'place-current-hist-loc\' : \'\'}}\'> {{!filtered && elem.index === history.currentPosition ? \'\' : elem.elem}} </li>').render(get('scope'), 'elem in history.list', get)) + ` </ul> </div> `
}
$t.functions['-2107865266'] = function (get) {
	return `<li value='` + (get("elem").index) + `' class='` + (!get("filtered") && get("elem").index === get("history").currentPosition ? 'place-current-hist-loc' : '') + `'> ` + (!get("filtered") && get("elem").index === get("history").currentPosition ? '' : get("elem").elem) + ` </li>`
}
$t.functions['icon-menu/links/developer'] = function (get) {
	return `<div> <div> <label>Environment:</label> <select id='` + (get("ENV_SELECT_ID")) + `'> ` + (new $t('<option  value="{{env}}" {{env === currEnv ? \'selected\' : \'\'}}> {{env}} </option>').render(get('scope'), 'env in envs', get)) + ` </select> </div> <div> <label>Debug Gui Host:</label> <input type="text" id="` + (get("DG_HOST_INPUT_ID")) + `" value="` + (get("debugGuiHost")) + `"> </div> <div> <label>Debug Gui Id:</label> <input type="text" id="` + (get("DG_ID_INPUT_ID")) + `" value="` + (get("debugGuiId")) + `"> </div> </div> `
}
$t.functions['-67159008'] = function (get) {
	return `<option value="` + (get("env")) + `" ` + (get("env") === get("currEnv") ? 'selected' : '') + `> ` + (get("env")) + ` </option>`
}
$t.functions['hover-explanation'] = function (get) {
	return `<div> <div class="ce-inline ce-width-full"> <div class="ce-hover-switch-list-cnt"> <ul id='` + (get("SWITCH_LIST_ID")) + `' class='ce-hover-list ce-auto-overflow' style='height: ` + (get("height")) + `'> ` + (new $t('<li class=\'ce-hover-list-elem{{expl.id === active.expl.id ? " active": ""}}\' > {{expl.words}}&nbsp;<b class=\'ce-small-text\'>({{expl.popularity}}%)</b> </li>').render(get('scope'), 'expl in active.list', get)) + ` </ul> </div> <div id='` + (get("MAIN_CONTENT_CNT_ID")) + `' class='ce-width-full ce-auto-overflow' style='height: ` + (get("height")) + `'> <div class='ce-hover-expl-cnt'> <div class='ce-hover-expl-title-cnt'> <div id='` + (get("VOTEUP_BTN_ID")) + `' class='ce-center` + (get("canLike") ? " ce-pointer" : "") + `'> <button class='ce-like-btn'` + (get("canLike") ? '' : ' disabled') + `></button> <br> ` + (get("likes")) + ` </div> <h3>` + (get("active").expl.words) + `</h3> <div id='` + (get("VOTEDOWN_BTN_ID")) + `' class='ce-center` + (get("canDislike") ? " ce-pointer" : "") + `'> ` + (get("dislikes")) + ` <br> <button class='ce-dislike-btn'` + (get("canDislike") ? '' : ' disabled') + `></button> </div> &nbsp;&nbsp;&nbsp;&nbsp; </div> <div class='ce-hover-expl-content-cnt'> <div>` + (get("content")) + `</div> </div> </div> <div class='ce-center'` + (get("hideComments") ? ' hidden' : '') + `> <button ` + (get("loggedIn") ? ' hidden' : '') + ` id='` + (get("LOGIN_BTN_ID")) + `'> Login </button> <button ` + (get("authored") ? '' : ' hidden') + ` id='` + (get("EDIT_BTN_ID")) + `'> Edit </button> </div> <ul class='ce-hover-expl-tab-control-cnt'> ` + (new $t('<li  ce-tab=\'ce-hover-expl-{{tab.label}}-cnt\' class=\'{{tab.active === true ? "active" : ""}}\' {{tab.hide() ? "hidden" : ""}}> {{tab.label}} </li>').render(get('scope'), 'tab in tabs', get)) + ` </ul> ` + (new $t('<div  id=\'ce-hover-expl-{{tab.label}}-cnt\' {{tab.active === true ? "" : " hidden"}} {{tab.hide() ? "hidden" : ""}}> {{tab.html()}} </div>').render(get('scope'), 'tab in tabs', get)) + ` </div> </div> </div> `
}
$t.functions['-62032811'] = function (get) {
	return `<li ce-tab='ce-hover-expl-` + (get("tab").label) + `-cnt' class='` + (get("tab").active === true ? "active" : "") + `' ` + (get("tab").hide() ? "hidden" : "") + `> ` + (get("tab").label) + ` </li>`
}
$t.functions['icon-menu/links/favorite-lists'] = function (get) {
	return `<h1>favorite lists</h1> `
}
$t.functions['icon-menu/links/login'] = function (get) {
	return `<div id='ce-login-cnt'> <div id='ce-login-center'> <h3 class='ce-error-msg'>` + (get("errorMsg")) + `</h3> <div ` + (get("state") === get("LOGIN") ? '' : 'hidden') + `> <input type='text' placeholder="Email" id='` + (get("EMAIL_INPUT")) + `' value='` + (get("email")) + `'> <br/><br/> <button type="button" id='` + (get("LOGIN_BTN_ID")) + `'>Submit</button> </div> <div ` + (get("state") === get("REGISTER") ? '' : 'hidden') + `> <input type='text' placeholder="Username" id='` + (get("USERNAME_INPUT")) + `' value='` + (get("username")) + `'> <br/><br/> <button type="button" id='` + (get("REGISTER_BTN_ID")) + `'>Register</button> </div> <div ` + (get("state") === get("CHECK") ? '' : 'hidden') + `> <h4>To proceed check your email confirm your request</h4> <br/><br/> <button type="button" id='` + (get("RESEND_BTN_ID")) + `'>Resend</button> <h2>or<h2/> <button type="button" id='` + (get("LOGOUT_BTN_ID")) + `'>Use Another Email</button> </div> </div> </div> `
}
$t.functions['icon-menu/links/profile'] = function (get) {
	return `<div> <div> <button id='` + (get("LOGOUT_BTN_ID")) + `' type="submit">Logout</button> </div> <div id='ce-profile-header-ctn'> <h1>` + (get("username")) + `</h1> &nbsp;&nbsp;&nbsp;&nbsp; </div> <h3>` + (get("importantMessage")) + `</h3> <form id=` + (get("UPDATE_FORM_ID")) + `> <div> <label for="` + (get("USERNAME_INPUT_ID")) + `">New Username:</label> <input class='ce-float-right' id='` + (get("USERNAME_INPUT_ID")) + `' type="text" name="username" value=""> <br><br> <label for="` + (get("NEW_EMAIL_INPUT_ID")) + `">New Email:&nbsp;&nbsp;&nbsp;&nbsp;</label> <input class='ce-float-right' id='` + (get("NEW_EMAIL_INPUT_ID")) + `' type="email" name="email" value=""> </div> <br><br><br> <div> <label for="` + (get("CURRENT_EMAIL_INPUT_ID")) + `">Confirm Current Email:</label> <input required class='ce-float-right' id='` + (get("CURRENT_EMAIL_INPUT_ID")) + `' type="email" name="currentEmail" value=""> </div> <br> <div class="ce-center"> <button id='` + (get("UPDATE_BTN_ID")) + `' type="submit" name="button">Update</button> </div> </form> <div> <label>Likes:</label> <b>` + (get("likes")) + `</b> </div> <br> <div> <label>DisLikes:</label> <b>` + (get("dislikes")) + `</b> </div> </div> `
}
$t.functions['icon-menu/links/raw-text-input'] = function (get) {
	return `<div class='ce-padding ce-full'> <div class='ce-padding'> <label>TabSpacing</label> <input type="number" id="` + (get("TAB_SPACING_INPUT_ID")) + `" value="` + (get("tabSpacing")) + `"> </div> <textarea id='` + (get("RAW_TEXT_INPUT_ID")) + `' style='height: 90%; width: 95%;'></textarea> </div> `
}
$t.functions['icon-menu/links/raw-text-tool'] = function (get) {
	return `<div id='` + (get("RAW_TEXT_CNT_ID")) + `'> Enter text to update this content. </div> `
}
$t.functions['icon-menu/menu'] = function (get) {
	return ` <menu> <menuitem id='login-btn'> ` + (!get("loggedIn") ? 'Login': 'Logout') + ` </menuitem> <menuitem id='notifications' ` + (get("loggedIn") ? '' : ' hidden') + `> Notifications </menuitem> <menuitem id='hover-btn'> Hover:&nbsp;` + (get("hoverOff") ? 'OFF': 'ON') + ` </menuitem> <menuitem id='enable-btn'> ` + (get("enabled") ? 'Disable': 'Enable') + ` </menuitem> <menuitem id='settings'> Settings </menuitem> </menu> `
}
$t.functions['icon-menu/notifications'] = function (get) {
	return `<div class='inline'> <div> <button class="back-btn" id="back-button">&#x2190;</button> </div> <div> <div> <b>Notifications</b> <menu class='fit'> ` + (new $t('<menuitem > {{notification}} </menuitem>').render(get('scope'), 'notification in currentAlerts', get)) + ` </menu> </div> <div> <b>Elsewhere</b> <menu class='fit'> ` + (new $t('<menuitem > {{site}} </menuitem>').render(get('scope'), 'site in otherSites', get)) + ` </menu> </div> </div> </div> `
}
$t.functions['notifications'] = function (get) {
	return `<div class=""> <ul class='ce-notification-list'> ` + (new $t('<li  class=\'{{getClass(note)}}\' ce-notification-key="{{key(note)}}"> <h4 class=\'ce-no-margin\'>{{getHeading(note)}}</h4> {{getText(note)}} </li>').render(get('scope'), 'note in currPage', get)) + ` </ul> <h4>Other Page Notifications</h4> <ul class='ce-notification-list'> ` + (new $t('<li  class=\'{{getClass(note)}}\' ce-open="{{note.site.url}}" ce-target="{{key(note)}}"> <h4 class=\'ce-no-margin\'>{{getHeading(note)}}</h4> {{getText(note)}} </li>').render(get('scope'), 'note in otherPage', get)) + ` </ul> </div> `
}
$t.functions['-397749582'] = function (get) {
	return `<li class='` + (get("getClass")(get("note"))) + `' ce-notification-key="` + (get("key")(get("note"))) + `"> <h4 class='ce-no-margin'>` + (get("getHeading")(get("note"))) + `</h4> ` + (get("getText")(get("note"))) + ` </li>`
}
$t.functions['-1466040354'] = function (get) {
	return `<li class='` + (get("getClass")(get("note"))) + `' ce-open="` + (get("note").site.url) + `" ce-target="` + (get("key")(get("note"))) + `"> <h4 class='ce-no-margin'>` + (get("getHeading")(get("note"))) + `</h4> ` + (get("getText")(get("note"))) + ` </li>`
}
$t.functions['place'] = function (get) {
	return `<div id='` + (get("POPUP_CNT_ID")) + `'> <div class='ce-full'> <div hidden id='` + (get("POPUP_HEADER_CNT_ID")) + `'> tab </div> <div id='` + (get("POPUP_CONTENT_CNT_ID")) + `' class='ce-full'> <div class='place-max-min-cnt' id='` + (get("MAX_MIN_CNT_ID")) + `'> <div class='place-max-min-fixed-cnt place-full-width' position='fixed'> <div class='place-inline place-right'> <button class='place-btn place-right' id='` + (get("BACK_BTN_ID")) + `'> &pr; </button> <button class='place-btn place-right' id='` + (get("HISTORY_BTN_ID")) + `'> &equiv; </button> <button class='place-btn place-right' id='` + (get("FORWARD_BTN_ID")) + `'> &sc; </button> <button class='place-btn place-right'` + (get("props").hideMove ? ' hidden' : '') + ` id='` + (get("MOVE_BTN_ID")) + `'> &#10021; </button> <button class='place-btn place-right'` + (get("props").hideMin ? ' hidden' : '') + ` id='` + (get("MINIMIZE_BTN_ID")) + `' hidden> &#95; </button> <button class='place-btn place-right'` + (get("props").hideMax ? ' hidden' : '') + ` id='` + (get("MAXIMIZE_BTN_ID")) + `'> &square; </button> <button class='place-btn place-right'` + (get("props").hideClose ? ' hidden' : '') + ` id='` + (get("CLOSE_BTN_ID")) + `'> &times; </button> </div> </div> </div> <div id='` + (get("POPUP_CONTENT_ID")) + `' class='ce-full'> <!-- Hello World im writing giberish for testing purposes --> </div> </div> </div> </div> `
}
$t.functions['popup-cnt/explanation'] = function (get) {
	return `<div class='ce-expl-card'> <span class='ce-expl-cnt'> <div class='ce-expl-apply-cnt'> <button expl-id="` + (get("explanation").id) + `" class='ce-expl-apply-btn' ` + (get("explanation").canApply ? '' : 'disabled') + `> Apply </button> </div> <span class='ce-expl'> <div> <h5> ` + (get("explanation").author.percent) + `% ` + (get("explanation").words) + ` - ` + (get("explanation").shortUsername) + ` </h5> ` + (get("explanation").rendered) + ` </div> </span> </span> </div> `
}
$t.functions['popup-cnt/linear-tab'] = function (get) {
	return `<span class='ce-linear-tab'>` + (get("scope")) + `</span> `
}
$t.functions['popup-cnt/lookup'] = function (get) {
	return `<div> <div class='ce-inline-flex' id='` + (get("HISTORY_CNT_ID")) + `'></div> <div class='ce-inline-flex' id='` + (get("MERRIAM_WEB_SUG_CNT_ID")) + `'></div> <div class='ce-tab-ctn'> <ul class='ce-tab-list'> ` + (new $t('<li  class=\'ce-tab-list-item\' {{elem.show() ? \'\' : \'hidden\'}}> <img class="lookup-img" src="{{elem.imageSrc()}}"> </li>').render(get('scope'), 'elem in list', get)) + ` </ul> <div class='ce-lookup-cnt'> ` + (new $t('<div  class=\'ce-full-width\' id=\'{{elem.id()}}\'></div>').render(get('scope'), 'elem in list', get)) + ` </div> </div> </div> `
}
$t.functions['popup-cnt/tab-contents/add-comment'] = function (get) {
	return `<div class='ce-comment-cnt-class` + (get("color") ? ' colored' : '') + `' id='` + (get("ROOT_ELEM_ID")) + `'> <div ce-comment-id='` + (get("comment").id) + `'> <div class='ce-comment-header-class'` + (get("comment").author ? '' : ' hidden') + `> ` + (get("comment") ? get("comment").author.username : '') + ` </div> <div class='ce-comment-body-class'> ` + (get("comment") ? get("comment").value : '') + ` </div> </div> <div id='` + (get("COMMENTS_CNT_ID")) + `'` + (get("showComments") || !get("commentHtml") ? '' : ' hidden') + ` ce-sibling-id='` + (get("siblingId")) + `'> <div> ` + (get("commentHtml")) + ` </div> <div class='ce-center'> <div hidden id='` + (get("ADD_CNT_ID")) + `'> <textarea type='text' id='` + (get("TEXT_AREA_INPUT_ID")) + `' explanation-id='` + (get("explanation").id) + `' comment-id='` + (get("comment").id || '') + `'></textarea> <button class='ce-comment-submit-btn-class' textarea-id='` + (get("TEXT_AREA_INPUT_ID")) + `'> Submit </button> </div> </div> </div> <div class='ce-center'> <button type="button" class="ce-toggle ce-slim-btn" ce-toggle='` + (get("COMMENTS_CNT_ID")) + `' ce-toggle-hidden-text='Show Comments' ce-toggle-visible-text='Hide Comments' ` + (get("commentHtml") ? '' : 'hidden disabled') + `> ` + (!get("showComments") ? 'Show Comments' : 'Hide Comments') + ` </button> <button type="button" class="ce-toggle ce-slim-btn" ce-toggle='` + (get("ADD_CNT_ID")) + `' ce-toggle-hidden-text='Add Comment' ce-toggle-visible-text='Close Comment' ` + (get("loggedIn") ? '' : 'hidden disabled') + `> Add Comment </button> </div> </div> `
}
$t.functions['popup-cnt/tab-contents/add-explanation'] = function (get) {
	return `<div class='ce-full'> <div class='ce-full'> <div class="ce-full" id='` + (get("ADD_EDITOR_CNT_ID")) + `'> <div class='ce-center'> <div class='ce-inline'> <input type='text' value='` + (get("words")) + `' list='ce-edited-words' id='` + (get("WORDS_INPUT_ID")) + `' autocomplete="off"> <datalist id='ce-edited-words'> ` + (new $t('<option value=\'{{words}}\' ></option>').render(get('scope'), 'words in editedWords', get)) + ` </datalist> <div> <button id='` + (get("SUBMIT_EXPL_BTN_ID")) + `' ` + (get("id") ? 'hidden' : '') + `> Add&nbsp;To&nbsp;Url </button> <button id='` + (get("UPDATE_EXPL_BTN_ID")) + `' ` + (get("id") ? '' : 'hidden') + `> Update </button> </div> <a href='` + (get("url")) + `'` + (get("url") ? '' : ' hidden') + ` target='_blank'> ` + (get("url").length < 20 ? get("url") : get("url").substr(0, 17) + '...') + ` </a> </div> <div> <p` + (get("writingJs") ? '' : ' hidden') + ` class='ce-error'>Stop tring to write JavaScript!</p> </div> </div> <textarea id='` + (get("ADD_EDITOR_ID")) + `' class='ce-full'></textarea> </div> </div> </div> `
}
$t.functions['popup-cnt/tab-contents/comment-controls'] = function (get) {
	return `<ul class='ce-comment-control-cnt-class' id='` + (get("TOGGLE_MENU_ID")) + `'> ` + (new $t('<li ><button toggle-id=\'{{toggle.id}}\' {{toggle.disabled ? \' hidden disabled\' : \'\'}}> {{toggle.showing ? toggle.hide.text : toggle.show.text}} </button></li>').render(get('scope'), 'toggle in toggles', get)) + ` </ul> `
}
$t.functions['popup-cnt/tab-contents/explanation-cnt'] = function (get) {
	return `<div> <div class='ce-center'> <h2 ` + (get("explanations").length > 0 ? 'hidden' : '') + `>No Explanations Found</h2> </div> <div class='ce-expls-cnt'` + (get("explanations").length > 0 ? '' : ' hidden') + `> <div class='ce-lookup-expl-list-cnt'> ` + (new $t('popup-cnt/explanation').render(get('scope'), 'explanation in explanations', get)) + ` </div> </div> <div class='ce-center'> <button` + (get("loggedIn") ? '' : ' hidden') + ` id='` + (get("CREATE_YOUR_OWN_BTN_ID")) + `'> Create Your Own </button> <button` + (!get("loggedIn") ? '' : ' hidden') + ` id='` + (get("LOGIN_BTN_ID")) + `'> Login </button> </div> </div> `
}
$t.functions['-1132695726'] = function (get) {
	return `popup-cnt/explanation`
}
$t.functions['popup-cnt/tab-contents/explanation-header'] = function (get) {
	return `<div> <div class='ce-lookup-expl-heading-cnt'> <div class='ce-key-cnt'> <input type='text' style='font-size: x-large;margin: 0;' id='` + (get("EXPL_SEARCH_INPUT_ID")) + `' autocomplete="off"> <button class='ce-words-search-btn' id='` + (get("SEARCH_BTN_ID")) + `'>Search</button> &nbsp;&nbsp;&nbsp; <h3>` + (get("words")) + `</h3> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </div> </div> </div> `
}
$t.functions['popup-cnt/tab-contents/webster-header'] = function (get) {
	return `<div class='ce-merriam-header-cnt'> <a href='https://www.merriam-webster.com/dictionary/` + (get("key")) + `' target='merriam-webster'> Merriam&nbsp;Webster&nbsp;'` + (get("key")) + `' </a> <br> <input type="text" name="" value="" list='merriam-suggestions' placeholder="Search" id='` + (get("SEARCH_INPUT_ID")) + `'> <datalist id='merriam-suggestions'> ` + (new $t('<option value=\'{{sug}}\' ></option>').render(get('scope'), 'sug in suggestions', get)) + ` </datalist> <div id='` + (get("MERRIAM_WEB_SUG_CNT_ID")) + `'` + (get("suggestions").length === 0 ? ' hidden': '') + `> No Definition Found </div> </div> `
}
$t.functions['popup-cnt/tab-contents/webster'] = function (get) {
	return `<div class='ce-merriam-cnt'> ` + (new $t('<div  class=\'ce-margin\'> <div class=\'ce-merriam-expl-card\'> <div class=\'ce-merriam-expl-cnt\'> <h3>{{item.hwi.hw}}</h3> {{new $t(\'<div  class=\\\'ce-merriam-expl\\\'> {{def}} <br><br> </div>\').render(get(\'scope\'), \'def in item.shortdef\', get)}} </div> </div> </div>').render(get('scope'), 'item in definitions', get)) + ` </div> `
}
$t.functions['-1925646037'] = function (get) {
	return `<div class='ce-merriam-expl'> ` + (get("def")) + ` <br><br> </div>`
}
$t.functions['popup-cnt/tab-contents/wikapedia'] = function (get) {
	return `<iframe class='ce-wiki-frame' src="https://en.wikipedia.org/wiki/Second_Silesian_War"></iframe> `
}
$t.functions['popup-cnt/tabs-navigation'] = function (get) {
	return `<ul class='ce-width-full ` + (get("LIST_CLASS")) + `' id='` + (get("LIST_ID")) + `'> ` + (new $t('<li  {{page.hide() ? \'hidden\' : \'\'}} class=\'{{activePage === page ? ACTIVE_CSS_CLASS : CSS_CLASS}}\'> {{page.label()}} </li>').render(get('scope'), 'page in pages', get)) + ` </ul> `
}
$t.functions['-888280636'] = function (get) {
	return `<li ` + (get("page").hide() ? 'hidden' : '') + ` class='` + (get("activePage") === get("page") ? get("ACTIVE_CSS_CLASS") : get("CSS_CLASS")) + `'> ` + (get("page").label()) + ` </li>`
}
$t.functions['questions'] = function (get) {
	return `<div class="ce-padding"> ` + (new $t('<div  question-id=\'{{question.id}}\'> <div class=\'ce-full ce-center\'> <button type="button" class=\'ce-slim-btn ce-question-answer\'>Answer</button> <button type="button" class=\'ce-slim-btn ce-question-unclear\'>Un Clear</button> <button type="button" class=\'ce-slim-btn ce-question-answered\'>Answered</button> <h3>{{question.words}}</h3> </div> {{question.elaboration}} </div>').render(get('scope'), 'question in questions', get)) + ` </div> `
}
$t.functions['tabs'] = function (get) {
	return `<div class='ce-inline ce-full' id='` + (get("TAB_CNT_ID")) + `'> <div> <div position='absolute' id='` + (get("NAV_CNT_ID")) + `'> </div> <div id='` + (get("NAV_SPACER_ID")) + `'></div> </div> <div class='ce-full'> <div position='absolute' id='` + (get("HEADER_CNT_ID")) + `'> </div> <div class='ce-full' id='` + (get("CNT_ID")) + `'> </div> </div> </div> `
}
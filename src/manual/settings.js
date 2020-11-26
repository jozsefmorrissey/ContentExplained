function loggedIn() {
  const user = CE.properties.get('user');
  return !(user === null || user === undefined);
}

class Settings {
  constructor(page) {
    const CSS_CLASS = 'ce-setting-list-item';
    const ACTIVE_CSS_CLASS = `${CSS_CLASS} ce-active-list-item`;
    const LIST_ID = 'ce-setting-list';
    const CNT_ID = 'ce-setting-cnt';
    this.pageName = function () {return page.constructor.name;}
    this.getPage = () => page;
    const instance = this;
    const li = document.createElement('li');
    const settingsCnt = document.getElementById(CNT_ID);
    const settingsList = document.getElementById(LIST_ID);

    function isActive() {
      return Settings.activePage() === instance.pageName();
    }

    this.hidden = () => page.hide();
    this.activate = function (force) {
      if (force || isActive()) {
        if (Settings.active) Settings.active.getPage().onClose();
        page.beforeOpen();
        Settings.active = instance;
        window.location.href = `${window.location.href
            .replace(Settings.urlReg, '$3')}#${instance.pageName()}`;
        li.className = ACTIVE_CSS_CLASS;
        settingsCnt.innerHTML = new CE.$t(page.template()).render(page.scope());
        page.onOpen();
        CE.properties.set('settingsPage', instance.pageName());
      }
      instance.updateMenu();
    }

    this.updateMenu = function() {
      if (!isActive()) {
        li.className = CSS_CLASS;
      }
      if (instance.hidden()) {
        li.setAttribute('hidden', true);
      } else {
        li.removeAttribute('hidden');
      }
      li.innerText = page.label();
      const listWidth = settingsList.clientWidth;
      const padding = 10;
      const settingCntPadding = listWidth + padding;
      const settingCntWidth = window.outerWidth - (listWidth + (2 * padding));
      settingsCnt.style = `padding-left: ${settingCntPadding}px;
        width: ${settingCntWidth}px`;
    }

    this.isPage = function (p) {return p === page;}
    function open () {window.location.href = `#${page.constructor.name}`;}

    this.onOpen = function () {CE.hide();};
    li.addEventListener('click', open);
    settingsList.append(li);
    Settings.settings[page.constructor.name] = this;
    this.updateMenu();
    if (isActive()) this.activate();
  }
}

Settings.settings = {};
Settings.urlReg = /(^((.*?)#)(.*)$)/;
Settings.activePage = function () {
  const pageName = window.location.href.replace(Settings.urlReg, '$4');
  return pageName.indexOf('://') === -1 ? pageName :
        Object.keys(Settings.settings)[0];
}
Settings.updateMenus = function (page) {
  const settingsPages = Object.values(Settings.settings);
  if (settingsPages.length) {
    let activeIndex = 0;
    Settings.settings[Settings.activePage()].activate(true);
    while (Settings.active === undefined || Settings.active.hidden()) {
      settingsPages[activeIndex++].activate(true);
    }
    for (let index = 0; index < settingsPages.length; index += 1) {
      const setting = settingsPages[index];
      setting.activate();
    }
  }
}

class Page {
  constructor() {
    this.label = function () {throw new Error('Must implement label()');};
    this.template = function() {throw new Error('Must implement template()');}
    this.scope = function () {return {};};
    this.onOpen = function () {};
    this.onClose = function () {};
    this.beforeOpen = function () {};
    this.hide = function() {return false;}
  }
}

class Login extends Page {
  constructor() {
    super();
    const scope = {
      LOGIN: 'Login',
      CREATE: 'create',
      CHECK: 'check',
      EMAIL_INPUT: 'ce-email-input',
      USERNAME_INPUT: 'ce-username-input',
      LOGIN_BTN_ID: 'ce-login-btn',
      REGISTER_BTN_ID: 'ce-register-btn',
      RESEND_BTN_ID: 'ce-resend-btn',
      LOGOUT_BTN_ID: 'ce-remove-btn',
    };
    const instance = this;
    let user, secret;
    scope.state = scope.LOGIN;
    this.label = function () {return 'Login';};
    this.template = function() {return 'icon-menu/links/login';};
    this.hide = function () {return CE.User.isLoggedIn();};
    this.scope = function () {return scope;};

    function setState(state) {
      return function () {
        scope.state = state;
        Settings.updateMenus();
      }
    }

    function setError(error) {
      switch (scope.state) {
        case scope.LOGIN:
          if (error.status === 404) {
            setState(scope.REGISTER)();
          } else {
            scope.errorMsg = 'Server Error';
          }
          break;
        case scope.RETISTER:
          scope.errorMsg = 'Username Taken';
          break;
        default:
          scope.errorMsg = 'Server Error';
        }
        if (error) {
          console.error(error);
      }
      Settings.updateMenus();
    }

    let lastStatus = 'expired';
    let lastUser;
    function credentialUpdated(e) {
      if (CE && CE.User && CE.User.status() !== lastStatus) {
        lastStatus = CE.User.status();
        lastUser = user;
        switch (lastStatus) {
          case 'active':
          profileSetting.activate();
          break;
          case 'pending':
          setState(scope.CHECK)();
          break;
          case 'expired':
          setState(scope.LOGIN)();
          break;
          default:
          console.error('Unknown user status')
        }
      }
    }

    function setUser(user) {
      CE.User.addCredential(user.id);
    }

    function getUser () {
      scope.email = document.getElementById(scope.EMAIL_INPUT).value;
      CE.User.get(scope.email, setUser, setError);
    }

    function register () {
      scope.username = document.getElementById(scope.USERNAME_INPUT).value;
      CE.User.register(scope.email, scope.username);
    }

    function onEnter(id, func) {
      const elem = document.getElementById(id);
      if (elem !== null) {
        elem.addEventListener('keypress', (e) => {
          if(e.key === 'Enter') func()
        });
      }
    }

    function resetErrorCall(func) {
      return function () {scope.errorMsg = undefined; func();}
    }

    this.onOpen = function () {
      credentialUpdated();
      const loginBtn = document.getElementById(scope.LOGIN_BTN_ID);
      const registerBtn = document.getElementById(scope.REGISTER_BTN_ID);
      const resendBtn = document.getElementById(scope.RESEND_BTN_ID);
      const logoutBtn = document.getElementById(scope.LOGOUT_BTN_ID);


      registerBtn.addEventListener("click", resetErrorCall(register));
      loginBtn.addEventListener("click", resetErrorCall(getUser));
      resendBtn.addEventListener("click", resetErrorCall(CE.User.addCredential));
      logoutBtn.addEventListener("click", resetErrorCall(CE.User.logout));

      onEnter(scope.EMAIL_INPUT, resetErrorCall(getUser));
      onEnter(scope.USERNAME_INPUT, resetErrorCall(register));
    }
    document.addEventListener(CE.User.errorEvent(), setError);
  }
}
new Settings(new Login());

class Profile extends Page {
  constructor() {
    super();
    const scope = {
      LOGOUT_BTN_ID: 'ce-logout-btn',
      UPDATE_BTN_ID: 'ce-update-btn',
      USERNAME_INPUT_ID: 'ce-username-input',
      CURRENT_EMAIL_INPUT_ID: 'ce-current-email-input',
      NEW_EMAIL_INPUT_ID: 'ce-new-email-input',
      UPDATE_FORM_ID: 'ce-update-form'
    };
    const updateEmailSent = 'Email sent: you must confirm changes';
    const updateFailed = 'Update request failed!'
    this.label = function () {return 'Profile';};
    this.template = function() {return 'icon-menu/links/profile';}
    this.hide = function () {return !CE.User.isLoggedIn();}
    this.scope = function () {return scope;};
    this.beforeOpen = function () {
      if (!this.hide()) {
        let user = CE.User.loggedIn();
        scope.id = user.id;
        scope.username = user.username;
        scope.likes = user.likes;
        scope.dislikes = user.dislikes;
      }
    }

    function setError(errMsg) {
      return function (err) {
        scope.importantMessage = errMsg;
        console.info(err);
        Settings.updateMenus();
      }
    }

    function update() {
      let body = {user: {}};
      body.originalEmail = document.getElementById(scope.CURRENT_EMAIL_INPUT_ID).value;
      body.user.id = CE.User.loggedIn().id;
      body.user.username = document.getElementById(scope.USERNAME_INPUT_ID).value || undefined;
      body.user.email = document.getElementById(scope.NEW_EMAIL_INPUT_ID).value || undefined;
      const url = CE.EPNTS.user.requestUpdate();
      CE.Request.post(url, body, setError(updateEmailSent), setError(updateFailed));
    }

    this.onOpen = function () {
      document.getElementById(scope.LOGOUT_BTN_ID).addEventListener("click", CE.User.logout);

      CE.Form.onSubmit(scope.UPDATE_FORM_ID, update);
      // document.getElementById(scope.UPDATE_BTN_ID).addEventListener("click", update);
    }
  }
}
const profileSetting = new Settings(new Profile());

window.onhashchange = function () {
  Settings.updateMenus();
};
document.addEventListener(CE.User.updateEvent(), Settings.updateMenus);

function getInnerState(page) {
  var stateReg = new RegExp(`^.*?#${page}:(.*)$`);
  if (window.location.href.match(stateReg)) {
    return window.location.href.replace(stateReg, "$1")
  }
}

class FavoriteLists extends Page {
  constructor() {
    super();
    this.label = function () {return 'Favorite Lists';};
    this.hide = function () {return !CE.User.isLoggedIn();}
    this.template = function() {return 'icon-menu/links/favorite-lists';}
  }
}
new Settings(new FavoriteLists());

class RawTextTool extends Page {
  constructor() {
    super();
    const scope = {
      TAB_SPACING_INPUT_ID: 'ce-tab-spcing-input-cnt-id',
      RAW_TEXT_INPUT_ID: 'ce-raw-text-input-id',
      RAW_TEXT_CNT_ID: 'ce-raw-text-input-cnt-id',
      tabSpacing: 4
    }
    const rawInputTemplate = new CE.$t('icon-menu/raw-text-input');
    const RawSCC = ShortCutCointainer('ce-raw-text-tool-cnt-id', ['r','t'], rawInputTemplate.render(scope));

    function textToHtml(text, spacing, tabSpacing) {
      const space = new Array(spacing).fill('&nbsp;').join('');
      const tab = new Array(tabSpacing).fill('&nbsp;').join('');
      return text.replace(/\n/g, '<br>')
                  .replace(/\t/g, tab)
                  .replace(/\s/g, space);
    }

    // function pulled from https://jsfiddle.net/2wAzx/13/
    function enableTab(el) {
      el.onkeydown = function(e) {
        if (e.keyCode === 9) {
          var val = this.value,
              start = this.selectionStart,
              end = this.selectionEnd;
          this.value = val.substring(0, start) + '\t' + val.substring(end);
          this.selectionStart = this.selectionEnd = start + 1;
          return false;
        }
      };
    }

    this.scope = () => scope;
    this.label = function () {return 'Raw Text Tool';};
    this.template = function() {return 'icon-menu/links/raw-text-tool';};
    this.onOpen = function () {
      document.getElementById(scope.TAB_SPACING_INPUT_ID).onchange =
            (event) => scope.tabSpacing = Number.parseInt(event.target.value);
      const textArea = document.getElementById(scope.RAW_TEXT_INPUT_ID);
      enableTab(textArea);
      const container = document.getElementById(scope.RAW_TEXT_CNT_ID);
      textArea.onkeyup = (event) => container.innerHTML =
            textToHtml(event.target.value, 1, scope.tabSpacing);
      RawSCC.unlock();
      RawSCC.show();
      RawSCC.lock();
    };
    this.onClose = function () {
      RawSCC.unlock();
      RawSCC.hide();
      RawSCC.lock();
    };
  }
}
new Settings(new RawTextTool());

class Developer extends Page {
  constructor() {
    super();
    const instance = this;
    const ENV_SELECT_ID = 'ce-env-select-id';
    let show = false;
    this.label = function () {return 'Developer';};
    this.hide = function () {return !show;}
    this.scope = () => {
      const envs = Object.keys(CE.EPNTS._envs);
      const currEnv = CE.properties.get('env');
      const debugGuiHost = CE.properties.get('debugGuiHost') || 'https://node.jozsefmorrissey.com/debug-gui';
      return {ENV_SELECT_ID, envs, currEnv, debugGuiHost};
    };
    this.template = function() {return 'icon-menu/links/developer';}
    function envUpdate() {
      const newEnv = document.getElementById(ENV_SELECT_ID).value;
      CE.properties.set('env', newEnv, true);
    }
    this.onOpen = () => {
      document.getElementById(ENV_SELECT_ID).onchange = envUpdate;
    }

    new CE.KeyShortCut('dev', () => {
      show = !show;
      if (show) {
        CE.properties.set('debug', true, true);
        Settings.settings[instance.constructor.name].activate(true);
      } else {
        CE.properties.set('debug', false, true);
        Settings.updateMenus();
      }
    });
    CE.properties.onUpdate('debug', (debug) => show = debug);
  }
}

const developerSettings = new Settings(new Developer());

function loggedIn() {
  const user = properties.get('user');
  return !(user === null || user === undefined);
}

function propertyUpdate(key, value) {
  return function (event) {
    properties.set(key, event.target.value, true)
  };
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
        const html = new $t(page.template()).render(page.scope());
        safeInnerHtml(html, settingsCnt);
        page.onOpen();
        properties.set('settingsPage', instance.pageName());
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

    this.onOpen = function () {}

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
  if (document.readyState !== "complete") return;
  
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


window.onhashchange = function () {
  Settings.updateMenus();
};
window.onload = () => document.addEventListener(User.updateEvent(), Settings.updateMenus);

function getInnerState(page) {
  var stateReg = new RegExp(`^.*?#${page}:(.*)$`);
  if (window.location.href.match(stateReg)) {
    return window.location.href.replace(stateReg, "$1")
  }
}

class Settings {
  constructor(page) {
    function update() {
      settingsCnt.innerHTML = new CE.$t(page.template()).render(page.scope());
    }
    let settingsCnt = document.getElementById('ce-settings-cnt');
    let li = document.createElement('li')
    li.className = 'ce-setting-list-item';
    li.innerText = page.label();
    li.addEventListener('click', update);
    const settingsList = document.getElementById('ce-setting-list');
    settingsList.append(li);
  }
}

class Page {
  constructor() {
    this.label = function () {throw new Error('Must implement label()');};
    this.template = function() {throw new Error('Must implement template()');}
    this.scope = function () {return {};};
  }
}

class Login extends Page {
  constructor() {
    super();
    this.label = function () {return 'Login';};
    this.template = function() {return 'icon-menu/links/login';}
  }
}
new Settings(new Login());

class Profile extends Page {
  constructor() {
    super();
    this.label = function () {return 'Profile';};
    this.template = function() {return 'icon-menu/links/profile';}
  }
}
new Settings(new Profile());

class FavoriteLists extends Page {
  constructor() {
    super();
    this.label = function () {return 'Favorite Lists';};
    this.template = function() {return 'icon-menu/links/favorite-lists';}
  }
}
new Settings(new FavoriteLists());

class RawTextTool extends Page {
  constructor() {
    super();
    this.label = function () {return 'Raw Text Tool';};
    this.template = function() {return 'icon-menu/links/raw-text-tool';}
  }
}
new Settings(new RawTextTool());

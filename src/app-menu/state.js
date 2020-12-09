// ./src/index/services/$t.js

function stateOnLoad() {
  let eventCount = 0;
  const SETTINGS_TAB_ID = 'ce-settings-tab-id';
  const menuTemplate = new $t('icon-menu/menu');
  document.addEventListener('DOMContentLoaded', function () {
    function toggleEnable(onOff) {
      return function () {
        properties.set('enabled', onOff, true);
      }
    }

    function openPage(page) {
      return function() {
        window.open(chrome.extension.getURL(page), SETTINGS_TAB_ID);
      }
    }

    function displayMenu() {
      const hoverOff = properties.get('hoverOff');
      const enabled = properties.get('enabled');
      const loggedIn = properties.get('user.status') === 'active';
      const logInOutPage = `/html/icon-menu/settings.html#${loggedIn ? 'Profile' : 'Login'}`;
      safeInnerHtml(menuTemplate.render({ enabled, hoverOff, loggedIn }), document.getElementById('control-ctn'));
      document.getElementById('login-btn').addEventListener('click', openPage(logInOutPage));
      document.getElementById('enable-btn').addEventListener('click', () => properties.toggle('enabled', true));
      document.getElementById('hover-btn').addEventListener('click', () => properties.toggle('hoverOff', true));
      document.getElementById('ce-settings').addEventListener('click', openPage("/html/icon-menu/settings.html"));
    }

    properties.set('SETTINGS_TAB_ID', SETTINGS_TAB_ID);
    properties.onUpdate(['enabled', 'hoverOff', 'user.status'], displayMenu);
  });
}

stateOnLoad();

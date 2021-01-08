
function stateOnLoad() {
  let eventCount = 0;
  const SETTINGS_TAB_ID = 'ce-settings-tab-id';
  const menuTemplate = new $t('icon-menu/menu');
  const notificationTemplate = new $t('icon-menu/notifications');
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

    function updateDropDown(html) {
      safeInnerHtml(html, document.getElementById('control-ctn'));
    }

    function displayNotifications () {
      const scope = {
        currentAlerts: Notifications.currentAlerts(),
        otherSites: Notifications.otherSites()
      }
      updateDropDown(notificationTemplate.render(scope));
      document.getElementById('back-button').addEventListener('click', displayMenu);
    }

    function displayMenu() {
      const hoverOff = properties.get('hoverOff');
      const enabled = properties.get('enabled');
      const loggedIn = properties.get('user.status') === 'active';
      const logInOutPage = `/html/settings.html#${loggedIn ? 'Profile' : 'Login'}`;
      updateDropDown(menuTemplate.render({ enabled, hoverOff, loggedIn }));
      document.getElementById('login-btn').addEventListener('click', openPage(logInOutPage));
      document.getElementById('enable-btn').addEventListener('click', () => properties.toggle('enabled', true));
      document.getElementById('hover-btn').addEventListener('click', () => properties.toggle('hoverOff', true));
      document.getElementById('settings').addEventListener('click', openPage("/html/settings.html"));
      document.getElementById('notifications').addEventListener('click', displayNotifications);
    }

    properties.onUpdate(['enabled', 'hoverOff', 'user.status'], displayMenu);
  });
}

stateOnLoad();

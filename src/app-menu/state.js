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

    function displayMenu(enabled) {
      safeInnerHtml(menuTemplate.render({ enabled }), document.getElementById('control-ctn'));
      document.getElementById('enable-btn').addEventListener('click', toggleEnable(true));
      document.getElementById('disable-btn').addEventListener('click', toggleEnable(false));
      document.getElementById('ce-settings').addEventListener('click', openPage("/html/icon-menu/settings.html#Login"));
    }

    properties.set('SETTINGS_TAB_ID', SETTINGS_TAB_ID);
    properties.onUpdate('enabled', displayMenu);
  });
}

stateOnLoad();

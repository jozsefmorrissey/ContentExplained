
function stateOnLoad() {
  let eventCount = 0;
  const settingsPage = "/html/icon-menu/settings.html";
  const SETTINGS_TAB_ID = 'ce-settings-tab-id';
  const menuTemplate = new CE.$t('icon-menu/menu');
  document.addEventListener('DOMContentLoaded', function () {
    function toggleEnable(onOff) {
      return function () {
        if (onOff === undefined) {
          onOff = CE.properties.get('enabled');
        } else {
          CE.properties.set('enabled', onOff, true);
        }
      }
    }

    function openPage(page) {
      return function() {
        chrome.tabs.executeScript({
          code: 'console.log("here", '+ eventCount++ +');'
        });
        window.open(page, SETTINGS_TAB_ID);
      }
    }

    function displayMenu() {
      const enabled = CE.properties.get('enabled');
      const loggedIn = CE.properties.get('loggedIn');
      const settingsPage = CE.properties.get('settingsPage');
      const SETTINGS_TAB_ID = CE.properties.get('SETTINGS_TAB_ID');
      chrome.tabs.executeScript({
        code: 'console.log("sPage:", '+ settingsPage +');'
      });
      document.getElementById('control-ctn').innerHTML = menuTemplate.render({ enabled, loggedIn });
      document.getElementById('enable-btn').addEventListener('click', toggleEnable(true));
      document.getElementById('disable-btn').addEventListener('click', toggleEnable(false));
      document.getElementById('ce-settings').addEventListener('click', openPage(`${settingsPage}`));
      document.getElementById('login-btn').addEventListener('click', openPage(`${settingsPage}#Login`));
      document.getElementById('logout-btn').addEventListener('click', openPage(`${settingsPage}#Profile`));
    }

    CE.properties.onUpdate(['enabled', 'loggedIn', 'settingsPage', 'SETTINGS_TAB_ID'],
    	displayMenu);
  });
}


stateOnLoad();

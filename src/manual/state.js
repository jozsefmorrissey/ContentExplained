
function stateOnLoad() {
  let eventCount = 0;
  const TEXT_TO_HTML_NAME = 'text-to-html-page-identifier';
  const menuTemplate = new CE.$t('icon-menu/menu');
  document.addEventListener('DOMContentLoaded', function () {
    function toggleEnable(onOff) {
      return function () {
        CE.properties.set('enabled', onOff, true);
        document.getElementById('control-ctn').innerHTML = menuTemplate.render({ enabled: onOff });

        document.getElementById('enable-btn').addEventListener('click', toggleEnable(true));
        document.getElementById('disable-btn').addEventListener('click', toggleEnable(false));
        document.getElementById('ce-settings').addEventListener('click', openPage("/html/icon-menu/settings.html"));
        chrome.tabs.executeScript({
          code: 'console.log("here", '+ eventCount++ +');'
        });
      }
      chrome.tabs.executeScript({
        code: 'console.log("here", '+ eventCount++ +');'
      });    }

    function openPage(page) {
      return function() {
        chrome.tabs.executeScript({
          code: 'console.log("here", '+ eventCount++ +');'
        });
        window.open(chrome.extension.getURL(page), TEXT_TO_HTML_NAME);
      }
    }

    function displayMenu(enabled) {
      document.getElementById('control-ctn').innerHTML = menuTemplate.render({ enabled });
      document.getElementById('enable-btn').addEventListener('click', toggleEnable(true));
      document.getElementById('disable-btn').addEventListener('click', toggleEnable(false));
    }

    displayMenu(CE.properties.get('enabled'));
  });
}

stateOnLoad();

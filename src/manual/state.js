
function stateOnLoad() {
  let eventCount = 0;
  const TEXT_TO_HTML_NAME = 'text-to-html-page-identifier';
  const menuTemplate = new CE.$t('icon-menu/menu');
  document.addEventListener('DOMContentLoaded', function () {
    function toggleEnable(onOff) {
      return function () {
        chrome.storage.local.set({ enabled: onOff });
        document.getElementById('control-ctn').innerHTML = menuTemplate.render({ enabled: onOff });

        document.getElementById('enable-btn').addEventListener('click', toggleEnable(true));
        document.getElementById('disable-btn').addEventListener('click', toggleEnable(false));

        chrome.tabs.executeScript({
          code: 'console.log('+ eventCount++ +');'
        });
      }
      chrome.tabs.executeScript({
        code: 'console.log('+ eventCount++ +');'
      });
    }

    function openPage(page) {
      return function() {
        window.open(chrome.runtime.getURL(page), TEXT_TO_HTML_NAME);
      }
    }

    function displayMenu(props) {
      document.getElementById('control-ctn').innerHTML = menuTemplate.render({ enabled: props.enabled });
      const nblBtn = document.getElementById('enable-btn');
      chrome.tabs.executeScript({
        // code: 'console.log("len: " + ' + document.getElementById('text-to-html-btn') + ');'
        code: 'console.log("len: " + "' + nblBtn + '");'
      });
      document.getElementById('enable-btn').addEventListener('click', toggleEnable(true));
      document.getElementById('disable-btn').addEventListener('click', toggleEnable(false));
      document.getElementById('ce-settings').addEventListener('click', openPage("/html/icon-menu/settings.html"));
    }

    chrome.storage.local.get(['enabled'], displayMenu);
  });

  chrome.storage.local.set({ state2: Math.random() });
}

stateOnLoad();

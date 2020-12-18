let Background = function () {
const afterLoad = []
// chrome.contextMenus.removeAll();
// chrome.contextMenus.create({
//       title: "first",
//       contexts: ["browser_action"],
//       onclick: function() {
//         alert('first');
//       }
// });

// chrome.browserAction.onClicked.addListener(function () {console.log('clicked!');});

const settingsPage = chrome.extension.getURL("/html/icon-menu/settings.html");
const SETTINGS_TAB_ID = 'ce-settings-tab-id';
chrome.storage.local.set({settingsPage, SETTINGS_TAB_ID});

// chrome.tabs.create({ url: "/html/icon-menu/settings.html" });

// chrome.tabs.executeScript({
//   code: 'console.log("here");'
// });
;
return {afterLoad};
        }
        try {
          Background = Background();
          Background.afterLoad.forEach((item) => {item();});
        } catch (e) {
            console.log(e);
        }
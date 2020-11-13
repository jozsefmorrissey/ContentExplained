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

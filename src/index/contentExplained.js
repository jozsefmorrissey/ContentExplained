// ./src/index/properties.js

function search() {
  function lookup(searchWords) {
    searchWords = searchWords.trim().toLowerCase();
    if (searchWords) {
      lookupHoverResource.show();
      if (searchWords !== properties.get('searchWords') && searchWords.length < 64) {
        properties.set('searchWords', searchWords);
        lookupTabs.update();
      }
    }
  }

  function checkHighlight(e) {
    const selection = window.getSelection().toString().replace(/&nbsp;/, '');
    // Google Doc selection.
    // document.querySelector('.kix-selection-overlay')
    if (properties.get('enabled') && selection) {
      lookup(selection);
      window.getSelection().removeAllRanges();
      e.stopPropagation();
      e.preventDefault();
    }
  }

  function toggleEnable() {
    const enabled = properties.get('enabled');
    properties.set('enabled', !enabled, true);
  }

  new KeyShortCut(['c','e'], toggleEnable);

  document.addEventListener( "contextmenu", checkHighlight);
  properties.onUpdate('env', EPNTS.setHost);
}


properties.onUpdate(['debug', 'debugGuiHost', 'enabled'], () => {
  const debug = properties.get('debug');
  const enabled = properties.get('enabled');
  const host = properties.get('debugGuiHost') || 'https://localhost:3001/debug-gui';
  const id = properties.get('debugGuiId');
  if (debug && enabled) {
    const root = 'context-explained-ui';
    const cookieExists = document.cookie.match(/DebugGui=/);
    dg.updateConfig({root, host, id, debug: true});
  } else if (dg) {
    dg.updateConfig({debug: false});
  }
});

afterLoad.push(search);

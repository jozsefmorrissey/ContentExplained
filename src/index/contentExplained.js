// ./src/index/properties.js

const jsAttrReg = / on[a-zA-Z]*\s*=/g;
function safeInnerHtml(text, elem) {
  if (text === undefined) return undefined;
  const clean = text.replace(/<script[^<]*?>/, '').replace(jsAttrReg, '');
  if (clean !== text) throw Error('ddddddddiiiiiiiiiiiiiirrrrrrrrrrrrtttttttttttty');
  if (elem !== undefined) elem.innerHTML = clean;
  return clean;
}

function safeOuterHtml(text, elem) {
  const clean = safeInnerHtml(text);
  if (elem !== undefined) elem.outerHTML = clean;
  return clean;
}

const space = new Array(1).fill('&nbsp;').join('');
const tabSpacing = new Array(2).fill('&nbsp;').join('');
function textToHtml(text) {
  safeInnerHtml(text);
  return text.replace(/\n/g, '<br>')
              .replace(/\t/g, tabSpacing)
              .replace(/<script[^<]*?>/, '')
              .replace(jsAttrReg, '')
              .replace(/\(([^\(^\)]*?)\)\s*\[([^\]\[]*?)\]/g,
                      '<a target=\'blank\' href="$2">$1</a>');
}

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
  CE.lookup = lookup;
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
    CE.dg.updateConfig({root, host, id, debug: true});
  } else if (CE.dg) {
    CE.dg.updateConfig({debug: false});
  }
});

afterLoad.push(search);

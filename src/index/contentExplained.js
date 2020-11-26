
const jsAttrReg = /(onafterprint|onbeforeprint|onbeforeunload|onerror|onhashchange|onload|onmessage|onoffline|ononline|onpagehide|onpageshow|onpopstate|onresize|onstorage|onunload|onblur|onchange|oncontextmenu|onfocus|oninput|oninvalid|onreset|onsearch|onselect|onsubmit|onkeydown|onkeypress|onkeyup|onclick|ondblclick|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onmousewheel|onwheel|ondrag|ondragend|ondragenter|ondragleave|ondragover|ondragstart|ondrop|onscroll|oncopy|oncut|onpaste|onabort|oncanplay|oncanplaythrough|oncuechange|ondurationchange|onemptied|onended|onerror|onloadeddata|onloadedmetadata|onloadstart|onpause|onplay|onplaying|onprogress|onratechange|onseeked|onseeking|onstalled|onsuspend|ontimeupdate|onvolumechange|onwaiting|ontoggle)\s*=/g

const space = new Array(1).fill('&nbsp;').join('');
const tabSpacing = new Array(2).fill('&nbsp;').join('');
function textToHtml(text) {
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

  document.addEventListener( "contextmenu", checkHighlight);
  CE.lookup = lookup;
  properties.onUpdate('env', EPNTS.setHost);
}


properties.onUpdate(['debug', 'debugGuiHost'], () => {
  const debug = properties.get('debug');
  const host = properties.get('debugGuiHost') || 'https://localhost:3001/debug-gui';
  if (debug) {
    const root = 'context-explained-ui';
    const id = 'timmys';
    const cookieExists = document.cookie.match(/DebugGui=/);
    CE.dg.softUpdate({debug, root, id, host});
    if (!cookieExists) window.location.reload();
  } else if (CE.dg) {
    CE.dg.updateConfig({debug});
  }
});

afterLoad.push(search);

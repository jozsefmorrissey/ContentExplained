
const space = new Array(1).fill('&nbsp;').join('');
const tabSpacing = new Array(2).fill('&nbsp;').join('');
function textToHtml(text) {
  return text.replace(/\n/g, '<br>')
              .replace(/\t/g, tabSpacing)
              .replace(/<script>/, '')
              .replace(/\(([^\(^\)]*?)\)\s*\[([^\]\[]*?)\]/g,
                      '<a target=\'blank\' href="$2">$1</a>');
}

function search() {
  // let built = false;
  // function buildUi(data) {
  //   built = true;
  //   UI.id = UI_ID;
  //   UI.style = `position: fixed;
  //               width: 100%;
  //               height: 30%;
  //               top: 0px;
  //               left: 0px;
  //               text-align: center;
  //               display: none;
  //               z-index: 999;
  //               background-color: whitesmoke;
  //               overflow: auto;
  //               border-style: outset;
  //               border-width: 1pt;`;
  // }

  function goTo(searchWords) {
    return function() {
      lookup(searchWords);
    }
  }

  function lookup(searchWords) {
    searchWords = searchWords.trim().toLowerCase();
    if (searchWords) {
      lookupHoverResource.show();
      if (searchWords !== CE.properties.get('searchWords') && searchWords.length < 64) {
        properties.set('searchWords', searchWords);
        lookupTabs.update();
      }
    }
  }

  function onHighlight(e) {
    const selection = window.getSelection().toString().replace(/&nbsp;/, '');
    // Google Doc selection.
    // document.querySelector('.kix-selection-overlay')
    if (CE.properties.get('enabled') && selection) {
      lookup(selection);
      window.getSelection().removeAllRanges();
      e.stopPropagation();
    }
  }

  function enableToggled(enabled) {
    if (enabled) {
      if (!built) {
        buildUi()
      }
    }
  }

  document.onmouseup = onHighlight;
  CE.lookup = lookup;
}

afterLoad.push(search);

// ./src/index/properties.js

const lengthLimit = 64;
function search() {
  function lookup(searchWords) {
    searchWords = searchWords.trim().toLowerCase();
    if (searchWords) {
      lookupHoverResource.show();
      if (searchWords !== properties.get('searchWords'))
      if(searchWords.length < lengthLimit) {
        history.push(searchWords);
        properties.set('searchWords', searchWords);
        lookupTabs.update();
      } else if (searchWords.length > lengthLimit) {
        alert('Sorry you have exceeded the character limit of ' + lengthLimit);
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

  document.addEventListener( "contextmenu", checkHighlight);
}

afterLoad.push(search);

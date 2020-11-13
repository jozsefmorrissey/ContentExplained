
class RawText {
  constructor () {
    // TODO: implement only show when on proper edit page.
    function show() {return true;}
    let text = '';



    const tab = new Tab(URL_IMAGE_TXT, RAW_TEXT_CNT_ID,
            'popup-cnt/tab-contents/raw-text-input', show);

    const space = new Array(1).fill('&nbsp;').join('');
    const tabSpacing = new Array(2).fill('&nbsp;').join('');
    function textToHtml(text) {
      return text.replace(/\n/g, '<br>').replace(/\s/g, space)
                  .replace(/\t/g, tabSpacing);
    }

    function writeChanges() {
      const container = document.getElementById('ce-raw-text-input-cnt-id')
      container.innerHTML = textToHtml(text);
    }

    function onKeyup (event) {
      if (event.target.id === 'ce-raw-text-input-id') {
        text = event.target.value;
        writeChanges();
      }
    }
    function onChange (event) {
      if (event.target.id === 'ce-raw-text-input-id') {
        text = event.target.value;
        writeChanges();
        CE.refresh();
      }
    }

    function settingsPageChange (settingsPage) {
      if (settingsPage === 'RawTextTool') {
        writeChanges();
      }
    }

    CE.properties.onUpdate('settingsPage', settingsPageChange);
    document.addEventListener('keyup', onKeyup);
    document.addEventListener('paste', onKeyup);
    document.addEventListener('change', onChange);
  }
}

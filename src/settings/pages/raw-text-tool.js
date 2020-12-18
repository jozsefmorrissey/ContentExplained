
class RawTextTool extends Page {
  constructor() {
    super();
    const scope = {
      TAB_SPACING_INPUT_ID: 'ce-tab-spcing-input-cnt-id',
      RAW_TEXT_INPUT_ID: 'ce-raw-text-input-id',
      RAW_TEXT_CNT_ID: 'ce-raw-text-input-cnt-id',
      tabSpacing: 4
    }
    const rawInputTemplate = new $t('icon-menu/links/raw-text-input');
    const RawSCC = ShortCutContainer('ce-raw-text-tool-cnt-id', ['r','t'], rawInputTemplate.render(scope));

    function textToHtml(text, spacing, tabSpacing) {
      if (text === undefined) return '';
      const space = new Array(spacing).fill('&nbsp;').join('');
      const tab = new Array(tabSpacing).fill('&nbsp;').join('');
      return text.replace(/\n/g, '<br>')
                  .replace(/\t/g, tab)
                  .replace(/\s/g, space);
    }

    // function pulled from https://jsfiddle.net/2wAzx/13/
    function enableTab(el) {
      el.onkeydown = function(e) {
        if (e.keyCode === 9) {
          var val = this.value,
              start = this.selectionStart,
              end = this.selectionEnd;
          this.value = val.substring(0, start) + '\t' + val.substring(end);
          this.selectionStart = this.selectionEnd = start + 1;
          return false;
        }
      };
    }

    this.scope = () => scope;
    this.label = function () {return 'Raw Text Tool';};
    this.template = function() {return 'icon-menu/links/raw-text-tool';};
    this.onOpen = function () {
      document.getElementById(scope.TAB_SPACING_INPUT_ID).onchange =
            (event) => scope.tabSpacing = Number.parseInt(event.target.value);
      const textArea = document.getElementById(scope.RAW_TEXT_INPUT_ID);
      enableTab(textArea);
      const container = document.getElementById(scope.RAW_TEXT_CNT_ID);
      const html = textToHtml(event.target.value, 1, scope.tabSpacing);
      textArea.onkeyup = (event) => safeInnerHtml(html, container)
      RawSCC.unlock();
      RawSCC.show();
      RawSCC.lock();
    };
    this.onClose = function () {
      RawSCC.unlock();
      RawSCC.hide();
      RawSCC.lock();
    };
  }
}
new Settings(new RawTextTool());

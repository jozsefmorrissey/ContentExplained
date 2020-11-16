
class AddInterface {
  constructor () {
    const instance = this;
    let content = '';
    let words = '';
    this.ADD_EDITOR_CNT_ID = 'ce-add-editor-cnt-id';
    this.ADD_EDITOR_ID = 'ce-add-editor-id';
    this.ADD_EDITOR_TOGGLE_BTN = 'ce-add-editor-toggle-btn-id';
    this.SUBMIT_EXPL_BTN_ID = 'ce-add-editor-add-expl-btn-id';
    let updatePending = false;

    function initContent(userContent) {
      if (content === '' && (typeof userContent) === 'string') {
        content = userContent;
        updateDisplay()
      }
    }

    function addExplSuccessful() {
      toggleDisplay(false);
    }

    function addExplanation() {
      const url = EPNTS.explanation.add();
      Request.post(url, {words, content, siteUrl: window.location.href}, addExplSuccessful);
    }

    function updateDisplay () {
      if (instance.inputElem !== undefined) {
        instance.inputElem.value = content;
        const ceUi = document.getElementById('ce-ui');
        HoverResources.positionText(ceUi, {words, content});
      }
    }

    this.update = (newWords) => {
      words = newWords || words;
      instance.inputElem = document.getElementById(this.ADD_EDITOR_ID);
      instance.inputCnt = document.getElementById(this.ADD_EDITOR_CNT_ID);
      instance.toggleButton = document.getElementById(this.ADD_EDITOR_TOGGLE_BTN);
      instance.addExplBtn = document.getElementById(this.SUBMIT_EXPL_BTN_ID);
      instance.inputElem.addEventListener('keyup', onChange);
      instance.inputElem.addEventListener('blur', HoverResources.close);
      instance.toggleButton.addEventListener('click', toggleDisplay);
      instance.addExplBtn.addEventListener('click', addExplanation);
      instance.updateDisplay(content);
    }
    instance.updateDisplay = updateDisplay;

    function onChange(e) {
      content = (typeof e.target.value) === "string" ? e.target.value : content;
      properties.set('userContent', content, true)
      updateDisplay();
    }

    let show;
    function toggleDisplay(value) {
      show = (typeof value) === "boolean" ? value : !show;
      if (show) {
        instance.update();
        instance.inputCnt.style.display = 'block';
      } else {
        instance.inputCnt.style.display = 'none';
      }
    }
    this.toggleDisplay = toggleDisplay;
    properties.onUpdate('userContent', initContent);
  }
}

AddInterface = new AddInterface();

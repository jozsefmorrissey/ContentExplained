
class AddInterface extends Page {
  constructor () {
    super();
    const template = new $t('popup-cnt/tab-contents/add-explanation');
    const instance = this;
    let content = '';
    let words = '';
    const ADD_EDITOR_CNT_ID = 'ce-add-editor-cnt-id';
    const ADD_EDITOR_ID = 'ce-add-editor-id';
    const SUBMIT_EXPL_BTN_ID = 'ce-add-editor-add-expl-btn-id';
    let updatePending = false;

    function getScope() {
      return {
        ADD_EDITOR_CNT_ID, ADD_EDITOR_ID, SUBMIT_EXPL_BTN_ID,
        words: properties.get('searchWords')
      }
    }

    this.hide = () => true;
    this.label = () => `<button class='ce-btn ce-add-btn'>+</button>`;
    this.html = () => template.render(getScope());

    function initContent(userContent) {
      if (content === '' && (typeof userContent) === 'string') {
        content = userContent;
        updateDisplay()
      }
    }

    function addExplSuccessful(expl) {
      HoverExplanations.add(expl);
      properties.set('userContent', '', true)
      content = '';
    }

    function addExplanation() {
      const url = EPNTS.explanation.add();
      Request.post(url, {words, content, siteUrl: window.location.href}, addExplSuccessful);
    }

    function updateDisplay () {
      if (instance.inputElem !== undefined) {
        instance.inputElem.value = content;
        lookupHoverResource.minimize();
        lookupHoverResource.setCss({maxHeight: '50%', width: '75%', height: '50%'})
        lookupHoverResource.center().bottom();
        HoverExplanations.display({words, content}, lookupHoverResource.container()).center().top();
        HoverExplanations.keepOpen();
      }
    }

    this.afterOpen = (newWords) => {
      words = properties.get('searchWords');
      instance.inputElem = document.getElementById(ADD_EDITOR_ID);
      instance.inputCnt = document.getElementById(ADD_EDITOR_CNT_ID);
      instance.addExplBtn = document.getElementById(SUBMIT_EXPL_BTN_ID);
      instance.inputElem.addEventListener('keyup', onChange);
      // instance.inputElem.addEventListener('blur', HoverExplanations.close);
      instance.addExplBtn.addEventListener('click', addExplanation);
      HoverExplanations.display({words, content}, lookupHoverResource.container()).center().top();
      instance.updateDisplay();
    }
    instance.updateDisplay = updateDisplay;

    function onChange(e) {
      content = (typeof e.target.value) === "string" ? e.target.value : content;
      properties.set('userContent', content, true)
      updateDisplay();
    }

    properties.onUpdate('userContent', initContent);
  }
}

AddInterface = new AddInterface();
lookupTabs.add(AddInterface, 2);

class AddInterface extends Page {
  constructor () {
    super();
    const template = new $t('popup-cnt/tab-contents/add-explanation');
    const instance = this;
    let content = '';
    let words = '';
    let url = '';
    let writingJs = false;
    const ADD_EDITOR_CNT_ID = 'ce-add-editor-cnt-id';
    const ADD_EDITOR_ID = 'ce-add-editor-id';
    const SUBMIT_EXPL_BTN_ID = 'ce-add-editor-add-expl-btn-id';
    let updatePending = false;
    const editHoverExpl = new HoverExplanations({hideClose: true});
    const dragDropResize = new DragDropResize({getDems, setDems, position: 'fixed'});

    function getScope() {
      return {
        ADD_EDITOR_CNT_ID, ADD_EDITOR_ID, SUBMIT_EXPL_BTN_ID,
        writingJs,
        words
      }
    }

    this.hide = () => true;
    this.label = () => `<button class='ce-btn ce-add-btn'>+</button>`;
    this.html = () => template.render(getScope());

    function initContent(userContent) {
      if (content === '' && (typeof userContent) === 'string') {
        content = userContent;
        if (instance.inputElem !== undefined) {
          instance.inputElem.value = content;
          instance.inputElem.focus();
          editHoverExpl.display({words, content: content},
                dragDropResize.container());
        }
      }
    }

    function addExplSuccessful(expl) {
      hoverExplanations.add(expl);
      properties.set('userContent', '', true)
      content = '';
    }

    function addExplanation() {
      const url = EPNTS.explanation.add();
      Request.post(url, {words, content, siteUrl: window.location.href}, addExplSuccessful);
    }

    let ignoreChange = false;
    function onChange(event) {
      if (ignoreChange) { ignoreChange = false; return;}
      let isWritingjs = false;
      try {
        if ((typeof event.target.value) === 'string') {
          editHoverExpl.display({words, content: event.target.value},
                dragDropResize.container());
          content = event.target.value;
        }
      } catch (error) {
        isWritingjs = true;
        ignoreChange = true;
        instance.inputElem.value = error.clean;
      }
      if (writingJs !== isWritingjs) {
        writingJs = isWritingjs;
      }
      properties.set('userContent', content, true)
    }

    function bottomFull() {
      return {width: '100vw', height: '75vh'};
    }

    function close() {
      editHoverExpl.unlockOpen();
      editHoverExpl.close();
    }
    this.close = close;

    function open(w, u) {
      words = w || words;
      url = u || url;
      dragDropResize.show()
        .setCss(bottomFull())
        .updateContent(instance.html())
        .center().bottom();
      instance.inputElem = document.getElementById(ADD_EDITOR_ID);
      instance.inputCnt = document.getElementById(ADD_EDITOR_CNT_ID);
      instance.addExplBtn = document.getElementById(SUBMIT_EXPL_BTN_ID);
      instance.inputElem.addEventListener('keyup', onChange);
      // instance.inputElem.addEventListener('blur', editHoverExpl.close);
      instance.addExplBtn.addEventListener('click', addExplanation);


      editHoverExpl.display({words, content}).elem(dragDropResize.container()).center().top();
      editHoverExpl.lockOpen();
    }
    this.open = open;
    this.toggle = () => dragDropResize.hidden() ? instance.open() : dragDropResize.close();

    dragDropResize.onClose(close);
    properties.onUpdate('userContent', initContent);
  }
}


AddInterface = new AddInterface();
AddInterface.open('poopLuck');
new KeyShortCut('ca', AddInterface.toggle);

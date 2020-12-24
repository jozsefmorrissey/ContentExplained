
class AddInterface extends Page {
  constructor () {
    super();
    const template = new $t('popup-cnt/tab-contents/add-explanation');
    const instance = this;
    let content = '';
    let id = '';
    let words = '';
    let url = '';
    let writingJs = false;
    let editedWords = [];
    let changingTarget = false;
    let expl;
    const ADD_EDITOR_CNT_ID = 'ce-add-editor-cnt-id';
    const ADD_EDITOR_ID = 'ce-add-editor-id';
    const SUBMIT_EXPL_BTN_ID = 'ce-add-editor-add-expl-btn-id';
    const UPDATE_EXPL_BTN_ID = 'ce-add-editor-update-expl-btn-id';
    const WORDS_INPUT_ID = 'ce-add-editor-words-input-id';
    let updatePending = false;
    const editHoverExpl = new HoverExplanations({hideClose: true, position: 'fixed', hover: false});
    const dragDropResize = new DragDropResize({getDems, setDems, position: 'fixed'});

    function getScope() {
      const u = url === window.location.href ? undefined : url;
      return {
        ADD_EDITOR_CNT_ID, ADD_EDITOR_ID, SUBMIT_EXPL_BTN_ID, WORDS_INPUT_ID,
        UPDATE_EXPL_BTN_ID,
        writingJs, words, content, url: u, id, editedWords
      }
    }

    this.hide = () => true;
    this.label = () => `<button class='ce-btn ce-add-btn'>+</button>`;
    this.html = () => template.render(getScope());

    function initContent(w, clean) {
        words = w || words;
        const userContent = properties.get('userContent') || {};
        editedWords = Object.keys(userContent);
        if (userContent[words] !== undefined) {
          content = userContent[words].content;
          url = userContent[words].url;
          id = userContent[words].id;
        } else if (clean) {
          content = '';
          url = window.location.href;
          id = undefined;
        }

        if (instance.addExplBtn !== undefined) {
          instance.addExplBtn.hidden = id !== undefined;
          instance.updateExplBtn.hidden = id === undefined;
        }
    }

    function save() {
      let userContent = properties.get('userContent');
      if ((typeof userContent) !== 'object') userContent = {};
      console.log('saving');
      if (content) {
        userContent[words] = {content, url, id};
      } else {
        delete userContent[words];
      }
      properties.set('userContent', userContent, true)
    }

    function addExplSuccessful(expl) {
      hoverExplanations.add(expl);
      content = '';
      save();
      dragDropResize.close();
    }

    function updateExplSuccessful() {
      expl.content = content;
      hoverExplanations.update(expl);
      content = '';
      save();
      dragDropResize.close();
    }

    function addExplanation() {
      const url = EPNTS.explanation.add();
      Request.post(url, {words, content, siteUrl: window.location.href}, addExplSuccessful);
    }

    function updateExplanation() {
      const url = EPNTS.explanation.update();
      Request.put(url, {content, id: expl.id}, updateExplSuccessful);
    }

    let pendingSave = false;
    let lastSave = new Date().getTime();
    function autoSave() {
      const time = new Date().getTime();
      if (time - 15000 > lastSave) {
        save();
        lastSave = time;
      } else if (!pendingSave) {
        console.log('pending')
        pendingSave = true;
        setTimeout(() => { pendingSave = false; autoSave() }, 15000);
      }
    }

    let ignoreChange = false;
    function onChange(event) {
      if (changingTarget) return;
      if (ignoreChange) { ignoreChange = false; return; }
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
      autoSave();
    }

    function bottomFull() {
      return {width: '100vw', height: '75vh'};
    }

    function close() {
      editHoverExpl.unlockOpen();
      editHoverExpl.close();
    }
    this.close = close;

    function editTargetUpdate(e) {
      changingTarget = true;
      save();
      initContent(e.target.value, true);
      instance.inputElem.value = content;
      editHoverExpl.display({words, content});
    }

    function open(w, urlOid) {
      if ((typeof w) === 'string') {
        initContent(w, true);
        url = urlOid || url;
      } else if (w instanceof Object) {
        expl = w;
        id = expl.id;
        initContent(words);
        words = expl.words;
        content = content || expl.content;
      }
      dragDropResize.show()
        .setCss(bottomFull())
        .updateContent(instance.html())
        .center().bottom();
      instance.inputElem = document.getElementById(ADD_EDITOR_ID);
      instance.inputElem.value = content;
      instance.inputCnt = document.getElementById(ADD_EDITOR_CNT_ID);
      instance.addExplBtn = document.getElementById(SUBMIT_EXPL_BTN_ID);
      instance.updateExplBtn = document.getElementById(UPDATE_EXPL_BTN_ID);
      instance.wordsInput = document.getElementById(WORDS_INPUT_ID);
      instance.wordsInput.addEventListener('keyup', editTargetUpdate);
      instance.inputElem.addEventListener('keyup', onChange);
      instance.inputElem.addEventListener('focus', () => changingTarget = false);
      // instance.inputElem.addEventListener('blur', editHoverExpl.close);
      instance.addExplBtn.addEventListener('click', addExplanation);
      instance.updateExplBtn.addEventListener('click', updateExplanation);


      editHoverExpl.display({words, content}).elem(dragDropResize.container()).center().top();
      editHoverExpl.lockOpen();
    }
    this.open = open;
    this.toggle = () => dragDropResize.hidden() ? instance.open() : dragDropResize.close();

    dragDropResize.onClose(close);
  }
}


AddInterface = new AddInterface();
// AddInterface.open('poopLuck');
new KeyShortCut('ca', AddInterface.toggle);


let CONTEXT_EXPLAINED;

function search() {
  let explanations = new Explanations();

  let definitions = {
    if: "conditional",
    is: "to be or not to be",
    the: "come on man"
  };

  let word;

  function addDefinition(definition) {
    definitions[word] = definition;
  }

  function topNodeText(el) {
    child = el.firstChild,
    texts = [];

    while (child) {
      if (child.nodeType == 3) {
        texts.push(child.data);
      }
      child = child.nextSibling;
    }

    return texts.join("");
  }

  function findWord(word) {
    return Array.from(document.querySelectorAll('*'))
    .filter(el => topNodeText(el).match(new RegExp(word, 'i')));
  }

  function buildUi(props) {
    document.onmouseup = onHighlight;
    CONTEXT_EXPLAINED = props;
    if (props.enabled) {
      new HoverResources(data);
      UI.id = UI_ID;
      UI.style = `position: fixed;
      width: 100%;
      height: 30%;
      top: 0px;
      left: 0px;
      text-align: center;
      display: none;
      z-index: 999;
      background-color: whitesmoke;
      overflow: auto;
      border-style: outset;
      border-width: 1pt;`;
    }
  }

  function openDictionary(word) {
    return function() {
      lookup(word);
      CE.showTab(1);
    }
  }

  function setDictionary(merriamWebObj) {
    const sugCnt = document.getElementById(MERRIAM_WEB_SUG_CNT_ID);
    document.getElementById(MERRIAM_WEB_DEF_CNT_ID).innerHTML = merriamWebObj.defHtml || '';
    sugCnt.innerHTML = merriamWebObj.suggestionHtml || '';
    const spans = sugCnt.querySelectorAll('span');
    for (let index = 0; index < spans.length; index += 1) {
      spans[index].addEventListener('click', openDictionary(spans[index].innerText.trim()));
    }
  }

  function setExplanation(explanations) {
    const scope = {};
    tagObj = {}
    explanations.forEach(function (expl) {
      expl.tags.forEach(function (tag) {
        tagObj[tag] = true;
      });
    });
    scope.allTags = Object.keys(tagObj);
    scope.words = explanations[0].words;
    scope.explanations = explanations;
    scope.ADD_EDITOR_ID = ADD_EDITOR_ID;
    console.log(explanations)
    console.log(scope);
    document.getElementById(CONTEXT_EXPLANATION_CNT_ID).innerHTML =
        new $t('popup-cnt/tab-contents/explanation-cnt').render(scope);
    new AddInterface();
  }

  function setAddition(request) {
    const scope = {};
    tagObj = {}
    scope.words = request.responseURL.replace(/.*\/(.*)/, '$1');
    scope.ADD_EDITOR_ID = ADD_EDITOR_ID;
    document.getElementById(CONTEXT_EXPLANATION_CNT_ID).innerHTML =
        new $t('popup-cnt/tab-contents/explanation-cnt').render(scope);
    new AddInterface().toggleDisplay(true);
  }

  const historyTemplate = new $t('popup-cnt/linear-tab');
  let history = [];
  function setHistory(word) {
    history = history.filter((value) => value !== word);
    const sugCnt = document.getElementById(HISTORY_CNT_ID);
    sugCnt.innerHTML = historyTemplate.render(history.reverse());
    const spans = sugCnt.querySelectorAll('span');
    for (let index = 0; index < spans.length; index += 1) {
      spans[index].addEventListener('click', openDictionary(spans[index].innerText.trim()));
    }
    history.reverse();
    history.push(word);
  }

  function lookup(word) {
    setHistory(word);
    const trimmed = word.trim().toLowerCase();
    if (trimmed) {
      explanations.get(trimmed, setExplanation, setAddition);
      new MerriamWebster(trimmed, setDictionary);
    }
    UI.show();
  }

  function onHighlight(e) {
    const selection = window.getSelection().toString()
    // Google Doc selection.
    // document.querySelector('.kix-selection-overlay')
    if (selection) {
      lookup(selection);
      e.stopPropagation();
    }
  }

  function print(val) {
    if (val.enabled && val.enabled !== CONTEXT_EXPLAINED.enabled) {
      window.location.reload()
    }
  }

  chrome.storage.local.get(['enabled'], buildUi);
  CE.lookup = lookup;
}

afterLoad.push(search);

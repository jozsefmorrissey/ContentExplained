const UI_ID = 'ce-ui';
const MERRIAM_WEB_DEF_CNT_ID = 'merriam-webster-def-cnt';
const MERRIAM_WEB_SUG_CNT_ID = 'merriam-webster-submission-cnt';
const CONTEXT_EXPLANATION_CNT_ID = 'content-explanation-cnt';
const WIKI_CNT_ID = 'wikapedia-cnt'
let CONTEXT_EXPLAINED;

let explanations = new Explanations();

let definitions = {
  if: "conditional",
  is: "to be or not to be",
  the: "come on man"
};

let word;

function search(word) {
  return [
    'definition 1',
    'definition 2',
    'definition 3',
    'definition 4',
    'definition 5',
    'definition 6',
    'definition 7',
    'definition 8',
    'definition 9'
  ];
}

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

function setDictionary(merriamWebObj) {
  document.getElementById(MERRIAM_WEB_DEF_CNT_ID).innerHTML = merriamWebObj.defHtml || '';
  document.getElementById(MERRIAM_WEB_SUG_CNT_ID).innerHTML = merriamWebObj.suggestionHtml || '';
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
  console.log(explanations)
  console.log(scope);
  document.getElementById(CONTEXT_EXPLANATION_CNT_ID).innerHTML = $t(scope, 'explanation');
}

function onHighlight(e) {
    const selection = window.getSelection().toString()
    // Google Doc selection.
    // document.querySelector('.kix-selection-overlay')
    if (selection) {
      const trimmed = selection.trim().toLowerCase();
      if (trimmed) {
        explanations.get(trimmed, setExplanation);
        new MerriamWebster(trimmed, setDictionary);
      }
      UI.show();
      e.stopPropagation();
    }
}

document.onmouseup = onHighlight;
const UI = new ShortCutCointainer(UI_ID, ['c', 'e'], '<h1>Hello ContentExplained</h1>');
function print(val) {
  if (val.enabled && val.enabled !== CONTEXT_EXPLAINED.enabled) {
    window.location.reload()
  }
}

// chrome.storage.onChanged.addListener(print);
chrome.storage.local.get(['enabled'], buildUi);

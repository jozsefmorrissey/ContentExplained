const UI_ID = 'ce-ui';
const MERRIAM_WEB_CNT_ID = 'merriam-webster-container-id';
let CONTEXT_EXPLAINED;

let explanations = new Explanations();

function greeting(msg) {
  console.log(msg);
}

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

function buildInnerHtml(word) {
  function build(defList) {
    if (UI) {
      let defHtml = ''
      for (let index = 0; index < defList.length; index += 1) {
        defHtml += `<p><a href='#'>Add: </a>${defList[index].words}</p>`;
      }
      UI.innerHtml($t({
        list: [{
          title: '<img class="lookup-img" src="http://localhost:3000/images/icons/logo.png">',
          content: '<h1>one</h1>',
          active: true
        },{
          title: '<img class="lookup-img" src="http://localhost:3000/images/icons/Merriam-Webster.png">',
          content: `<div id='${MERRIAM_WEB_CNT_ID}'></div>`,
          active: false
        },{
          title: '<img class="lookup-img" src="http://localhost:3000/images/icons/wikapedia.png">',
          content: '<h1>3</h1>',
          active: false
        },{
          title: '4',
          content: '<h1>4</h1>',
          active: false
        }]
      }, 'lookup'));
      initTabs();
      // UI.innerHtml(`<h4>${word}</h4>
      //   ${defHtml}
      //   <button>Write your own</button>`);
      }
      UI.show();
  }
  return build;
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
  document.getElementById(MERRIAM_WEB_CNT_ID).innerHTML = merriamWebObj.html;
}

function onHighlight() {
    const selection = window.getSelection().toString()
    // Google Doc selection.
    // document.querySelector('.kix-selection-overlay')
    if (selection) {
      const trimmed = selection.trim().toLowerCase();
      if (trimmed) {
        explanations.get(trimmed, buildInnerHtml(trimmed));
        new MerriamWebster(trimmed, setDictionary);
      }
    }
}

document.onmouseup = onHighlight;
const UI = new ShortCutCointainer(UI_ID, ['c', 'e'], '<h1>Hello ContentExplained</h1>');

function print(val) {
  if (val.enabled && val.enabled !== CONTEXT_EXPLAINED.enabled) {
    window.location.reload()
  }
  console.log('val: ' + JSON.stringify(val));
}

chrome.storage.onChanged.addListener(print);
chrome.storage.local.get(['enabled'], buildUi);

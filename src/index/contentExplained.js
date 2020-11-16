
const space = new Array(1).fill('&nbsp;').join('');
const tabSpacing = new Array(2).fill('&nbsp;').join('');
function textToHtml(text) {
  return text.replace(/\n/g, '<br>').replace(/\s/g, space)
              .replace(/\t/g, tabSpacing)
              .replace(/<script>/, '')
              .replace(/\(([^\(^\)]*?)\)\s*\[([^\]\[]*?)\]/g,
                      '<a target=\'blank\' href="$2">$1</a>');
}

function search() {
  const explanations = new Explanations();
  const merriamWebster = new MerriamWebster()
  const rawText = new RawText()

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

  let built = false;
  function buildUi(data) {
    built = true;
    document.onmouseup = onHighlight;
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

  function goTo(word) {
    return function() {
      lookup(word);
    }
  }

  const historyTemplate = new $t('popup-cnt/linear-tab');
  let history = [];
  function setHistory(word) {
    history = history.filter((value) => value !== word);
    const sugCnt = document.getElementById(HISTORY_CNT_ID);
    sugCnt.innerHTML = historyTemplate.render(history.reverse());
    const spans = sugCnt.querySelectorAll('span');
    for (let index = 0; index < spans.length; index += 1) {
      spans[index].addEventListener('click', goTo(spans[index].innerText.trim().substr(0, 20)));
    }
    history.reverse();
    history.push(word);
  }

  function lookup(word) {
    setHistory(word);
    const trimmed = word.trim().toLowerCase();
    if (trimmed) {
      explanations.get(trimmed);
      merriamWebster.update(trimmed);
    }
    UI.show();
  }

  function onHighlight(e) {
    const selection = window.getSelection().toString()
    // Google Doc selection.
    // document.querySelector('.kix-selection-overlay')
    if (CE.properties.get('enabled') && selection) {
      lookup(selection);
      e.stopPropagation();
    }
  }

  function enableToggled(enabled) {
    if (enabled) {
      if (!built) {
        buildUi()
      }
    }
  }

  function refresh() {
    let hoverResources = document.getElementsByTagName('hover-resource');
    for (let index = 0; index < hoverResources.length; index += 1) {
      hoverResources[index].outerHTML = hoverResources[index].innerText;
    }

    new HoverResources(data);
  }

  CE.properties.onUpdate('enabled', enableToggled);
  CE.lookup = lookup;
  CE.refresh = refresh;
  CE.show = UI.show;
  CE.hide = UI.hide;
}

afterLoad.push(search);

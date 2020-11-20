
class MerriamWebster extends Page {
  constructor() {
    super();
    const instance = this;
    const meriamTemplate = new $t('popup-cnt/tab-contents/webster');
    let suggestions;
    let definitions;
    let selection;
    let key;
    this.label = () => `<img class="lookup-img" src="${EPNTS.images.merriam()}">`;

    function openDictionary(word) {
      return function() {
        properties.set('searchWords', word);
        instance.update();
      }
    }

    function html() {
      return meriamTemplate.render({definitions, key, suggestions, MERRIAM_WEB_SUG_CNT_ID});
    }
    this.html = html;

    function updateSuggestions(suggestionHtml) {
      const sugCnt = document.getElementById(MERRIAM_WEB_SUG_CNT_ID);
      const spans = sugCnt.querySelectorAll('span');
      for (let index = 0; index < spans.length; index += 1) {
        spans[index].addEventListener('click', openDictionary(spans[index].innerText.trim()));
      }
    }
    this.afterOpen = updateSuggestions;

    function success (data) {
      const elem = data[0];
      if (elem.meta && elem.meta.stems) {
        data = data.filter(elem => elem.meta.stems.indexOf(selection) !== -1);
        key = selection;
        definitions = data;
        suggestions = [];
      } else {
        key = selection;
        definitions = undefined;
        suggestions = data;
      }
      lookupTabs.update();
    }

    function failure (error) {
      console.error('Call to Meriam Webster failed');
    }

    this.update = function () {
      const newSelection = properties.get('searchWords');
      if (newSelection !== selection && (typeof newSelection) === 'string') {
        selection = newSelection;
        const url = `${URL_MERRIAM_REQ}${selection}`;
        Request.get(url, success, failure);
      }
    }

    this.beforeOpen = this.update;
  }
}

MerriamWebster = new MerriamWebster();
lookupTabs.add(MerriamWebster, 1);


class MerriamWebster extends Page {
  constructor() {
    super();
    const instance = this;
    const meriamTemplate = new $t('popup-cnt/tab-contents/webster');
    const meriamHeader = new $t('popup-cnt/tab-contents/webster-header');
    const SEARCH_INPUT_ID = 'merriam-suggestion-search-input-id';
    let suggestions;
    let definitions;
    let key;
    this.label = () => `<img class="lookup-img" src="${EPNTS.images.merriam()}">`;

    function openDictionary(event) {
      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      const word = searchInput.value.trim();
      history.push(word);
      properties.set('searchWords', word);
      instance.update();
    }

    this.html = () => meriamTemplate.render({definitions});
    this.header = () => {
      console.log('header called');
      return meriamHeader.render(
        {key: key.replace(/\s/g, '&nbsp;'), suggestions, MERRIAM_WEB_SUG_CNT_ID,
          SEARCH_INPUT_ID})};

    function afterOpen(suggestionHtml) {
      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      searchInput.addEventListener('change', openDictionary);
      searchInput.focus();
    }

    this.afterOpen = afterOpen;

    function success (data) {
      const elem = data[0];
      if (elem && elem.meta && elem.meta.stems) {
        data = data.filter(elem => elem.meta.stems.indexOf(key) !== -1);
        definitions = data;
        suggestions = [];
      } else {
        definitions = undefined;
        suggestions = data;
      }
      lookupTabs.updateBody();
      lookupTabs.updateHead();
      afterOpen();
    }

    function failure (error) {
      console.error('Call to Meriam Webster failed');
    }

    this.update = function () {
      const newKey = properties.get('searchWords');
      if (newKey && newKey !== key && (typeof newKey) === 'string') {
        definitions = undefined;
        suggestions = undefined;
        key = newKey;
        const url = EPNTS.merriam.search(key);
        Request.get(url, success, failure);
      }
    }

    this.beforeOpen = this.update;
  }
}

MerriamWebster = new MerriamWebster();
lookupTabs.add(MerriamWebster, 1);

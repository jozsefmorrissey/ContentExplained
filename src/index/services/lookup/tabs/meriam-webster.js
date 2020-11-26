
class MerriamWebster extends Page {
  constructor() {
    super();
    const instance = this;
    const meriamTemplate = new $t('popup-cnt/tab-contents/webster');
    const meriamHeader = new $t('popup-cnt/tab-contents/webster-header');
    let suggestions;
    let definitions;
    let key;
    this.label = () => `<img class="lookup-img" src="${EPNTS.images.merriam()}">`;

    function openDictionary(word) {
      return function() {
        properties.set('searchWords', word);
        instance.update();
      }
    }

    this.html = () => meriamTemplate.render({definitions});
    this.header = () => meriamHeader.render({key, suggestions, MERRIAM_WEB_SUG_CNT_ID});

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
        data = data.filter(elem => elem.meta.stems.indexOf(key) !== -1);
        definitions = data;
        suggestions = [];
      } else {
        definitions = undefined;
        suggestions = data;
      }
      lookupTabs.update();
    }

    function failure (error) {
      console.error('Call to Meriam Webster failed');
    }

    this.update = function () {
      const newKey = properties.get('searchWords');
      if (newKey !== key && (typeof newKey) === 'string') {
        definitions = undefined;
        suggestions = undefined;
        key = newKey.replace(/\s/g, '&nbsp;');
        const url = EPNTS.merriam.search(key);
        Request.get(url, success, failure);
      }
    }

    this.beforeOpen = this.update;
  }
}

MerriamWebster = new MerriamWebster();
lookupTabs.add(MerriamWebster, 1);

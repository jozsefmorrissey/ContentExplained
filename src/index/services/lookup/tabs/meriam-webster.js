
class MerriamWebster {
  constructor() {
    let hideTab = false;
    const instance = this;

    function showTab () {
      return !hideTab;
    }

    const merriamTab = new Tab(URL_IMAGE_MERRIAM, MERRIAM_WEB_DEF_CNT_ID,
            'popup-cnt/tab-contents/webster', showTab);
    const meriamSugTemplate = new $t('popup-cnt/linear-tab');


    function openDictionary(word) {
      return function() {
        CE.lookup(word);
      }
    }

    function updateSuggestions(suggestionHtml) {
      const sugCnt = document.getElementById(MERRIAM_WEB_SUG_CNT_ID);
      sugCnt.innerHTML = suggestionHtml || '';
      const spans = sugCnt.querySelectorAll('span');
      for (let index = 0; index < spans.length; index += 1) {
        spans[index].addEventListener('click', openDictionary(spans[index].innerText.trim()));
      }
    }

    function callbacks(selection) {
      function success (data) {
        const elem = data[0];
        if (elem.meta && elem.meta.stems) {
          hideTab = false;
          CE.updateTabVisibility();
          data = data.filter(elem => elem.meta.stems.indexOf(selection) !== -1);;
          merriamTab.update({data: data, key: selection});
          updateSuggestions(meriamSugTemplate.render([]))
        } else {
          hideTab = true;
          CE.showTab(0);
          updateSuggestions(meriamSugTemplate.render(data))
        }
      }

      function failure (error) {
        console.error('Call to Meriam Webster failed');
        hideTab = true;
        CE.updateTabVisibility();
      }
      return {success, failure};
    }

    this.update = function (selection) {
      if ((typeof selection) === 'string') {
        const url = `${URL_MERRIAM_REQ}${selection}`;
        const call = callbacks(selection);
        Request.get(url, call.success, call.failure);
      }
    }
  }
}

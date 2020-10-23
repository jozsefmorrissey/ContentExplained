class Explanations {
  constructor(list) {
    const tab = new Tab(URL_IMAGE_LOGO, CONTEXT_EXPLANATION_CNT_ID,
            'popup-cnt/tab-contents/explanation-cnt');
    this.list = list ? list : [];
    this.add = function (expl) {
      this.list.push(expl);
    }

    function setExplanation(explanations) {
      const scope = {};
      const tagObj = {}
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
      tab.update(scope);
      new AddInterface();
    }

    function setAddition(words) {
      return function (request) {
        const scope = {};
        scope.words = words;
        scope.ADD_EDITOR_ID = ADD_EDITOR_ID;
        tab.update(scope);
        new AddInterface().toggleDisplay(true);
      }
    }

    this.get = function (words, success, failure) {
      const url = `${URL_CE_GET}${words}`;
      Request.get(url, setExplanation, setAddition(words));
    }

    this.like = function (words, index, success, failure) {
      const currUrl = window.location.href;
      const callUrl = `${URL_CE_LIKE}${words}/${index}?url=${currUrl}`;
      Request.get(callUrl, successfullOpinion, failedOpinion);
    }
    this.dislike = function (words, index, success, failure) {
      const currUrl = window.location.href;
      const callUrl = `${URL_CE_DISLIKE}${words}/${index}?url=${currUrl}`;
      Request.get(callUrl, successfullOpinion, failedOpinion);
    }
  }
}

console.log("HERE!!!!! ", chrome.runtime.getURL('./html/text-to-html.html'));

class Explanations {
  constructor(list) {
    const tab = new Tab(URL_IMAGE_LOGO, CONTEXT_EXPLANATION_CNT_ID,
            'popup-cnt/tab-contents/explanation-cnt');
    let selected = [];
    let explanations;
    this.list = list ? list : [];
    this.add = function (expl) {
      this.list.push(expl);
    }

    function forTags(func) {
      const tags = document.getElementsByClassName('ce-expl-tag');
      for (let index = 0; index < tags.length; index += 1) {func(tags[index]);}
    }

    function selectUpdate() {
      selected = [];
      forTags((elem) => {if (elem.checked) selected.push(elem.value);});
      setExplanation();
    }

    function deselectAll() {
      forTags((elem) => elem.checked = false);
    }

    function selectAll() {
      forTags((elem) => elem.checked = true);
    }

    function byTags(expl) {
      if (selected.length === 0) return true;
      for (let index = 0; index < selected.length; index += 1) {
        if (expl.tags.indexOf(selected[index]) === -1) return false;
      }
      return true;
    }

    function setTagOnclick() {
      forTags((elem) => elem.onclick = selectUpdate);
      document.getElementById('ce-expl-tag-select-btn').onclick = selectAll;
      document.getElementById('ce-expl-tag-deselect-btn').onclick = deselectAll;
    }

    function setExplanation(expls) {
      const scope = {};
      const tagObj = {}
      if (expls !== undefined) {
        explanations = expls;
      }
      explanations.forEach(function (expl) {
        const username = expl.author.username;
        expl.shortUsername = username.length > 20 ? `${username.substr(0, 17)}...` : username;
        expl.tags.forEach(function (tag) {
          tagObj[tag] = true;
        });
      });

      scope.allTags = Object.keys(tagObj);
      scope.words = explanations[0].words;
      scope.explanations = explanations.filter(byTags);
      scope.ADD_EDITOR_ID = ADD_EDITOR_ID;
      scope.selected = selected;
      tab.update(scope);
      setTagOnclick();
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
      const url = EPNTS.explanation.get(words);
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

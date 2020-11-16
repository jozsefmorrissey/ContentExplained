class Explanations {
  constructor(list) {
    const tab = new Tab(URL_IMAGE_LOGO, CONTEXT_EXPLANATION_CNT_ID,
            'popup-cnt/tab-contents/explanation-cnt');
    let selected = [];
    let explanations;
    let searchWords;
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
      selected = [];
      setExplanation();
    }

    function selectAll() {
      forTags((elem) => {elem.checked = true; selected.push(elem.value)});
      setExplanation();
    }

    const tagReg = /#[a-zA-Z0-9]*/g;
    function byTags(expl) {
      if (selected.length === 0) return true;
      for (let index = 0; index < selected.length; index += 1) {
        if (expl.content.match(tagReg).indexOf(`#${selected[index]}`) === -1) return false;
      }
      return true;
    }

    function addExpl(e) {
      const explId = e.target.attributes['expl-id'].value;
      const url = EPNTS.siteExplanation.add(explId);
      const siteUrl = window.location.href;
      Request.post(url, {siteUrl, content});
    }

    function setTagOnclick() {
      forTags((elem) => elem.onclick = selectUpdate);
      document.getElementById('ce-expl-tag-select-btn').onclick = selectAll;
      document.getElementById('ce-expl-tag-deselect-btn').onclick = deselectAll;
      const applyBtns = document.getElementsByClassName('ce-apply-expl-btn');
      Array.from(applyBtns).forEach((btn) => btn.onclick = addExpl);
    }

    function setExplanation(expls) {
      const scope = {};
      const tagObj = {}
      if (expls !== undefined) {
        explanations = expls;
      }
      scope.explanations = explanations.filter(byTags);
      scope.explanations.forEach(function (expl) {
        const username = expl.author.username;
        expl.shortUsername = username.length > 20 ? `${username.substr(0, 17)}...` : username;
        expl.content.match(tagReg).forEach(function (tag) {
          tagObj[tag.substr(1)] = true;
        });
      });

      scope.allTags = Object.keys(tagObj);
      scope.words = searchWords;
      scope.ADD_EDITOR_ID = AddInterface.ADD_EDITOR_ID;
      scope.ADD_EDITOR_CNT_ID = AddInterface.ADD_EDITOR_CNT_ID;
      scope.ADD_EDITOR_TOGGLE_BTN = AddInterface.ADD_EDITOR_TOGGLE_BTN;
      scope.SUBMIT_EXPL_BTN_ID = AddInterface.SUBMIT_EXPL_BTN_ID;
      scope.selected = selected;
      tab.update(scope);
      setTagOnclick();
      AddInterface.update(searchWords);
    }

    function setAddition() {
        const scope = {};
        scope.words = searchWords;
        scope.ADD_EDITOR_ID = ADD_EDITOR_ID;
        scope.ADD_EDITOR_ID = AddInterface.ADD_EDITOR_ID;
        scope.ADD_EDITOR_CNT_ID = AddInterface.ADD_EDITOR_CNT_ID;
        scope.ADD_EDITOR_TOGGLE_BTN = AddInterface.ADD_EDITOR_TOGGLE_BTN;
        scope.SUBMIT_EXPL_BTN_ID = AddInterface.SUBMIT_EXPL_BTN_ID;
        tab.update(scope);
        AddInterface.update(searchWords);
        AddInterface.toggleDisplay(true);
    }

    this.get = function (words, success, failure) {
      const url = EPNTS.explanation.get(words);
      searchWords = words;
      Request.get(url, setExplanation, setAddition);
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

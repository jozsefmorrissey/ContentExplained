class Explanations extends Page {
  constructor(list) {
    super();
    const template = new $t('popup-cnt/tab-contents/explanation-cnt');
    const headerTemplate = new $t('popup-cnt/tab-contents/explanation-header');
    const CREATE_YOUR_OWN_BTN_ID = 'ce-explanations-create-your-own-btn-id';
    const LOGIN_BTN_ID = 'ce-explanations-login-btn-id';
    const SEARCH_BTN_ID = 'ce-explanations-search-btn-id';
    const EXPL_SEARCH_INPUT_ID = 'ce-explanation-search-input-id';
    let selected = [];
    let searchInput;
    let inputIndex = 0;
    const instance = this;
    let explanations = [];
    let searchWords;
    this.list = list ? list : [];
    this.add = function (expl) {
      this.list.push(expl);
    }

    this.clear = () => searchWords = null;

    function openAddPage(event) {
      lookupTabs.close();
      AddInterface.open(searchWords, window.location.href);
      event.stopPropagation();
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

    function regScore(reg, text) {
      let match = text.match(reg);
      let score = (value) => match === null ? 0 : value;
      let length = (multiplier) => match === null ? 0 : match.length * (multiplier || 1);
      return {score, length};
    }

    function byFilterValue(expl1, expl2) {
      const wordList = searchInput.value.replace(/[^a-z^A-Z^0-9^\s]/g, '')
                        .split(/\s{1,}/);
      if (wordList.length === 1 && wordList[0] === '') {
        return expl2.author.percent - expl1.author.percent;
      }
      let matchCount1 = 0;
      let matchCount2 = 0;
      wordList.forEach((word) => {
        if (word) {
          const exactTagReg = new RegExp(`#${word}(\s|#|$)`);
          matchCount1 += regScore(exactTagReg, expl1.content).score(100);
          matchCount2 += regScore(exactTagReg, expl2.content).score(100);

          const tagReg = new RegExp(`#[a-zA-Z0-9]*${word}[a-zA-Z0-9]*`);
          matchCount1 += regScore(tagReg, expl1.content).score(10);
          matchCount2 += regScore(tagReg, expl2.content).score(10);

          const wordReg = new RegExp(word);
          matchCount1 += regScore(wordReg, expl1.content).length();
          matchCount2 += regScore(wordReg, expl2.content).length();
        }
      });
      expl1.score = matchCount1;
      expl2.score = matchCount2;
      return matchCount2 - matchCount1;
    }


    function addExpl(e) {
      const explId = Number.parseInt(e.target.attributes['expl-id'].value);
      function addExplSuccessful() {
        explanations.forEach((expl) => {
          if(expl.id === explId)
            hoverExplanations.add(expl);
            setExplanation();
        })
      }
      const url = EPNTS.siteExplanation.add(explId);
      const siteUrl = window.location.href;
      Request.post(url, {siteUrl}, addExplSuccessful);
    }

    function setTagOnclick() {
      forTags((elem) => elem.onclick = selectUpdate);
      const applyBtns = document.getElementsByClassName('ce-expl-apply-btn');
      Array.from(applyBtns).forEach((btn) => btn.onclick = addExpl);

      const searchBtn = document.getElementById(SEARCH_BTN_ID);
      if (searchBtn) {
        searchInput = document.getElementById(EXPL_SEARCH_INPUT_ID);
        searchBtn.onclick = () => {
          let words = searchInput.value;
          if (words) {
            words = words.toLowerCase().trim();
            properties.set('searchWords', words, true);
            history.push(words);
            instance.get();
          }
        };
        searchInput.addEventListener('keyup', lookupTabs.updateBody)
        onEnter(EXPL_SEARCH_INPUT_ID, searchBtn.onclick);

        document.getElementById(EXPL_SEARCH_INPUT_ID).focus();
        searchInput.selectionStart = inputIndex;
        document.getElementById(CREATE_YOUR_OWN_BTN_ID).onclick = openAddPage;
        document.getElementById(LOGIN_BTN_ID).onclick = User.openLogin;
      }
    }

    function setExplanation(expls) {
      if (expls !== undefined) {
        explanations = expls;
      }
      lookupTabs.updateHead();
      lookupTabs.updateBody();
      setTagOnclick();
    }

    function getScope() {
      const scope = {};
      const tagObj = {}
      scope.explanations = explanations.sort(byFilterValue);
      scope.explanations.forEach(function (expl) {
        const username = expl.author.username;
        expl.shortUsername = username.length > 20 ? `${username.substr(0, 17)}...` : username;
        expl.canApply = hoverExplanations.canApply(expl);
        expl.rendered = textToHtml(expl.content);
        const author = expl.author;
        expl.author.percent = Math.floor((author.likes / (author.dislikes + author.likes)) * 100) || 0;
      });

      scope.words = searchWords;
      scope.loggedIn = User.isLoggedIn();
      scope.CREATE_YOUR_OWN_BTN_ID = CREATE_YOUR_OWN_BTN_ID;
      scope.EXPL_SEARCH_INPUT_ID = EXPL_SEARCH_INPUT_ID;
      scope.SEARCH_BTN_ID = SEARCH_BTN_ID;
      scope.LOGIN_BTN_ID = LOGIN_BTN_ID;
      scope.selected = selected;
      return scope;
    }

    function html () {
      return template.render(scope);
    }

    this.html = () => template.render(getScope());
    this.header= () => headerTemplate.render(getScope());
    this.label = () => `<img class="lookup-img" src="${EPNTS.images.logo()}">`;
    this.afterOpen = setTagOnclick;
    this.beforeOpen = () => instance.get();

    this.get = function () {
      const newSearchWords = properties.get('searchWords');
      if (newSearchWords !== searchWords) {
        selected = [];
        searchWords = newSearchWords;
        const url = EPNTS.explanation.get(searchWords);
        Request.get(url, setExplanation, () => setExplanation([]));
      }
    }
  }
}

Explanations = new Explanations();
lookupTabs.add(Explanations, 0);

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
    const instance = this;
    let explanations = [];
    let searchWords;
    this.list = list ? list : [];
    this.add = function (expl) {
      this.list.push(expl);
    }

    function openAddPage() {
      lookupTabs.open(AddInterface);
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

    const tagReg = /#[a-zA-Z0-9]*/g;
    function byTags(expl) {
      if (selected.length === 0) return true;
      for (let index = 0; index < selected.length; index += 1) {
        if (expl.content.match(tagReg).indexOf(`#${selected[index]}`) === -1) return false;
      }
      return true;
    }


    function addExpl(e) {
      const explId = Number.parseInt(e.target.attributes['expl-id'].value);
      function addExplSuccessful() {
        explanations.forEach((expl) => {
          if(expl.id === explId)
            HoverExplanations.add(expl);
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
      searchBtn.onclick = () => {
        let words = document.getElementById(EXPL_SEARCH_INPUT_ID).value;
        words = words.toLowerCase().trim();
        properties.set('searchWords', words);
        instance.get();
      };
      onEnter(EXPL_SEARCH_INPUT_ID, searchBtn.onclick);

      document.getElementById(EXPL_SEARCH_INPUT_ID).focus()
      document.getElementById(CREATE_YOUR_OWN_BTN_ID).onclick = openAddPage;
      document.getElementById(LOGIN_BTN_ID).onclick = User.openLogin;
    }

    function setExplanation(expls) {
      if (expls !== undefined) {
        explanations = expls;
      }
      lookupTabs.update();
    }

    function getScope() {
      const scope = {};
      const tagObj = {}
      scope.explanations = explanations.filter(byTags);
      scope.explanations.forEach(function (expl) {
        const username = expl.author.username;
        expl.shortUsername = username.length > 20 ? `${username.substr(0, 17)}...` : username;
        expl.canApply = HoverExplanations.canApply(expl);
        expl.rendered = textToHtml(expl.content);
        const author = expl.author;
        expl.author.percent = Math.floor((author.likes / (author.dislikes + author.likes)) * 100);
        const tags = expl.content.match(tagReg) || [];
        tags.forEach(function (tag) {
          tagObj[tag.substr(1)] = true;
        });
      });

      scope.allTags = Object.keys(tagObj);
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

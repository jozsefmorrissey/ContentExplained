// ./bin/dump/$templates.js

class HoverExplanations {
  constructor (props) {
    props = props || {};
    const template = new $t('hover-explanation');
    const questionTemplate = new $t('questions');
    const instance = this;
    const excludedTags = ['STYLE', 'SCRIPT', 'TITLE'];
    const  active = {expl: {}};
    const tag = 'hover-explanation';
    let siteInfoData;

    let switches = [];
    let disabled = false;
    let questions = {};
    let left;
    let explIds = [];
    let currIndex, currRef;
    let lastEnabled = properties.get('enabled');

    const id = Math.floor(Math.random() * 1000000);
    const LOGIN_BTN_ID = 'ce-hover-expl-login-btn-id-' + id;
    const EDIT_BTN_ID = 'ce-hover-expl-edit-btn-id-' + id;
    const SWITCH_LIST_ID = 'ce-hover-expl-switch-list-id-' + id;
    const VOTEUP_BTN_ID = 'ce-hover-expl-voteup-btn-' + id;
    const VOTEDOWN_BTN_ID = 'ce-hover-expl-votedown-btn-' + id;
    const MAIN_CONTENT_CNT_ID = 'ce-hover-expl-main-content-cnt-' + id;

    const getDems = () => properties.get('hoverExplanationsDems') || {width: '40vw', height: '20vh'};

    function setDemsFunc (setDems) {
      let instanceSetDems;
      if ((typeof setDems) === 'function') {
        instanceSetDems = setDems;
      } else {
        instanceSetDems = (dems) => {
          if (hoverExplanations === instance) {
            properties.set('hoverExplanationsDems', dems, true);
          }
        }
      }
      return function (dems) {
        document.getElementById(SWITCH_LIST_ID).style.height = dems.height;
        document.getElementById(MAIN_CONTENT_CNT_ID).style.height = dems.height;
        instanceSetDems(dems);
      };
    }

    function getQuestions(expl) {
      return questions[expl.words] || [];
    }

    props.setDems = setDemsFunc(props.setDems);
    props.getDems = props.getDems || getDems;
    props.tabText = () => active.expl.words;
    const hoverResource = new HoverResources(props);
    this.hover = hoverResource.hover;

    hoverResource.container().addEventListener('drop', () => newHoverResource());
    hoverResource.container().addEventListener('tabbed', () => newHoverResource());
    if (props.hover === undefined || props.hover === true) {
      hoverResource.on(tag, {html: getHtml, after: setSwitches, disabled: () => disabled});
    }

    this.close = () => hoverResource.close();
    this.disable = () => {disabled = true; instance.close()};
    this.enable = () => disabled = false;;
    this.keepOpen = () => hoverResource.forceOpen();
    this.letClose = () => hoverResource.forceClose();

    function getHtml(elemExplORef, index) {
      currIndex = index === undefined ? currIndex || 0 : index;
      let ref;
      if (elemExplORef instanceof HTMLElement) {
        ref = elemExplORef.getAttribute('ref');
      } else if ((typeof elemExplORef) === 'string') {
        ref = elemExplORef;
      }

      if (ref === undefined) {
        if (elemExplORef !== undefined) {
          active.list = [elemExplORef];
          currRef = undefined;
        } else {
          active.list = explList(currRef);
          currIndex = index === undefined ? currIndex || 0 : index;
        }
      } else {
        if (ref !== currRef) currIndex = index || 0;
        currRef = ref;
        active.list = explList(currRef);
      }

      if (active.expl) active.expl.isActive = false;
      active.expl = active.list[currIndex];
      active.expl.isActive = true;
      active.list = active.list.length > 1 ? active.list : [];
      active.list.sort(sortByPopularity);

      const loggedIn = User.isLoggedIn();
      const authored = loggedIn && active.expl.author &&
              User.loggedIn().id === active.expl.author.id;
      const explQuestions = getQuestions(active.expl);
      const tabs = [];
      tabs.push({
        label: 'Comments',
        hide: () => props.hideComments || (active.expl.comments.length === 0 && !User.isLoggedIn()),
        active: explQuestions.length === 0,
        html: Comment.for(hoverResource.container(), active.expl, undefined, true).html
      });
      tabs.push({
        label: 'Questions',
        active: explQuestions.length > 0,
        hide: () => explQuestions.length === 0,
        html: () => questionTemplate.render({questions: explQuestions})
      });
      const scope = {
        LOGIN_BTN_ID, SWITCH_LIST_ID, VOTEUP_BTN_ID, VOTEDOWN_BTN_ID, EDIT_BTN_ID,
        MAIN_CONTENT_CNT_ID,
        active, loggedIn, authored, tabs,
        height: getDems().height,
        content: textToHtml(active.expl.content),
        likes: Opinion.likes(active.expl),
        dislikes: Opinion.dislikes(active.expl),
        canLike: Opinion.canLike(active.expl),
        canDislike: Opinion.canDislike(active.expl)
      };
      return template.render(scope);
    }
    this.getHtml = getHtml;

    function updateContent(expl, index) {
      const position = hoverResource.updateContent(getHtml(expl, index));
      return position;
    }

    function switchFunc (index) {
      return () => {
        const scrollTop = document.getElementById(SWITCH_LIST_ID).scrollTop;
        updateContent(undefined, index);
        document.getElementById(SWITCH_LIST_ID).scroll(0, scrollTop);
      };
    }

    function display(expl) {
      updateContent(expl);
      return hoverResource.position();
    }
    this.display = display;

    function displayExistingElem(expl, callback, call) {
      call = call || 0;
      if (call >= 5) return;
      let elem;
      const elems = document.querySelectorAll(`hover-explanation[ref="${expl.searchWords}"]`);
      for (let index = 0; index < elems.length && elem === undefined; index += 1) {
        const e = elems[index];
        const rect = e.getBoundingClientRect();
        if (rect.width !== 0 && rect.height !== 0) {
          elem = e;
        }
      }
      if (elem === undefined) {
        setTimeout(() => displayExistingElem(expl, callback, call + 1), 500);
      } else {
        display(expl).elem(elem);
        callback(elem);
      }
    }

    function scrollTo(expl, call) {
      displayExistingElem(expl, () => scrollIntoView(hoverResource.container(), 40, 10));
    }

    function voteup() {Opinion.voteup(active.expl, () => updateContent());}

    function votedown() {Opinion.votedown(active.expl, () => updateContent());}

    function setSwitches() {
      if (active.list.length > 1) {
        switches = Array.from(document.getElementById(SWITCH_LIST_ID).children);
        switches.forEach((elem, index) => elem.onclick = switchFunc(index));
      } else {
        document.getElementById(SWITCH_LIST_ID).hidden = true;
      }
      document.getElementById(LOGIN_BTN_ID).onclick = User.openLogin;
      document.getElementById(EDIT_BTN_ID).onclick = () => {
        setTimeout(instance.close, 0);
        AddInterface.open(active.expl);
      }
      document.getElementById(VOTEUP_BTN_ID).addEventListener('click', voteup);
      document.getElementById(VOTEDOWN_BTN_ID).addEventListener('click', votedown);
    }

    function sortByPopularity(expl1, expl2) {
      expl1.popularity = Opinion.popularity(expl1);
      expl2.popularity = Opinion.popularity(expl2);
      return expl2.popularity - expl1.popularity;
    }

    function topNodeText(el) {
        let child = el.firstChild;
        const explanations = [];

        while (child) {
            if (child.nodeType == 3) {
                explanations.push(child.data);
            }
            child = child.nextSibling;
        }

        return explanations.join("");
    }

    function findWord(word) {
      let allNodes = [];
      const bodyChildren = document.querySelectorAll('body>:not(#ce-extension-html-container)')
      for (let index = 0; index < bodyChildren.length; index += 1) {
        const decendents = bodyChildren[index].querySelectorAll('*');
        for (let dIndex = 0; dIndex < decendents.length; dIndex += 1) {
          allNodes.push(decendents[dIndex]);
        }
      }
      return allNodes.filter(el => topNodeText(el).match(new RegExp(word, 'i')));
    }


    function wrapText(elem, text, ref) {
      function replaceRef() {
        const prefix = arguments[1];
        const text = arguments[4].replace(/\s{1,}/g, '&nbsp;');
        const suffix = arguments[5];
        return `${prefix}<${tag} ref='${ref}'>${text}</${tag}>${suffix}`;
      }
      if (text) {
        let textRegStr = `((^|>)([^>^<]* |))(${text})(([^>^<]* |)(<|$|))`;
        let textReg = new RegExp(textRegStr, 'ig');
        const newHtml = elem.innerHTML.replace(textReg, replaceRef);
        try {
          safeInnerHtml(newHtml, elem)
        } catch (e) {
          console.error('Replacement Failed')
        }
      }
    }

    let wrapList = [];
    let wrapIndex = 0;
    function wrapOne() {
        if (!properties.get('enabled') || wrapIndex >= wrapList.length) return;
        const wrapInfo = wrapList[wrapIndex];
        const elems = findWord(wrapInfo.word);
        for (let eIndex = 0; eIndex < elems.length; eIndex += 1) {
          const elem = elems[eIndex];
          if (wrapInfo && elem.tagName.toLowerCase() !== tag) {
            wrapText(elem, wrapInfo.word, wrapInfo.ref);
            wrapInfo[wrapIndex] = undefined;
          }
        }
        wrapIndex++;
        setTimeout(wrapOne, 1);
    }
    this.wrapOne = wrapOne;

    function removeAll() {
      wrapIndex = 0;
      let resources = document.getElementsByTagName(tag);
      while (resources.length > 0) {
        Array.from(resources)
          .forEach((elem) => safeOuterHtml(elem.innerHTML, elem));
        resources = document.getElementsByTagName(tag);
      }
    }

    function sortByLength(str1, str2) {return str2.length - str1.length;}

    function uniqueWords(explList) {
      const uniq = {}
      explList.forEach((expl) => uniq[expl.words] = true);
      return Object.keys(uniq).sort(sortByLength);
    }

    function set(data, soft) {
      siteInfoData = data;
      if (soft) return;
      removeAll();
      wrapList = [];
      const wordList = Object.keys(siteInfoData.list).sort(sortByLength);
      for (let index = 0; index < wordList.length; index += 1) {
        const ref = wordList[index];
        const explanations = explList(ref);
        explanations.forEach((expl) => explIds.push(expl.id));
        const uniqWords = uniqueWords(explanations).sort(sortByLength);
        for (let wIndex = 0; wIndex < uniqWords.length; wIndex += 1) {
          const word = uniqWords[wIndex];
          wrapList.push({ word, ref });
        }
      }
      wrapOne();
    }

    function update(expl) {
      const ref = expl.searchWords;
      const list = explList(ref);
      let index = 0;
      for (; index < list.length; index += 1) {
        if (list[index].id === expl.id) {
          list[index] = expl;
          updateContent(ref, index).show();
          return;
        }
      }
      list.push(expl);
      updateContent(ref, index).show();
    }
    this.update = update;

    function refObj(ref) {
      if (siteInfoData.list[ref] === undefined) {
        siteInfoData.list[ref] = {explanations: [], questions: []};
      }
      return siteInfoData.list[ref];
    }

    function explList(ref) {
      const obj = refObj(ref);
      return obj === undefined ? undefined : obj.explanations;
    }

    function add(expl) {
      const ref = expl.searchWords;
      explList(ref).push(expl);
      const elem = document.createElement(tag);
      elem.setAttribute('ref', expl.searchWords);
      updateContent(elem, explList(ref).length - 1);
      hoverResource.position().elem();

      wrapList.push({ word: expl.words, ref });
      wrapOne();
      explIds.push(expl.id);
    }

    function getHeaderCnt() {
      return hoverResource.container().querySelector('.ce-hover-expl-title-cnt');
    }
    function getExplCnt() {
      return hoverResource.container().querySelector('.ce-hover-expl-cnt');
    }
    function getContentCnt() {
      return hoverResource.container().querySelector('.ce-hover-expl-content-cnt');
    }

    this.set = set;
    this.add = add;

    this.getHeaderCnt = getHeaderCnt;
    this.getExplCnt = getExplCnt;
    this.getContentCnt = getContentCnt;
    this.wrapText = wrapText;
    this.canApply = (expl) => User.isLoggedIn() && explIds.indexOf(expl.id) === -1;

    this.lockOpen = hoverResource.lockOpen;
    this.unlockOpen = hoverResource.unlockOpen;
    this.position = hoverResource.position;
    this.scrollTo = scrollTo;
    this.displayExistingElem = displayExistingElem;

    function enableToggled(enabled) {
      if (enabled !== lastEnabled) {
        lastEnabled = enabled;
        removeAll();
        if (enabled) {
          instance.wrapOne();
        }
      }
    }

    const newHoverResource = () => {
        if(hoverExplanations === instance) {
          hoverResource.stopHover();
          hoverResource.lockOpen();
          hoverExplanations = new HoverExplanations();
          hoverExplanations.set(siteInfoData, true);
        }
    }

    toggleContainer(hoverResource.container());
    properties.onUpdate('enabled', enableToggled);
  }
}

let hoverExplanations = new HoverExplanations();

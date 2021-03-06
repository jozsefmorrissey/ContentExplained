// ./bin/$templates.js

class HoverExplanations {
  constructor (props) {
    props = props || {};
    const template = new $t('hover-explanation');
    const instance = this;
    const excludedTags = ['STYLE', 'SCRIPT', 'TITLE'];
    const  active = {expl: {}};
    const tag = 'hover-explanation';

    let switches = [];
    let disabled = false;
    let explRefs = {};
    let left;
    let explIds = [];
    let currIndex, currRef;
    let lastEnabled = properties.get('enabled');

    const id = Math.floor(Math.random() * 1000000);
    const LOGIN_BTN_ID = 'ce-hover-expl-login-btn-id-' + id;
    const SWITCH_LIST_ID = 'ce-hover-expl-switch-list-id-' + id;
    const VOTEUP_BTN_ID = 'ce-hover-expl-voteup-btn-' + id;
    const VOTEDOWN_BTN_ID = 'ce-hover-expl-votedown-btn-' + id;

    const getDems = () => properties.get('hoverExplanationsDems') || {width: '40vw', height: '20vh'};
    const setDems = (dems) => {
      if (hoverExplanations === instance)
        properties.set('hoverExplanationsDems', dems, true);
    };

    props.setDems = props.setDems || setDems;
    props.getDems = props.getDems || getDems;
    const hoverResource = new HoverResources(props);

    hoverResource.container().addEventListener('drop', () => newHoverResource());
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
          active.list = explRefs[currRef];
          currIndex = index === undefined ? currIndex || 0 : index;
        }
      } else {
        if (ref !== currRef) currIndex = index || 0;
        currRef = ref;
        active.list = explRefs[currRef];
      }

      if (active.expl) active.expl.isActive = false;
      active.expl = active.list[currIndex];
      active.expl.isActive = true;
      active.list = active.list.length > 1 ? active.list : [];
      active.list.sort(sortByPopularity);

      const loggedIn = User.isLoggedIn();
      const scope = {
        LOGIN_BTN_ID, SWITCH_LIST_ID, VOTEUP_BTN_ID, VOTEDOWN_BTN_ID,
        active, loggedIn,
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
        updateContent(undefined, index);
      };
    }

    function display(expl) {
      updateContent(expl);
      return hoverResource.position();
    }
    this.display = display;

    function voteup() {Opinion.voteup(active.expl, () => updateContent());}

    function votedown() {Opinion.votedown(active.expl, () => updateContent());}

    function setSwitches() {
      if (active.list.length > 1) {
        switches = Array.from(document.getElementById(SWITCH_LIST_ID).children);
        switches.forEach((elem, index) => elem.onclick = switchFunc(index));
      }
      document.getElementById(LOGIN_BTN_ID).onclick = User.openLogin;
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
        return Array.from(document.body.querySelectorAll('*'))
          .filter(el => topNodeText(el).match(new RegExp(word, 'i')));
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
        safeInnerHtml(newHtml, elem)
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

    function set(explList, soft) {
      explRefs = explList;
      if (soft) return;
      removeAll();
      wrapList = [];
      const wordList = Object.keys(explList).sort(sortByLength);
      for (let index = 0; index < wordList.length; index += 1) {
        const ref = wordList[index];
        const explanations = explList[ref];
        explanations.forEach((expl) => explIds.push(expl.id));
        const uniqWords = uniqueWords(explanations).sort(sortByLength);
        for (let wIndex = 0; wIndex < uniqWords.length; wIndex += 1) {
          const word = uniqWords[wIndex];
          wrapList.push({ word, ref });
        }
      }
      wrapOne();
    }

    function add(expl) {
      const ref = expl.searchWords;
      if (explRefs[ref] === undefined) {
        explRefs[ref] = [expl];
      } else {
        explRefs[ref].push(expl);
      }
      const elem = document.createElement(tag);
      elem.setAttribute('ref', expl.searchWords);
      updateContent(elem, explRefs[ref].length - 1);
      hoverResource.position().elem();

      wrapList.push({ word: expl.words, ref });
      wrapOne();
      explIds.push(expl.id);
    }

    this.set = set;
    this.add = add;

    this.wrapText = wrapText;
    this.canApply = (expl) => User.isLoggedIn() && explIds.indexOf(expl.id) === -1;

    this.lockOpen = hoverResource.lockOpen;
    this.unlockOpen = hoverResource.unlockOpen;
    this.position = hoverResource.position;

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
        if(hoverResource) {
          hoverResource.stopHover();
          hoverResource.lockOpen();
          hoverExplanations = new HoverExplanations();
          hoverExplanations.set(explRefs, true);
        }
    }

    properties.onUpdate('enabled', enableToggled);
  }
}

let hoverExplanations = new HoverExplanations();

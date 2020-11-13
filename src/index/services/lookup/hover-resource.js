
class HoverResources {
  constructor (tag) {
    const resourceTemplate = new $t('hover-resource');
    let running = false;
    const HOVER_DISPLAY_CNT_ID = 'ce-hover-display-cnt-id';
    const HOVER_SWITCH_LIST_ID = 'ce-hover-switch-list-id';
    const HOVER_LOGIN_BTN_ID = 'ce-hover-login-btn-id';
    const POPUP_CNT_ID = 'ce-hover-popup-cnt-id'
    const instance = this;
    running = true;
    const excludedTags = ['STYLE', 'SCRIPT', 'TITLE'];
    let count = Math.floor(Math.random() * 10000000000000000);
    const  active = {expl: {}};
    let switches = [];
    let siteId;
    tag = (tag ? tag : 'hover-resource').toLowerCase();
    const explanations = {};

    console.log('HoverResources');
    const box = document.createElement('div');
    box.id = POPUP_CNT_ID;
    box.style = 'display: none;';
    document.body.append(box);

    let killAt = -1;
    let holdOpen = false;
    function kill() {
      if (!holdOpen && killAt < new Date().getTime()) {
          box.style.display = 'none';
          killAt = -1;
      }
    }

    const waitTime = 750;
    function dontHoldOpen(elem) {holdOpen = false; killAt = new Date().getTime() + waitTime;}

    function onHover(event) {
      if (!properties.get('enabled')) return;
      const elem = event.target;
      if (elem.tagName.toLowerCase() === tag && explanations[elem.id]) {
        killAt = new Date().getTime() + waitTime;
        positionText(elem);
      } else if (elem.id === box.id || killAt === -1){
        holdOpen = true;
      } else if (killAt < new Date().getTime()) {
        box.style.display = 'none';
        killAt = -1;
      }
    }

    function exitHover() {
      setTimeout(kill, 1000);
    }

    function switchFunc (index) {
      return () => {
        updateContent(index);
      };
    }

    function openLogin() {
      const tabId = properties.get("SETTINGS_TAB_ID")
      const page = properties.get("settingsPage");
      window.open(`${page}#Login`, tabId);
    }

    function voteup() {Opinion.voteup(active.expl, updateContent);}

    function votedown() {Opinion.votedown(active.expl, updateContent);}

    function setSwitches() {
      if (active.list.length > 1) {
        switches = Array.from(document.getElementById(HOVER_SWITCH_LIST_ID).children);
        switches.forEach((elem, index) => elem.onclick = switchFunc(index));
      }
      document.getElementById(HOVER_LOGIN_BTN_ID).onclick = openLogin;
      document.getElementById('ce-expl-voteup-btn').addEventListener('click', voteup);
      document.getElementById('ce-expl-votedown-btn').addEventListener('click', votedown);
    }

    function updateContent(index) {
      const hoveredText = active.elem.innerText;
      if (index !== undefined) {
        active.expl.isActive = false;
        active.expl = active.list[index];
        active.expl.isActive = true;
        active.list = active.list.length > 1 ? active.list : [];
      }
      const loggedIn = User.isLoggedIn();
      const scope = {
        HOVER_LOGIN_BTN_ID, HOVER_DISPLAY_CNT_ID, HOVER_SWITCH_LIST_ID,
        active, hoveredText, loggedIn,
        likes: Opinion.likes(active.expl),
        dislikes: Opinion.dislikes(active.expl),
        canLike: Opinion.canLike(active.expl),
        canDislike: Opinion.canDislike(active.expl)
      };
      box.innerHTML = resourceTemplate.render(scope);
      setSwitches();
    }

    function positionText(elem) {
      const tbSpacing = 10;
      const rect = elem.getBoundingClientRect();
      const height = rect.height;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const calcWidth = rect.left + 10 < screenWidth / 2 ? rect.left + 10 : screenWidth / 2;
      const left = `${calcWidth}px`;

      const maxWidth = `${screenWidth - calcWidth - 10}px`;
      const minWidth = '20%';
      const css = `
        cursor: pointer;
        position: fixed;
        z-index: 999999;
        background-color: white;
        display: block;
        left: ${left};
        max-height: 40%;
        min-width: ${minWidth};
        max-width: ${maxWidth};
        overflow: auto;
        border: 1px solid;
        border-radius: 5pt;
        padding: 10px;
        box-shadow: 3px 3px 6px black, 3px 3px 6px grey, 3px 3px 6px lightgrey;
        `;

      box.style = css;
      active.elem = elem;
      active.list = explanations[elem.id];
      updateContent(0);

      let top = `${rect.top}px`;
      const boxHeight = box.getBoundingClientRect().height;
      if (screenHeight / 2 > rect.top) {
        top = `${rect.top + height}px`;
      } else {
        top = `${rect.top - boxHeight}px`;
      }
      box.style = `${css}top: ${top};`;
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

    function getId(id) {
      return `${tag}-${id}`;
    }


    function wrapText(elem, text, hoverText) {
      const id = getId(count++);
      function replaceRef() {
        const prefix = arguments[1];
        const text = arguments[4].replace(/\s{1,}/g, '&nbsp;');
        const suffix = arguments[5];
        return `${prefix}<${tag} id='${id}'>${text}</${tag}>${suffix}`;
      }
      // if (text.indexOf('code') === 0) {
      //   console.log('here');
      // }
      let textRegStr = `((^|>)([^>^<]* |))(${text})(([^>^<]* |)(<|$|))`;
      let textReg = new RegExp(textRegStr, 'ig');
      elem.innerHTML = elem.innerHTML.replace(textReg, replaceRef);
      explanations[id] = hoverText;
    }

    let wrapList = [];
    let wrapIndex = 0;
    function wrapOne() {
        if (!properties.get('enabled')) return;
        for (let index = 0; index < 50; index += 1) {
          const wrapInfo = wrapList[wrapIndex];
          if (wrapInfo && wrapInfo.elem.tagName.toLowerCase() !== tag) {
            wrapText(wrapInfo.elem, wrapInfo.word, wrapInfo.explainations);
            wrapInfo[wrapIndex++] = undefined;
          }
        }
        if (wrapIndex < wrapList.length) {
          setTimeout(wrapOne, 1);
        }
    }
    this.wrapOne = wrapOne;

    function getDepth(elem){
    	var depth = 0
    	while(null!==elem.parentElement){
    		elem = elem.parentElement
    		depth++
    	}
    	return depth
    }

    function sortDepth(info1, info2) {
      return info2.depth - info1.depth;
    }

    function removeAll() {
      let resources = document.getElementsByTagName('hover-resource');
      while (resources.length > 0) {
        Array.from(resources)
        .forEach((elem) => elem.outerHTML = elem.innerHTML);
        resources = document.getElementsByTagName('hover-resource');
      }
    }

    function sortByLength(str1, str2) {return str2.length - str1.length;}

    function uniqueWords(explList) {
      const uniq = {}
      explList.forEach((expl) => uniq[expl.words] = true);
      return Object.keys(uniq).sort(sortByLength);
    }

    function set(explList) {
      removeAll();
      const wordList = Object.keys(explList).sort(sortByLength);
      for (let index = 0; index < wordList.length; index += 1) {
        const explainations = explList[wordList[index]];
        const uniqWords = uniqueWords(explainations);
        for (let wIndex = 0; wIndex < uniqWords.length; wIndex += 1) {
          const word = uniqWords[wIndex];
          const elems = findWord(word);
          for(let eIndex = 0; eIndex < elems.length; eIndex += 1) {
            const elem = elems[eIndex];
            if (excludedTags.indexOf(elem.tagName) === -1) {
              const depth = getDepth(elem);
              wrapList.push({ elem, word, explainations, depth });
            }
          }
        }
      }
      wrapList.sort(sortDepth);
      wrapOne();
    }

    this.set = set;

    document.addEventListener('mouseover', onHover);
    document.addEventListener('click', kill);
    document.getElementById(POPUP_CNT_ID).addEventListener('mouseout', dontHoldOpen);
    document.getElementById(POPUP_CNT_ID).addEventListener('click', (e) => e.preventDefault());
    this.wrapText = wrapText;

    function enableToggled(enabled) {
      removeAll();
      instance.wrapOne();
    }

    properties.onUpdate('enabled', enableToggled);
  }
}

HoverResources = new HoverResources();

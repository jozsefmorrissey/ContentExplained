

class HoverResources {
  constructor (wordExplanationObj, tag) {
    const excludedTags = ['STYLE', 'SCRIPT', 'TITLE'];
    let count = Math.floor(Math.random() * 10000000000000000);
    tag = tag ? tag : 'hover-resource';
    const texts = {};

    console.log('HoverResources');
    const box = document.createElement('div');
    box.id = `hover-pop-up-${count}`;
    box.innerText = 'Hello World';
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

    function onHover(event) {
      const elem = event.target;
      if (elem.tagName.toLowerCase() === tag && texts[elem.id][0].text) {
        holdOpen = true;
        positionText(elem);
      } else if (elem.id === box.id || killAt === -1){
        holdOpen = true;
        killAt = new Date().getTime() + 750;
      } else if (killAt < new Date().getTime()) {
        holdOpen = false;
        box.style.display = 'none';
        killAt = -1;
      }
    }

    function exitHover() {
      setTimeout(kill, 1000);
    }

    function positionText(elem) {
      const tbSpacing = 10;
      const rect = elem.getBoundingClientRect();
      const height = rect.height;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const calcWidth = rect.left + 10 < screenWidth / 2 ? rect.left + 10 : screenWidth / 2;
      const left = `${calcWidth}px`;

      const width = `${screenWidth - calcWidth - 10}`;
      const css = `
        cursor: pointer;
        position: fixed;
        z-index: 999999;
        background-color: white;
        display: block;
        left: ${left};
        max-height: 40%;
        max-width: ${width};
        overflow: auto;
        border: 1px solid;
        border-radius: 5pt;
        padding: 10px;
        box-shadow: 3px 3px 6px black, 3px 3px 6px grey, 3px 3px 6px lightgrey;
        `;

      box.style = css;
      box.innerHTML = texts[elem.id][0].text;

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
        const texts = [];

        while (child) {
            if (child.nodeType == 3) {
                texts.push(child.data);
            }
            child = child.nextSibling;
        }

        return texts.join("");
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
      let textRegStr = `((^|>)([^>^<]* |))(${text}(|s|es))(([^>^<]* |)(<|$|))`;
      let textReg = new RegExp(textRegStr, 'ig');
      const replaceStr = `$1<${tag} id='${id}'>$4</${tag}>$6`;
      elem.innerHTML = elem.innerHTML.replace(textReg, replaceStr);
      texts[id] = hoverText;
    }

    let wrapList = [];
    let wrapIndex = 0;
    function wrapOne() {
        for (let index = 0; index < 50; index += 1) {
          const wrapInfo = wrapList[wrapIndex];
          if (wrapInfo) {
            wrapText(wrapInfo.elem, wrapInfo.word, wrapInfo.explainations);
            wrapInfo[wrapIndex++] = undefined;
          }
        }
        setTimeout(wrapOne, 1);
    }

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

    function buildWrapList() {
      const wordList = Object.keys(wordExplanationObj);
      for (let index = 0; index < wordList.length; index += 1) {
        const word = wordList[index];
        const elems = findWord(word);
        for(let eIndex = 0; eIndex < elems.length; eIndex += 1) {
          const elem = elems[eIndex];
          if (excludedTags.indexOf(elem.tagName) === -1) {
            const explainations = wordExplanationObj[word];
            const depth = getDepth(elem);
            wrapList.push({ elem, word, explainations, depth });
          }
        }
      }
      wrapList.sort(sortDepth);
    }

    buildWrapList();
    setTimeout(wrapOne, 1);

    document.addEventListener('mouseover', onHover);
    document.addEventListener('mouseout', exitHover);
    this.wrapText = wrapText;
  }
}

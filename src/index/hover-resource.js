
class HoverResources {
  constructor (zIncrement) {
    const id = Math.floor(Math.random() * 1000000);
    const POPUP_CNT_ID = 'ce-hover-popup-cnt-id-' + id;
    const POPUP_CONTENT_ID = 'ce-hover-popup-content-id-' + id;
    const MAXIMIZE_BTN_ID = 'ce-hover-maximize-id-' + id;
    const MINIMIZE_BTN_ID = 'ce-hover-minimize-id-' + id;
    const template = new $t('hover-resources');
    const instance = this;
    const defaultStyle = `position: fixed;
      z-index: ${(zIncrement || 0) + 999999};
      background-color: white;
      display: none;
      max-height: 40%;
      min-width: 20%;
      max-width: 40%;
      overflow: auto;
      border: 1px solid;
      border-radius: 5pt;
      box-shadow: 3px 3px 6px black, 3px 3px 6px grey, 3px 3px 6px lightgrey;`;
    const htmlFuncs = {};
    let forceOpen = false;
    let currFuncs, currElem, selectElem;
    let popupContent, popupCnt;
    let prevLocation, minLocation;
    let selectOpen = false;
    let holdOpen = false;
    let lastMoveEvent;
    let closeFuncs = [];

    document.addEventListener('mousemove', (e) => lastMoveEvent = e);

    this.close = () => {
      getPopupElems().cnt.style.display = 'none';
      currElem = undefined;
      closeFuncs.forEach((func) => func());
      if (minLocation) instance.minimize();
    }

    this.forceOpen = () => {forceOpen = true; getPopupElems().cnt.style.display = 'block';};
    this.forceClose = () => {forceOpen = false; exitHover();};
    this.show = () => setCss({display: 'block'});

    function kill() {
      if (!selectOpen && !forceOpen && !holdOpen && !withinPopup()) {
        instance.close();
      }
    }

    function isOpen() {
      return getPopupElems().cnt.style.display === 'block';
    }

    function withinPopup() {
      const rect = getPopupElems().cnt.getBoundingClientRect();
      const withinX = lastMoveEvent.clientX < rect.right && rect.left < lastMoveEvent.clientX;
      const withinY = lastMoveEvent.clientY < rect.bottom && rect.top < lastMoveEvent.clientY;
      return withinX && withinY;
      }

    function dontHoldOpen(event) {
      if (selectOpen && window.getSelection().toString() === '' && selectOpen < new Date().getTime()) selectOpen = false;
      if (isOpen() && !withinPopup()) {
        holdOpen = false;
        exitHover();
      }
    }

    function getFunctions(elem) {
      let foundFuncs;
      const queryStrs = Object.keys(htmlFuncs);
      queryStrs.forEach((queryStr) => {
        if (elem.matches(queryStr)) {
          if (foundFuncs) {
            throw new Error('Multiple functions being invoked on one hover event');
          } else {
            foundFuncs = htmlFuncs[queryStr];
          }
        }
      });
      return foundFuncs;
    }

    function offHover(event) {
      const elem = event.target;
      const funcs = getFunctions(elem);
      if (funcs) return;
      dontHoldOpen(event);
    }

    function onHover(event) {
      if (!properties.get('enabled')) return;
      const elem = event.target;

      if (elem.id === POPUP_CNT_ID){
        holdOpen = true;

      }

      const funcs = getFunctions(elem);
      if (funcs) {
        if ((!funcs.disabled || !funcs.disabled()) && currElem !== elem) {
          currFuncs = funcs;
          positionOnElement(elem, funcs);
          if (funcs && funcs.html) updateContent(funcs.html(elem));
          if (funcs && funcs.after) funcs.after();
        }
        holdOpen = true;
      }
    }

    function exitHover() {
      setTimeout(kill, 500);
    }

    this.back = () => setCss(prevLocation);

    function positionOnElement(elem) {
      currElem = elem || currElem;
      getPopupElems().cnt.style = defaultStyle;
      getPopupElems().cnt.style.display = 'block';
      const tbSpacing = 10;
      const rect = currElem.getBoundingClientRect();
      const height = rect.height;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const popRect = getPopupElems().cnt.getBoundingClientRect();
      const elemHorizCenter = (rect.right - rect.left) / 2;
      const popHorizCenter = (popRect.right - popRect.left) / 2;
      const calcWidth = rect.left < screenWidth / 2 ? rect.left : screenWidth / 2;
      let left = elemHorizCenter - popHorizCenter + rect.left;
      left = left < 0 ? 0 : left;
      const leftOffset = calcWidth - (screenWidth - left);
      left = leftOffset > 0 ? left - leftOffset : left;
      left = `${left}px`;

      const maxWidth = `${screenWidth - calcWidth}px`;
      const minWidth = '20%';
      let top = `${rect.top}px`;
      const boxHeight = getPopupElems().cnt.getBoundingClientRect().height;
      if (screenHeight / 2 > rect.top) {
        top = `${rect.top + height}px`;
      } else {
        top = `${rect.top - boxHeight}px`;
      }
      const position = {};
      position.top = () =>{setCss({top: rect.top - popRect.height + 'px'}); return position;};
      position.bottom = () =>{setCss({top: rect.bottom + 'px'}); return position;};
      position.left = () =>{setCss({left: rect.left - popRect.width + 'px'}); return position;};
      position.right = () =>{setCss({left: rect.right + 'px'}); return position;};
      position.center = () =>{setCss({left: rect.left - (popRect.width / 2) + (rect.width / 2) + 'px',
              top: rect.top - (popRect.height / 2) + (rect.height / 2) + 'px'}); return position;};
      position.maximize = instance.maximize.bind(position);
      position.minimize = instance.minimize.bind(position);
      setCss({left, minWidth, maxWidth, top, display: 'block', back: instance.back});
      exitHover();
      return position;
    }

    this.elem = positionOnElement;
    this.select = () => {
      if (window.getSelection().toString().trim()) {
        selectElem = window.getSelection().getRangeAt(0);
        currElem = selectElem;
        selectOpen = new Date().getTime() + 3000;
      }
      positionOnElement(selectElem);
    };
    this.top = () => setCss({top:0,bottom:''});
    this.left = () => setCss({right:'',left:0});
    this.bottom = () => setCss({top:'',bottom:0});
    this.right = () => setCss({right:0,left:''});

    this.center = function () {
      const popRect = getPopupElems().cnt.getBoundingClientRect();
      const top = `${(window.innerHeight / 2) - (popRect.height / 2)}px`;
      const left = `${(window.innerWidth / 2) - (popRect.width / 2)}px`;
      console.log(top, left)
      setCss({top,left, right: '', bottom: ''});
      return instance;
    }

    this.maximize = function () {
      setCss({top: 0, bottom: 0, right: 0, left:0, maxWidth: 'unset', maxHeight: 'unset', width: 'unset', height: 'unset'})
      minLocation = prevLocation;
      document.getElementById(MAXIMIZE_BTN_ID).style.display = 'none';
      document.getElementById(MINIMIZE_BTN_ID).style.display = 'block';
      return this;
    }

    this.minimize = function () {
      if (minLocation) {
        setCss({top: 'unset', bottom: 'unset', right: 'unset', left: 'unset'})
        setCss(minLocation);
        prevLocation = minLocation;
        minLocation = undefined;
        holdOpen = true;
        document.getElementById(MAXIMIZE_BTN_ID).style.display = 'block';
        document.getElementById(MINIMIZE_BTN_ID).style.display = 'none';
      }
      return this;
    }

    function setCss(rect) {
      const popRect = getPopupElems().cnt.getBoundingClientRect();
      const top = getPopupElems().cnt.style.top;
      const bottom = getPopupElems().cnt.style.bottom;
      const left = getPopupElems().cnt.style.left;
      const right = getPopupElems().cnt.style.right;
      const maxWidth = getPopupElems().cnt.style.maxWidth;
      const maxHeight = getPopupElems().cnt.style.maxHeight;
      const width = getPopupElems().cnt.style.width;
      const height = getPopupElems().cnt.style.height;
      styleUpdate(getPopupElems().cnt, rect);
      prevLocation = {top, bottom, left, right, maxWidth, maxHeight, width, height}
      return instance;
    }
    this.setCss = setCss;

    function on(queryStr, funcObj) {
      if (htmlFuncs[queryStr] !== undefined) throw new Error('Assigning multiple functions to the same selector');
      htmlFuncs[queryStr] = funcObj;
    }
    this.on = on;

    this.onClose = (func) => closeFuncs.push(func);

    function updateContent(html) {
      getPopupElems().content.innerHTML = html;
      if (currFuncs && currFuncs.after) currFuncs.after();
      return instance;
    }
    this.updateContent = updateContent;

    function isMaximized() {
      return minLocation !== undefined;
    }
    this.isMaximized = isMaximized;

    const tempElem = document.createElement('div');
    tempElem.innerHTML = template.render({POPUP_CNT_ID, POPUP_CONTENT_ID,
        MINIMIZE_BTN_ID, MAXIMIZE_BTN_ID});
    tempElem.children[0].style = defaultStyle;
    document.body.append(tempElem);
    function getPopupElems() {
      const newPopupContent = document.getElementById(POPUP_CONTENT_ID);
      if (newPopupContent !== popupContent) {
        popupCnt = document.getElementById(POPUP_CNT_ID);
        popupContent = newPopupContent;
        popupCnt.style = defaultStyle;
        document.getElementById(MAXIMIZE_BTN_ID).onclick = instance.maximize;
        document.getElementById(MINIMIZE_BTN_ID).onclick = instance.minimize;
        popupCnt.addEventListener('click', (e) => {
          holdOpen = true;
          if (e.target.tagName !== 'A')
          e.stopPropagation()
        });
      }
      return {cnt: popupCnt, content: popupContent};
    }

    document.addEventListener('mouseover', onHover);
    document.addEventListener('mouseout', offHover);
    document.addEventListener('click', dontHoldOpen);
    this.container = () => getPopupElems().content;

  }
}

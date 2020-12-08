
class DragDropResize {
  constructor (target) {

    this.close = () => {
      getPopupElems().cnt.style.display = 'none';
    }

    this.show = () => {
      setCss({display: 'block'})
    };

    function isOpen() {
      return getPopupElems().cnt.style.display === 'block';
    }

    function within(offset) {
      const rect = getPopupElems().cnt.getBoundingClientRect();
      if (lastMoveEvent) {
        const withinX = lastMoveEvent.clientX < rect.right - offset && rect.left + offset < lastMoveEvent.clientX;
        const withinY = lastMoveEvent.clientY < rect.bottom - offset && rect.top + offset < lastMoveEvent.clientY;
        return withinX && withinY;
      }
      return true;
    }

    this.back = () => setCss(prevLocation);

    function positionOnElement(elem) {
      currElem = elem || currElem;
      getPopupElems().cnt.style = defaultStyle;
      instance.show();
      let rect = currElem.getBoundingClientRect();
      let popRect = getPopupElems().cnt.getBoundingClientRect();

      let top = `${rect.top}px`;
      const position = {};
      position.top = () =>{setCss({top: rect.top - popRect.height + 'px'}); return position;};
      position.bottom = () =>{setCss({top: rect.bottom + 'px'}); return position;};
      position.left = () =>{setCss({left: rect.left - popRect.width + 'px'}); return position;};
      position.right = () =>{setCss({left: rect.right + 'px'}); return position;};
      position.center = () =>{
              let left = rect.left - (popRect.width / 2) + (rect.width / 2);
              left = left > 10 ? left : 10;
              const leftMost = window.innerWidth - popRect.width - 10;
              left = left < leftMost ? left : leftMost;
              let top = rect.top - (popRect.height / 2) + (rect.height / 2);
              top = top > 10 ? top : 10;
              const bottomMost = window.innerHeight - popRect.height - 10;
              top = top < bottomMost ? top : bottomMost;
              setCss({left: left + 'px', top: top + 'px'});
              return position;};
      position.maximize = instance.maximize.bind(position);
      position.minimize = instance.minimize.bind(position);
      if (window.innerHeight / 2 > rect.top) {
        position.center().bottom();
      } else {
        position.center().top();
      }

      return position;
    }

    this.elem = positionOnElement;
    this.select = () => {
      if (window.getSelection().toString().trim()) {
        selectElem = window.getSelection().getRangeAt(0);
        currElem = selectElem;
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
        canClose = false;
        prevLocation = minLocation;
        minLocation = undefined;
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
      safeInnerHtml(html, getPopupElems().content);
      if (currFuncs && currFuncs.after) currFuncs.after();
      return instance;
    }
    this.updateContent = updateContent;

    function isMaximized() {
      return minLocation !== undefined;
    }
    this.isMaximized = isMaximized;

    const tempElem = document.createElement('div');
    const tempHtml = template.render({POPUP_CNT_ID, POPUP_CONTENT_ID,
        MINIMIZE_BTN_ID, MAXIMIZE_BTN_ID});
    safeInnerHtml(tempHtml, tempElem);
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
        popupCnt.onclick = (e) => {
          if (e.target.tagName !== 'A')
          e.stopPropagation()
        });
      }
      return {cnt: popupCnt, content: popupContent};
    }

    document.addEventListener('mousemove', (e) => {lastMoveEvent = e; softClose();});
    document.addEventListener('mouseover', onHover);
    document.addEventListener('mouseout', offHover);
    document.addEventListener('mousedown', () => mouseDown = true);
    document.addEventListener('mouseup', () => mouseDown = false);
    document.addEventListener('click',  () => { this.forceClose() });
    this.container = () => getPopupElems().content;

  }
}

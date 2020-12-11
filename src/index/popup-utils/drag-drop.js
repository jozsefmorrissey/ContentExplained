// ./src/index/popup-utils/resizer.js

class DragDropResize {
  constructor (props) {
    props = props || {};
    const id = Math.floor(Math.random() * 1000000);
    const POPUP_CNT_ID = 'place-popup-cnt-id-' + id;
    const POPUP_CONTENT_ID = 'place-popup-content-id-' + id;
    const MAXIMIZE_BTN_ID = 'place-maximize-id-' + id;
    const MINIMIZE_BTN_ID = 'place-minimize-id-' + id;
    const MAX_MIN_CNT_ID = 'place-max-min-id-' + id;
    const CLOSE_BTN_ID = 'place-close-btn-id-' + id;
    const template = new $t('place');
    let lastMoveEvent, prevLocation, mouseDown, minLocation, selectElem,
        currElem, hasMoved;
    const instance = this;
    const closeFuncs = [];

    let width = '40vw';
    let height = '20vh';
    this.getDems = props.getDems || ( () => { return {width, height}; } );
    this.setDems = props.setDems || ( (w, h) => { width = w; height = h; } );

    this.hasMoved = () => hasMoved;
    function onResizeEvent() {
      const rect = popupCnt.getBoundingClientRect();
      if (!Resizer.isLocked(popupCnt)) instance.setDems({width: rect.width, height: rect.height});
    }

    const defaultStyle = `
      background-color: white;
      position: ${props.position || 'absolute'};
      overflow: hidden;
      min-height: 20vh;
      min-width: 30vw;
      border: 1px solid;
      padding: 3pt;
      border-radius: 5pt;
      box-shadow: 3px 3px 6px black, 3px 3px 6px grey, 3px 3px 6px lightgrey;`;

    this.close = () => {
      getPopupElems().cnt.style.display = 'none';
      Resizer.hide(popupCnt);
      closeFuncs.forEach((func) => func());
      instance.minimize();
    }
    this.hide = this.close;

    this.show = () => {
      if (instance.hidden()) {
        const css = {display: 'block',
        height: Resizer.isLocked(popupCnt) ? undefined : instance.getDems().height,
        width: Resizer.isLocked(popupCnt) ? undefined : instance.getDems().width};
        if (Number.isFinite(css.height)) css.height = css.height + 'px';
        if (Number.isFinite(css.width)) css.width = css.width + 'px';

        setCss(css);
        if (!Resizer.isLocked(popupCnt)) Resizer.show(popupCnt);
      }
      return instance;
    };

    this.hidden = () => getPopupElems().cnt.style.display === 'none';

    this.withinPopup = (offset) => {
      const rect = getPopupElems().cnt.getBoundingClientRect();
      if (lastMoveEvent) {
        const withinX = lastMoveEvent.screenX < rect.right - offset && rect.left + offset < lastMoveEvent.screenX;
        const withinY = lastMoveEvent.screenY < rect.bottom - offset && rect.top + offset < lastMoveEvent.screenY;
        return withinX && withinY;
      }
      return false;
    }

    this.back = () => setCss(prevLocation);

    function positionOnElement(elem) {
      currElem = elem || currElem;
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
      setCss({top: 0, bottom: 0, right: 0, left:0, maxWidth: 'unset', maxHeight: 'unset', width: 'unset', height: '95vh'})
      minLocation = prevLocation;
      document.getElementById(MAXIMIZE_BTN_ID).style.display = 'none';
      document.getElementById(MINIMIZE_BTN_ID).style.display = 'block';
      return this;
    }

    this.minimize = function () {
      if (minLocation) {
        setCss({top: 'unset', bottom: 'unset', right: 'unset', left: 'unset', width: instance.getDems().width})
        setCss(minLocation);
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
      setTimeout(() => Resizer.position(popupCnt), 0);
      return instance;
    }
    this.setCss = setCss;

    this.onClose = (func) => closeFuncs.push(func);

    function updateContent(html) {
      safeInnerHtml(html, getPopupElems().content);
      return instance;
    }
    this.updateContent = updateContent;

    function isMaximized() {
      return minLocation !== undefined;
    }
    this.isMaximized = isMaximized;

    let lastClickTime;
    let dragging;
    function drag(e) {
      const clickTime = new Date().getTime();
      if (!isMaximized() && clickTime < lastClickTime + 400) {
        backdrop.show();
        Resizer.hide(popupCnt);
        const rect = popupCnt.getBoundingClientRect();
        dragging = {screenX: e.screenX, screenY: e.screenY, top: rect.top + window.scrollY, left: rect.left + window.scrollX};
        DragDropResize.events.dragstart.trigger(getPopupElems().cnt);
      }
      lastClickTime = clickTime;
    }

    function stopDragging() {
      dragging = undefined;
      backdrop.hide();
      Resizer.position(popupCnt);
      DragDropResize.events.dragend.trigger(getPopupElems().cnt);
      DragDropResize.events.drop.trigger(getPopupElems().cnt);
      if (!Resizer.isLocked(popupCnt)) Resizer.show(popupCnt);
    }

    const tempElem = document.createElement('div');
    const tempHtml = template.render({POPUP_CNT_ID, POPUP_CONTENT_ID,
        MINIMIZE_BTN_ID, MAXIMIZE_BTN_ID, MAX_MIN_CNT_ID, CLOSE_BTN_ID,
        hideClose: props.hideClose});
    safeInnerHtml(tempHtml, tempElem);
    tempElem.children[0].style = defaultStyle;
    document.body.append(tempElem);

    const popupContent = document.getElementById(POPUP_CONTENT_ID);
    popupContent.style.overflow = 'auto';
    const popupCnt = document.getElementById(POPUP_CNT_ID);
    popupCnt.style = defaultStyle;
    popupCnt.addEventListener(Resizer.events.resize.name, onResizeEvent);
    document.getElementById(MAXIMIZE_BTN_ID).onclick = instance.maximize;
    document.getElementById(MINIMIZE_BTN_ID).onclick = instance.minimize;
    document.getElementById(CLOSE_BTN_ID).onclick = instance.close;
    popupCnt.onmousedown = drag;
    popupCnt.onclick = (e) => {
      if (e.target.tagName !== 'A')
      e.stopPropagation()
    };

    CssFile.apply('place');


    function getPopupElems() {
      return {cnt: popupCnt, content: popupContent};
    }

    let lastDragNotification = new Date().getTime()
    function mouseMove(e) {
      if (dragging) {
        const dy = dragging.screenY - lastMoveEvent.screenY;
        const dx = dragging.screenX - lastMoveEvent.screenX;
        const rect = popupCnt.getBoundingClientRect();
        popupCnt.style.top = dragging.top - dy + 'px';
        popupCnt.style.left = dragging.left - dx + 'px';
        const time = new Date().getTime();
        if (lastDragNotification + 350 < time) {
          DragDropResize.events.drag.trigger(getPopupElems().cnt);
          lastDragNotification = time;
        }
      }
      lastMoveEvent = e;
    }

    function on(eventName, func) {
      getPopupElems().content.addEventListener(eventName, func);
    }
    this.on = on;

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mousedown', (e) => mouseDown = e);
    document.addEventListener('mouseup', () => mouseDown = undefined);
    this.container = () => getPopupElems().cnt;
    this.lockSize = () => Resizer.lock(popupCnt);
    this.unlockSize = () => Resizer.unlock(popupCnt);

    Resizer.all(popupCnt, props.position);
    const backdrop = new CatchAll(popupCnt);
    backdrop.on('mouseup', stopDragging);
    backdrop.on('mousemove', mouseMove);
    document.addEventListener('scroll', (e) => {console.log('scrolling'); mouseMove(e);});


    Resizer.position(popupCnt);
  }
}

DragDropResize.events = {};
DragDropResize.events.drag = new CustomEvent ('drag')
DragDropResize.events.dragend = new CustomEvent ('dragend')
DragDropResize.events.dragstart = new CustomEvent ('dragstart')
DragDropResize.events.drop = new CustomEvent ('drop')

// drag	An element or text selection is being dragged (fired continuously every 350ms).
// dragend	A drag operation is being ended (by releasing a mouse button or hitting the escape key).
// dragstart	The user starts dragging an element or text selection.
// drop	An element is dropped on a valid drop target.

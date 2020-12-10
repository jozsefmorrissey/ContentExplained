// ./bin/$templates.js

class DragDropResize {
  constructor (zIncrement) {
    const id = Math.floor(Math.random() * 1000000);
    const zindex = (zIncrement || 0) + 999999;
    const POPUP_CNT_ID = 'place-popup-cnt-id-' + id;
    const POPUP_CONTENT_ID = 'place-popup-content-id-' + id;
    const MAXIMIZE_BTN_ID = 'place-maximize-id-' + id;
    const MINIMIZE_BTN_ID = 'place-minimize-id-' + id;
    const MAX_MIN_CNT_ID = 'place-max-min-id-' + id;
    const CLOSE_BTN_ID = 'place-close-btn-id-' + id;
    const RESIZER_COLLECT_NAME = 'DragDropResizeName' + id;
    const minimumSize = 40;
    const template = new $t('place');
    let lastMoveEvent, prevLocation, mouseDown, minLocation;
    const instance = this;

    class Resizer {
      constructor (axisObj, cursor, collectionName) {
        if (collectionName) {
          if (!Resizer.collections[collectionName]) {
            Resizer.collections[collectionName] = [];
          }
          Resizer.collections[collectionName].push(this);
        }
        const instance = this;
        const padding = 8;
        let resize = false;
        let lastPosition;

        const attrs = Object.values(axisObj);
        const top = attrs.indexOf('top') !== -1;
        const bottom = attrs.indexOf('bottom') !== -1;
        const left = attrs.indexOf('left') !== -1;
        const right = attrs.indexOf('right') !== -1;

        this.container = document.createElement('DIV');
        this.container.style.cursor = cursor;
        this.container.style.padding = padding/2 + 'px';
        this.container.style.zIndex = zindex + 10;
        this.container.style.position = 'absolute';
        this.container.style.backgroundColor = 'transparent';
        document.body.append(this.container);

        function resizeCnt (event) {
          if (resize) {
            let dy = resize.clientY - event.clientY;
            let dx = resize.clientX - event.clientX;
            console.log('resizing');
            if (axisObj.x) {
              if (left) dx *= -1;
              const newWidth = lastPosition.width - dx;
              if (newWidth > minimumSize) {
                if (left) {
                  popupCnt.style.left = lastPosition.left + dx + 'px';
                }
                popupCnt.style.width = newWidth + 'px'
              }
            }
            if (axisObj.y) {
              if (top) dy *= -1;
              const newWidth = lastPosition.height - dy;
              if (newWidth > minimumSize) {
                if (top) {
                  popupCnt.style.top = lastPosition.top + dy + 'px';
                }
                popupCnt.style.height = newWidth + 'px'
              }
            }
          }
        }

        this.container.onmousedown = (e) => {
          resize = e;
          Resizer.backdrop.hidden = false;
          lastPosition = popupCnt.getBoundingClientRect();
          e.stopPropagation();
          e.preventDefault();
        }

        function stopResizing() {
          if (resize) {
            resize = undefined;
            Resizer.positionCollection(collectionName);
            Resizer.backdrop.hidden = true;
          }
        }

        Resizer.backdrop.addEventListener('mouseup', stopResizing);
        this.container.onmouseup = stopResizing;

        this.container.onmousemove = resizeCnt;
        Resizer.backdrop.addEventListener('mousemove', resizeCnt);
        this.position = function () {
          const rect = popupCnt.getBoundingClientRect();
          if (top) {
            instance.container.style.top = rect.top - padding + 'px';
          } else if (!bottom) {
            instance.container.style.top = rect.top + 'px';
          }

          if (bottom) {
            instance.container.style.bottom = (window.innerHeight - rect.bottom) - padding + 'px';
          } else if (!top) {
            instance.container.style.bottom = (window.innerHeight - rect.bottom) + 'px';
          }

          if (right) {
            instance.container.style.right = (window.innerWidth - rect.right) - padding + 'px';
          } else if (!left) {
            instance.container.style.right = (window.innerWidth - rect.right) + 'px';
          }

          if (left) {
            instance.container.style.left = rect.left - padding + 'px';
          } else if (!right) {
            instance.container.style.left = rect.left + 'px';
          }
        }
      }
    }

    Resizer.backdrop = document.createElement('DIV');
    Resizer.backdrop.style.position = 'absolute';
    Resizer.backdrop.style.backgroundColor = 'transparent';
    Resizer.backdrop.style.zIndex = zindex + 9
    Resizer.backdrop.hidden = true;
    Resizer.backdrop.style.top = 0;
    Resizer.backdrop.style.bottom = 0;
    Resizer.backdrop.style.right = 0;
    Resizer.backdrop.style.left = 0;
    document.body.append(Resizer.backdrop);

    Resizer.collections = {};
    Resizer.positionCollection = function (name) {
      const collection = Resizer.collections[name];
      if (collection) {
        collection.forEach((item) => item.position());
      }
    }


    function getWidth() {return '40vw';}
    function getHeigth() {return '20vh';}

    const defaultStyle = `
      z-index: ${zindex};
      background-color: white;
      position: relative;
      overflow: auto;
      width: ${getWidth()};
      height: ${getHeigth()};
      border: 1px solid;
      padding: 3pt;
      border-radius: 5pt;
      box-shadow: 3px 3px 6px black, 3px 3px 6px grey, 3px 3px 6px lightgrey;`;

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
      setCss({top: 0, bottom: 0, right: 0, left:0, maxWidth: 'unset', maxHeight: 'unset', width: 'unset', height: '95vh'})
      minLocation = prevLocation;
      document.getElementById(MAXIMIZE_BTN_ID).style.display = 'none';
      document.getElementById(MINIMIZE_BTN_ID).style.display = 'block';
      return this;
    }

    this.minimize = function () {
      if (minLocation) {
        setCss({top: 'unset', bottom: 'unset', right: 'unset', left: 'unset', width: getWidth()})
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
      Resizer.positionCollection(RESIZER_COLLECT_NAME);
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
        const rect = popupCnt.getBoundingClientRect();
        dragging = {clientX: e.clientX, clientY: e.clientY, top: rect.top, left: rect.left};
        console.log('moveing');
      }
      lastClickTime = clickTime;
    }

    function stopDragging() {
      console.log('NOT moveing');
      dragging = undefined;
      Resizer.positionCollection(RESIZER_COLLECT_NAME);
    }

    const tempElem = document.createElement('div');
    const tempHtml = template.render({POPUP_CNT_ID, POPUP_CONTENT_ID,
        MINIMIZE_BTN_ID, MAXIMIZE_BTN_ID, MAX_MIN_CNT_ID, CLOSE_BTN_ID});
    safeInnerHtml(tempHtml, tempElem);
    tempElem.children[0].style = defaultStyle;
    document.body.append(tempElem);

    const popupContent = document.getElementById(POPUP_CONTENT_ID);
    const popupCnt = document.getElementById(POPUP_CNT_ID);
    popupCnt.style = defaultStyle;
    document.getElementById(MAXIMIZE_BTN_ID).onclick = instance.maximize;
    document.getElementById(MINIMIZE_BTN_ID).onclick = instance.minimize;
    document.getElementById(CLOSE_BTN_ID).onclick = instance.close;
    popupCnt.onmousedown = drag;
    popupCnt.onmouseup = stopDragging;
    popupCnt.onclick = (e) => {
      if (e.target.tagName !== 'A')
      e.stopPropagation()
    };

    CssFile.apply('place');


    function getPopupElems() {
      return {cnt: popupCnt, content: popupContent};
    }

    function mouseMove(e) {
      if (dragging) {
        const dy = dragging.clientY - lastMoveEvent.clientY;
        const dx = dragging.clientX - lastMoveEvent.clientX;
        console.log('dragging');
        const rect = popupCnt.getBoundingClientRect();
        popupCnt.style.top = dragging.top - dy + 'px';
        popupCnt.style.left = dragging.left - dx + 'px';
      }
      lastMoveEvent = e;
    }

    function resizeBlocks() {

    }

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mousedown', (e) => mouseDown = e);
    document.addEventListener('mouseup', () => mouseDown = undefined);
    this.container = () => getPopupElems().content;

    new Resizer({y: 'top'}, 'n-resize', RESIZER_COLLECT_NAME);
    new Resizer({y: 'bottom'}, 'n-resize', RESIZER_COLLECT_NAME);
    new Resizer({x: 'right'}, 'e-resize', RESIZER_COLLECT_NAME);
    new Resizer({x: 'left'}, 'e-resize', RESIZER_COLLECT_NAME);
    new Resizer({x: 'right', y: 'top'}, 'ne-resize', RESIZER_COLLECT_NAME);
    new Resizer({x: 'left', y: 'top'}, 'nw-resize', RESIZER_COLLECT_NAME);
    new Resizer({x: 'right', y: 'bottom'}, 'se-resize', RESIZER_COLLECT_NAME);
    new Resizer({x: 'left', y: 'bottom'}, 'sw-resize', RESIZER_COLLECT_NAME);

    Resizer.positionCollection(RESIZER_COLLECT_NAME);
  }
}

new DragDropResize().center();

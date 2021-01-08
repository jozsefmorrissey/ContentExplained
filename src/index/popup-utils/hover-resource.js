// ./src/index/popup-utils/drag-drop.js

class HoverResources {
  constructor (props) {
    props = props || {}
    const instance = this;
    const htmlFuncs = {};
    let forceOpen = false;
    let lockOpen = false;
    let currFuncs, currElem;
    let canClose = false;
    let hoverOff = false;
    let closeFuncs = [];

    const popupCnt = new DragDropResize(props);
    popupCnt.hide();

    this.hover = (onOff) => {
      if ((typeof onOff) === 'boolean') {
        hoverOff =  !onOff;
      } else {
        hoverOff =  properties.get('hoverOff');
      }
    }
    this.position = () => popupCnt;


    this.softClose = () => {
      if (!lockOpen) {
        instance.close();
      }
    }

    this.close = () => {
        canClose = false;
        popupCnt.close();
        currElem = undefined;
        closeFuncs.forEach((func) => func());
    }

    this.forceOpen = () => {
      hoverOff = true; forceOpen = true; instance.show();
    };
    popupCnt.on('click', instance.forceOpen);
    this.forceClose = () => {hoverOff = false; forceOpen = false; instance.softClose();};
    this.show = () => {
      popupCnt.show();
    };

    function softClose() {
      if (!props.clickClose && canClose && !forceOpen && !popupCnt.hidden() && !popupCnt.withinPopup(-10)) {
        instance.softClose();
      }
    }

    function dontHoldOpen(event) {
      if (!canClose) popupCnt.withinPopup(10) && (canClose = true);
      if (canClose) {
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
      if (hoverOff || properties.get('hoverOff') || !properties.get('enabled')) return;
      const elem = event.target;
      if (!canClose) popupCnt.withinPopup(10) && (canClose = true);

      const funcs = getFunctions(elem);
      if (funcs) {
        if ((!funcs.disabled || !funcs.disabled()) && currElem !== elem) {
          currFuncs = funcs;
          if (funcs && funcs.html) updateContent(funcs.html(elem));
          popupCnt.elem(elem);
          if (funcs && funcs.after) funcs.after();
        }
      }
    }

    function exitHover() {
      setTimeout(softClose, 500);
    }


    function on(queryStr, funcObj) {
      if (htmlFuncs[queryStr] !== undefined) throw new Error('Assigning multiple functions to the same selector');
      htmlFuncs[queryStr] = funcObj;
    }
    this.on = on;

    this.onClose = (func) => closeFuncs.push(func);

    function updateContent(html) {
      popupCnt.updateContent(html);
      if (currFuncs && currFuncs.after) currFuncs.after();
      return instance;
    }
    this.updateContent = updateContent;

    function startHover() {
      document.addEventListener('mouseover', onHover);
      document.addEventListener('mouseout', offHover);
    }
    this.startHover = startHover;

    function stopHover() {
      document.removeEventListener('mouseover', onHover);
      document.removeEventListener('mouseout', offHover);
    }
    this.stopHover = stopHover;

    this.container = popupCnt.container;
    this.hasMoved = popupCnt.hasMoved;
    this.lockSize = popupCnt.lockSize;
    this.unlockSize = popupCnt.unlockSize;
    this.lockOpen = () => lockOpen = true;
    this.unlockOpen = () => lockOpen = false;

    document.addEventListener('mousemove', softClose);
    document.addEventListener('click', this.forceClose);
    startHover();
  }
}

afterLoad.push(() => new KeyShortCut(['c','e'], () => {
  properties.toggle('hoverOff', true);
}));

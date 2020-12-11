
const getDems = () => properties.get('lookupHoverResourceDems') || {width: '40vw', height: '20vh'};
const setDems = (dems) => properties.set('lookupHoverResourceDems', dems, true);
const lookupHoverResource = new HoverResources({clickClose: true, zIncrement: 1, getDems, setDems});

class Tabs {
  constructor(updateHtml, props) {
    props = props || {};
    const uniqId = Math.floor(Math.random() * 100000);
    const template = new $t('tabs');
    const CSS_CLASS = props.class || 'ce-tabs-list-item';
    const ACTIVE_CSS_CLASS = `${CSS_CLASS} ${props.activeClass || 'ce-tabs-active'}`;
    const LIST_CLASS = props.listClass || 'ce-tabs-list';
    const CNT_ID = props.containerId || 'ce-tabs-cnt-id-' + uniqId;
    const LIST_ID = 'ce-tabs-list-id-' + uniqId;
    const TAB_CNT_ID = 'ce-tab-cnt-id-' + uniqId;
    const NAV_CNT_ID = 'ce-tab-nav-cnt-id-' + uniqId;
    const NAV_SPACER_ID = 'ce-tab-nav-spacer-id-' + uniqId;
    const HEADER_CNT_ID = 'ce-tab-header-cnt-id-' + uniqId;
    const instance = this;
    let firstRender = true;
    const pages = [];
    const positions = {};
    let currIndex;
    let activePage;
    // lookupHoverResource.forceOpen();

    function switchFunc(index) {return function () { switchTo(index);}}

    this.open = function (page) {
      if (!(page instanceof Page)) throw new Error('argument must be of type page');
      for (let index = 0; index < pages.length; index += 1) {
        if (page === pages[index]) {
          switchTo(index);
          return;
        }
      }
      throw new Error(page.label() + 'does not exist');
    }

    function setOnclickMethods() {
      document.getElementById(TAB_CNT_ID).onmouseup = (e) => {
          e.stopPropagation()
        };
      const listItems = document.getElementById(LIST_ID).children;
      for (let index = 0; index < listItems.length; index += 1) {
        listItems[index].onclick = switchFunc(index);
      }
    }

    function switchTo(index) {
      hoverExplanations.disable();
      if (index !== undefined && index !== currIndex) firstRender = true;
      currIndex = index === undefined ? currIndex || 0 : index;
      activePage = pages[currIndex];
      activePage.beforeOpen();
      lookupHoverResource.updateContent(template.render(getScope()));
      setDems();
      setTimeout(setDems, 400);
      lookupHoverResource.position().minimize();
      lookupHoverResource.position().select();
      setOnclickMethods();
      activePage.afterOpen();
    }

    function setDems() {
      const headerElem = document.getElementById(HEADER_CNT_ID);
      const navElem = document.getElementById(NAV_CNT_ID);
      if (navElem && headerElem) {
        elemSpacer(headerElem);
        elemSpacer(navElem);
        if (firstRender) {
          setTimeout(switchTo, 1000);
          firstRender = false;
        }
      }
   }

    function getScope() {

      const content = activePage !== undefined ? activePage.html() : '';
      const header = activePage !== undefined ? activePage.header() : '';
      return {
        CSS_CLASS, ACTIVE_CSS_CLASS, LIST_CLASS, LIST_ID,  CNT_ID, TAB_CNT_ID,
        NAV_CNT_ID, HEADER_CNT_ID, NAV_SPACER_ID,
        activePage, content, pages, header
      }
    }

    function sortByPosition(page1, page2) {
      return positions[page1.label()] - positions[page2.label()];
    }

    function add(page, position) {
      if (!(page instanceof Page)) throw new Error('argument must be of type page');
      let index = pages.indexOf(page);
      if (index === -1) {
        index = pages.length;
        pages.push(page);
        positions[page.label()] = position !== undefined ? position : Number.MAX_SAFE_INTEGER;
        pages.sort(sortByPosition);
      } else {
        console.warn('page has already been added');
      }
    }

    function update(elem) {
      switchTo(undefined);
    }

    lookupHoverResource.onClose(() => {
      hoverExplanations.enable();
      hoverExplanations.letClose();
    });

    this.add = add;
    this.update = update;
  }
}

const lookupTabs = new Tabs(lookupHoverResource.updateContent);

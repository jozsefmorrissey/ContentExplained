
const getDems = () => properties.get('lookupHoverResourceDems') || {width: '40vw', height: '20vh'};
const setDems = (dems) => properties.set('lookupHoverResourceDems', dems, true);

function regLen(text, reg) {
  const match = text.match(reg);
  return match === null ? 0 : match.length;
}
const historyTemplate = new $t('history');
const lookupHoverResource = new HoverResources({
  clickClose: true,
  zIncrement: 1,
  hasPast: history.hasPast,
  hasFuture: history.hasFuture,
  back: () => lookupTabs.update(history.back()),
  forward: () => lookupTabs.update(history.forward()),
  historyDisplay: (filterText) => {
    const histList = history.get();
    let filtered = false;
    if (filterText) {
      filtered = true;
      const filter = new RegExp(filterText.trim().replace(/\s{1,}/g, '|'), 'g');
      histList.list.sort((h1, h2) => regLen(h2.elem, filter) - regLen(h1.elem, filter));
    }

    return historyTemplate.render({filtered, history: histList})
  },
  historyClick: (event) => lookupTabs.update(history.goTo(event.target.value)),
  getDems, setDems});

class Tabs {
  constructor(props) {
    props = props || {};
    const uniqId = Math.floor(Math.random() * 100000);
    const template = new $t('tabs');
    const navTemplate = new $t('popup-cnt/tabs-navigation');
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
    let navContainer, headerContainer, bodyContainer;
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
    this.close = lookupHoverResource.close;

    function setOnclickMethods() {
      const listItems = document.getElementById(LIST_ID).children;
      for (let index = 0; index < listItems.length; index += 1) {
        listItems[index].onclick = switchFunc(index);
      }
    }

    function updateNav() {
      navContainer.innerHTML = navTemplate.render(
        {
          pages, activePage, LIST_CLASS, LIST_ID, CSS_CLASS, ACTIVE_CSS_CLASS,
          LIST_CLASS, LIST_ID
        });
      setOnclickMethods();
    }
    function updateHead() {
      headerContainer.innerHTML = activePage !== undefined ? activePage.header() : '';
      setDems();
    }
    function updateBody() {
      bodyContainer.innerHTML = activePage !== undefined ? activePage.html() : '';
    }
    this.updateNav = updateNav;
    this.updateHead = updateHead;
    this.updateBody = updateBody;

    function switchTo(index) {
      hoverExplanations.disable();
      if (index !== undefined && index !== currIndex) firstRender = true;
      currIndex = index === undefined ? currIndex || 0 : index;
      activePage = pages[currIndex];
      activePage.beforeOpen();
      updateNav();
      updateHead();
      updateBody();
      setDems();
      lookupHoverResource.position().minimize();
      lookupHoverResource.position().select();
      hoverExplanations.position().select().close();
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
      return {CNT_ID, TAB_CNT_ID, NAV_CNT_ID, HEADER_CNT_ID, NAV_SPACER_ID};
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

    function update(word) {
      if (word === undefined) {
        word = properties.get('searchWords');
      } else {
        properties.set('searchWords', word, true);
      }
      switchTo();
    }

    function init() {
      lookupHoverResource.updateContent(template.render(getScope()));
      document.getElementById(TAB_CNT_ID).onmouseup = (e) => {
        e.stopPropagation()
      };
      navContainer = document.getElementById(NAV_CNT_ID);
      headerContainer = document.getElementById(HEADER_CNT_ID);
      bodyContainer = document.getElementById(CNT_ID);
      updateNav();
    }

    lookupHoverResource.onClose(() => {
      hoverExplanations.enable();
      hoverExplanations.letClose();
    });

    this.add = add;
    this.update = update;
    init();
  }
}

const lookupTabs = new Tabs();

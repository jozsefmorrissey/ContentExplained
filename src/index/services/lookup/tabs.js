
const lookupHoverResource = new HoverResources(1);

class Tabs {
  constructor(updateHtml, props) {
    props = props || {};
    const template = new $t('tabs');
    const CSS_CLASS = props.class || 'ce-tabs-list-item';
    const ACTIVE_CSS_CLASS = `${CSS_CLASS} ${props.activeClass || 'ce-tabs-active'}`;
    const LIST_CLASS = props.listClass || 'ce-tabs-list';
    const CNT_ID = props.containerId || 'ce-tabs-cnt-id';
    const LIST_ID = 'ce-tabs-list-id-' + Math.floor(Math.random() * 100000);
    const TAB_CNT_ID = 'ce-tab-cnt-id';
    const instance = this;
    const pages = [];
    const positions = {};
    let currIndex;
    let activePage;
    lookupHoverResource.forceOpen();

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
      HoverExplanations.disable();
      currIndex = index === undefined ? currIndex || 0 : index;
      activePage = pages[currIndex];
      activePage.beforeOpen();
      lookupHoverResource.updateContent(template.render(getScope()));
      lookupHoverResource.select();
      setOnclickMethods();
      activePage.afterOpen();
    }

    function getScope() {
      const content = activePage !== undefined ? activePage.html() : '';
      return {
        CSS_CLASS, ACTIVE_CSS_CLASS, LIST_CLASS, LIST_ID,  CNT_ID, TAB_CNT_ID,
        activePage, content, pages
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
      HoverExplanations.enable();
      HoverExplanations.letClose();
    });

    this.add = add;
    this.update = update;
  }
}

const lookupTabs = new Tabs(lookupHoverResource.updateContent);

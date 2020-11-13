
function lookup() {
  let lookupTemplate = new $t('popup-cnt/lookup');
  let activeIndex = 0;

  function buildLookupHtml() {
    UI.innerHtml(lookupTemplate.render({
      MERRIAM_WEB_SUG_CNT_ID, HISTORY_CNT_ID,
      list: Tab.tabs,
      openTab: 0
    }));
    Tab.updateAll();
  }

  function switchTo(elem, div) {
      const lis = elem.parentElement.children;
      const childs = elem.parentElement.parentElement.querySelector('.ce-lookup-cnt').children;
      for (let index = 0; index < lis.length; index += 1) {
          lis[index].className = lis[index].className.replace(/(^| )active($| )/g, ' ');
          childs[index].style.display = 'none';
      }
      elem.className = elem.className + ' active';
      div.style.display = 'block';
  }

  function call(func) {
    const args = [];
    for (let i = 1; i < arguments.length; i++) args.push(arguments[i]);
    return function () {
      func.apply(null, args);
    }
  }

  function updateTabVisibility() {
    const elems = document.getElementsByClassName('ce-tab-list-item ');
    for (let index = 0; index < elems.length; index += 1) {
      const elem = elems[index];
      if (Tab.tabs[index].show()) {
        elem.style.display = 'block';
      } else {
        elem.style.display = 'none';
      }
    }
  }
  CE.updateTabVisibility = updateTabVisibility;

  function showTab(index) {
    updateTabVisibility();
    const elem = document.getElementsByClassName('ce-tab-list-item ')[index];
    const div = document.getElementById(Tab.tabs[index].id());
    switchTo(elem, div);
  }

  function updateDisplayFunc(div) {
    console.log('lookup');
    return function (event) {
      const elem = event.target.closest('.ce-tab-list-item');
      switchTo(elem, div);
    }
  }

  function initTabs() {
    buildLookupHtml();
      const tabCtns = document.getElementsByClassName('ce-tab-ctn');
      const tabItems = document.getElementsByClassName('ce-tab-ctn')[0]
                      .querySelectorAll('li');
      for (let index = 0; index < tabItems.length; index += 1) {
        tabItems[index].onclick = call(showTab, index);
      }
      // for (let index = 0; index < tabCtns.length; index += 1) {
      //   const tabCtn = tabCtns[index];
      //   const childs = tabCtn.children;
      //   const lis = childs[0].children;
      //     for (let lIndex = 0; lIndex < lis.length; lIndex += 1) {
      //       const li = lis[lIndex];
      //       const div = childs[lIndex + 1];
      //       li.onclick = updateDisplayFunc(div);
      //         if (li.className.split(' ').indexOf('active') !== -1) {
      //             div.style.display = 'block';
      //         }
      //     }
      // }
      showTab(activeIndex);
      CE.showTab = showTab;
  }
  initTabs();
}

afterLoad.push(lookup);

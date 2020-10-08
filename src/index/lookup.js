let lookupTemplate;
function buildLookupHtml() {
  UI.innerHtml(lookupTemplate.render({
    MERRIAM_WEB_SUG_CNT_ID,
    cssUrl: chrome.runtime.getURL('css/lookup.css'),
    list: [{
      imageSrc: 'http://localhost:3000/images/icons/logo.png',
      cntId: CONTEXT_EXPLANATION_CNT_ID,
      active: true,
    },{
      imageSrc: 'http://localhost:3000/images/icons/Merriam-Webster.png',
      cntId: MERRIAM_WEB_DEF_CNT_ID
    },{
      imageSrc: 'http://localhost:3000/images/icons/wikapedia.png',
      cntId: WIKI_CNT_ID
    }]
  }));
}

function disableAll(elem) {
    const childs = elem.closest('.ce-tab-ctn').children;
    const lis = childs[0].children;
    for (let index = 0; index < lis.length; index += 1) {
        lis[index].className = lis[index].className.replace(/(^| )active($| )/g, ' ');
        childs[index + 1].style.display = 'none';
    }
}

function updateDisplayFunc(div) {
  console.log('lookup');
  return function (event) {
    const elem = event.target.closest('.ce-tab-list-item');
    disableAll(elem);
    elem.className = elem.className + ' active';
    div.style.display = 'block';
  }
}

function initTabs() {
  lookupTemplate = new $t('lookup');
  buildLookupHtml();
    const tabCtns = document.getElementsByClassName('ce-tab-ctn');
    for (let index = 0; index < tabCtns.length; index += 1) {
      const tabCtn = tabCtns[index];
      const childs = tabCtn.children;
      const lis = childs[0].children;
        for (let lIndex = 0; lIndex < lis.length; lIndex += 1) {
          const li = lis[lIndex];
          const div = childs[lIndex + 1];
          li.onclick = updateDisplayFunc(div);
            if (li.className.split(' ').indexOf('active') !== -1) {
                div.style.display = 'block';
            }
        }
    }
}

afterLoad.push(initTabs);

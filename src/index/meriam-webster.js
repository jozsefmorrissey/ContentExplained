
const apiKey = 'f4ab4d93-c3ef-4af2-9d83-27b946471849';

class MerriamWebster extends Object {
  constructor(selection, success, failure) {
    const meriamTemplate = new $t('popup-cnt/tab-contents/webster');
    const meriamSugTemplate = new $t('popup-cnt/linear-tab');
    super();
    const instance = {};

    instance.success = function (data) {
      const elem = data[0];
      if (elem.meta && elem.meta.stems) {
        instance.data = data.filter(elem => elem.meta.stems.indexOf(selection) !== -1);;
        instance.defHtml = meriamTemplate.render({data: instance.data, key: selection});
      } else {
        const noSpace = [];
        instance.data = data;
        instance.suggestionHtml = meriamSugTemplate.render(data);
      }
      if ((typeof success) === 'function') success(instance);
    }

    instance.failure = function () {
      if ((typeof failure) === 'function') failure(instance);
      console.error('Call to Meriam Webster failed');
    }

    if ((typeof selection) === 'string') {
      const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${selection}?key=${apiKey}`;
      Request.get(url, instance.success, instance.failure);
    }
  }

}

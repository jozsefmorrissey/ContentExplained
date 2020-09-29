const apiKey = 'f4ab4d93-c3ef-4af2-9d83-27b946471849';


class MerriamWebster extends Object {
  constructor(selection, success, failure) {
    super();
    const instance = {};

    instance.success = function (data) {
      const elem = data[0];
      if (elem.meta && elem.meta.stems) {
        instance.data = data.filter(elem => elem.meta.stems.indexOf(selection) !== -1);;
        instance.defHtml = $t({data: instance.data, key: selection}, 'websterWebster');
      } else {
        instance.data = data;
        instance.suggestionHtml = $t(data, 'websterWebsterSuggestions');
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

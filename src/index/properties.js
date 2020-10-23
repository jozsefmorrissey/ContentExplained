
class Properties {
  constructor () {
    const properties = {};
    const updateFuncs = {};
    const instance = this;

    function notify(key) {
      const funcList = updateFuncs[key];
      for (let index = 0; funcList && index < funcList.length; index += 1) {
        funcList[index](properties[key]);
      }
    }

    this.set = function (key, value, storeIt) {
        properties[key] = value;
        if (storeIt) {
          const storeObj = {};
          storeObj[key] = value;
          chrome.storage.local.set(storeObj);
        } else {
          notify(key);
        }
    };

    this.get = function (key) {
      if (arguments.length === 1) {
        return properties[key]
      }
      const retObj = {};
      for (let index = 0; index < arguments.length; index += 1) {
        key = arguments[index];
        retObj[key] = properties[key];
      }
    };

    function storageUpdate (values) {
      const keys = Object.keys(values);
      for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];
        const value = values[key];
        if (value.newValue) {
          instance.set(key, values[key].newValue);
        } else {
          instance.set(key, value);
        }
      }
    }

    function keyDefinitionCheck(key) {
      if (key === undefined) {
        throw new Error('key must be defined');
      }
    }

    this.onUpdate = function (key, func) {
      keyDefinitionCheck(key);
      if ((typeof func) !== 'function') throw new Error('update function must be defined');
      if (updateFuncs[key] === undefined) {
        updateFuncs[key] = [];
      }
      updateFuncs[key].push(func);
      func(properties[key])
    }

    chrome.storage.local.get(null, storageUpdate);
    chrome.storage.onChanged.addListener(storageUpdate);
  }
}

afterLoad.push(function () {CE.properties = new Properties();})


class Properties {
  constructor () {
    const properties = {};
    const updateFuncs = {};
    const interface = {};

    function notify(key) {
      const funcList = updateFuncs[key];
      for (let index = 0; funcList && index < funcList.length; index += 1) {
        funcList[index](value);
      }
    }

    interface.set = function (key, value, storeIt) {
        properties[key] = value;
        if (storeIt) {
          chrome.storage.local.set(key, value);
        } else {
          notify(key);
        }
    };

    interface.get = function (key) {
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
        interface.add(key, values[index]);
      }
    }

    function keyDefinitionCheck(key) {
      if (key === undefined) {
        throw new Error('key must be defined');
      }
    }

    this.onUpdate = function (key, func) {
      keyDefinitionCheck(key);
      if ((typeof key) !== func) throw new Error('update function must be defined');
      if (updateFuncs[key] === undefined) {
        updateFuncs[key] = [];
      }
      updateFuncs[key].add(func);
    }

    function init() {
      chrom.storage.local.getAll(storageUpdate);
    }

    chrome.storage.onChanged.addListener(storageUpdate);
  }
}

props = new Properties();

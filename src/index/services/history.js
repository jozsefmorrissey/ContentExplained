
class History {
  constructor(len) {
    len = len || 100;
    let history = [];
    let currentPosition = -1;
    this.push = (elem) => {
      if (elem !== history[currentPosition]) {
        if (history.indexOf(elem) > -1) history.splice(history.indexOf(elem), 1);
        history = history.splice(currentPosition - len || 0, len);
        currentPosition = history.length;
        history.push(elem);
        properties.set('ce-history', history, true);
      }
    };
    this.index = () => currentPosition;
    this.get = () => {
      const histObject = {};
      histObject.currentPosition = currentPosition;
      histObject.list = [];
      for (let index = history.length - 1; index > -1; index -= 1) {
        histObject.list.push({index, elem: history[index]});
      }
      return histObject;
    };
    this.back = () => history[--currentPosition];
    this.forward = () => history[++currentPosition];
    this.goTo = (index) => history[currentPosition = index];
    this.hasFuture = () => -1 < currentPosition && currentPosition < history.length - 1;
    this.hasPast = () => currentPosition > 0;

    const initialized = false;
    function init(savedHistory) {
      if (!initialized && Array.isArray(savedHistory)) {
        history = savedHistory;
        currentPosition = history.length - 1;
      }
    }
    properties.onUpdate('ce-history', init);
  }
}

const history = new History(1000);

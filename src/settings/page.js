class Page {
  constructor() {
    this.label = function () {throw new Error('Must implement label()');};
    this.template = function() {throw new Error('Must implement template()');}
    this.scope = function () {return {};};
    this.onOpen = function () {};
    this.onClose = function () {};
    this.beforeOpen = function () {};
    this.hide = function() {return false;}
  }
}

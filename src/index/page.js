
class Page {
  constructor() {
    this.label = function () {throw new Error('Must implement label()');};
    this.html = function() {throw new Error('Must implement template()');}
    this.beforeOpen = function () {};
    this.afterOpen = function () {};
    this.hide = function() {return false;}
  }
}

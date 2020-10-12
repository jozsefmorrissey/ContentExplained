
class Tab {
  constructor(imageSrc, id, template, show) {
    const t = new $t(template);
    show = show || function () {return true;};

    this.imageSrc = function () {return imageSrc};
    this.id = function () {return id;}
    this.template = function () {return template;}
    this.show = show;
    this.update = function (scope) {
      document.getElementById(id).innerHtml = t.render(scope);
    }
    Tab.tabs.push(this);
  }
}

Tab.tabs = [];

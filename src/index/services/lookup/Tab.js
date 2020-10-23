
class Tab {
  constructor(imageSrc, id, template, show) {
    const t = new $t(template);
    show = show || function () {return true;};

    this.imageSrc = function () {return imageSrc};
    this.id = function () {return id;}
    this.template = function () {return template;}
    this.show = show;
    this.update = function (scope) {
      document.getElementById(id).innerHTML = t.render(scope);
    }

    Tab.tabs.push(this);
  }
}

Tab.tabs = [];
Tab.updateAll = function () {
  for (let index = 0; index < Tab.tabs.length; index += 1) {
    Tab.tabs[index].update();
  }
}

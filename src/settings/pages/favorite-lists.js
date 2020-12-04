
class FavoriteLists extends Page {
  constructor() {
    super();
    this.label = function () {return 'Favorite Lists';};
    this.hide = function () {return !User.isLoggedIn();}
    this.template = function() {return 'icon-menu/links/favorite-lists';}
  }
}
new Settings(new FavoriteLists());

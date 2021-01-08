
class FavoriteLists extends Page {
  constructor() {
    super();
    this.label = function () {return 'Favorite Lists';};
    this.hide = function () {
      const hidden = !User.isLoggedIn(true);
      return hidden;
    }
    this.template = function() {return 'icon-menu/links/favorite-lists';}
  }
}

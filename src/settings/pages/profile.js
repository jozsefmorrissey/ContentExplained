
class Profile extends Page {
  constructor() {
    super();
    const scope = {
      LOGOUT_BTN_ID: 'ce-logout-btn',
      UPDATE_BTN_ID: 'ce-update-btn',
      USERNAME_INPUT_ID: 'ce-username-input',
      CURRENT_EMAIL_INPUT_ID: 'ce-current-email-input',
      NEW_EMAIL_INPUT_ID: 'ce-new-email-input',
      UPDATE_FORM_ID: 'ce-update-form'
    };
    const updateEmailSent = 'Email sent: you must confirm changes';
    this.label = function () {return 'Profile';};
    this.template = function() {return 'icon-menu/links/profile';}
    this.hide = function () {return !User.isLoggedIn(true);}
    this.scope = function () {return scope;};
    this.beforeOpen = function () {
      if (!this.hide()) {
        let user = User.loggedIn();
        if (user) {
          scope.id = user.id;
          scope.username = user.username;
          scope.likes = user.likes;
          scope.dislikes = user.dislikes;
        }
      }
    }

    function setError(errMsg) {
      return function (err) {
        scope.importantMessage = errMsg || err.errorMsg
        console.info(err);
        Settings.updateMenus();
      }
    }

    function update() {
      let body = {user: {}};
      body.originalEmail = document.getElementById(scope.CURRENT_EMAIL_INPUT_ID).value;
      body.user.id = User.loggedIn().id;
      body.user.username = document.getElementById(scope.USERNAME_INPUT_ID).value || undefined;
      body.user.email = document.getElementById(scope.NEW_EMAIL_INPUT_ID).value || undefined;
      const url = EPNTS.user.requestUpdate();
      Request.post(url, body, setError(updateEmailSent), setError());
    }

    this.onOpen = function () {
      document.getElementById(scope.LOGOUT_BTN_ID).addEventListener("click", User.logout);

      Form.onSubmit(scope.UPDATE_FORM_ID, update);
      // document.getElementById(scope.UPDATE_BTN_ID).addEventListener("click", update);
    }
  }
}

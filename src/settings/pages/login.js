
class Login extends Page {
  constructor() {
    super();
    const scope = {
      LOGIN: 'Login',
      CREATE: 'create',
      CHECK: 'check',
      EMAIL_INPUT: 'ce-email-input',
      USERNAME_INPUT: 'ce-username-input',
      LOGIN_BTN_ID: 'ce-login-btn',
      REGISTER_BTN_ID: 'ce-register-btn',
      RESEND_BTN_ID: 'ce-resend-btn',
      LOGOUT_BTN_ID: 'ce-remove-btn',
    };
    const instance = this;
    let user, secret;
    scope.state = scope.LOGIN;
    this.label = function () {return 'Login';};
    this.template = function() {return 'icon-menu/links/login';};
    this.hide = function () {return User.isLoggedIn();};
    this.scope = function () {return scope;};

    function setState(state) {
      return function () {
        scope.state = state;
        Settings.updateMenus();
      }
    }

    function setError(error) {
      switch (scope.state) {
        case scope.LOGIN:
          if (error.status === 404) {
            setState(scope.REGISTER)();
          } else if (error) {
            scope.errorMsg = error;
          } else {
            scope.errorMsg = 'Server Error';
          }
          break;
        case scope.REGISTER:
          scope.errorMsg = 'Username Taken';
          break;
        default:
          scope.errorMsg = 'Server Error';
      }

      Settings.updateMenus();
    }

    let lastStatus = 'expired';
    let lastUser;
    function credentialUpdated(e) {
      if (User && User.status() !== lastStatus) {
        lastStatus = User.status();
        lastUser = user;
        switch (lastStatus) {
          case 'active':
          profileSetting.activate();
          break;
          case 'pending':
          setState(scope.CHECK)();
          break;
          case 'expired':
          setState(scope.LOGIN)();
          break;
          default:
          console.error('Unknown user status')
        }
      }
    }

    function setUser(user) {
      User.addCredential(user.id);
    }

    function getUser () {
      scope.email = document.getElementById(scope.EMAIL_INPUT).value;
      User.get(scope.email, setUser, setError);
    }

    function register () {
      scope.username = document.getElementById(scope.USERNAME_INPUT).value;
      User.register(scope.email, scope.username);
    }

    function onEnter(id, func) {
      const elem = document.getElementById(id);
      if (elem !== null) {
        elem.addEventListener('keypress', (e) => {
          if(e.key === 'Enter') func()
        });
      }
    }

    function resetErrorCall(func) {
      return function () {scope.errorMsg = undefined; func();}
    }

    this.onOpen = function () {
      credentialUpdated();
      const loginBtn = document.getElementById(scope.LOGIN_BTN_ID);
      const registerBtn = document.getElementById(scope.REGISTER_BTN_ID);
      const resendBtn = document.getElementById(scope.RESEND_BTN_ID);
      const logoutBtn = document.getElementById(scope.LOGOUT_BTN_ID);


      registerBtn.addEventListener("click", resetErrorCall(register));
      loginBtn.addEventListener("click", resetErrorCall(getUser));
      resendBtn.addEventListener("click", resetErrorCall(User.addCredential));
      logoutBtn.addEventListener("click", resetErrorCall(User.logout));

      onEnter(scope.EMAIL_INPUT, resetErrorCall(getUser));
      onEnter(scope.USERNAME_INPUT, resetErrorCall(register));
    }
    document.addEventListener(User.errorEvent(), setError);
  }
}
new Settings(new Login());

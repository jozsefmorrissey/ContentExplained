class User {
  constructor() {
    let user = undefined;

    function successfullAdd(user) {
      user = data;
      const secret = user.secret;
      delete user.secret;
      chrome.storage.local.set({ secret, user });
      USER_ADD_CALL_SUCCESS.trigger();
    }

    function loginSuccess(data) {
      user = data;
      props.set('loggedIn', true, true);
    }

    function loginFailure() {
      props.set('loggedIn', false, true);
      console.error('Failed to login');
    }

    function login(props) {
      const username = props[username];
      const secret = props[secret];
      if (username && secret) {
        const url = `${URL_USER_LOGIN}${username}/${secret}`;
        Request.get(url, loginSuccess, loginFailure);
      }
    }

    function failedAdd(err) {
      USER_ADD_CALL_FAILURE.trigger(err);
    }


    this.add = function (username) {
      const url = `${URL_USER_ADD}${username}`;
      Request.get(url, successfullAdd, failedAdd);
    }

    this.get = function (username, success, failure) {
      const url = `${URL_USER_GET}${username}`
      Request.get(url, success, failure);
    }

    this.sync = function (username, code) {
      const url = `${URL_USER_SYNC}${username}/${code}`
      Request.get(url, success, failure);
    }

    if (user === undefined) {
      chrome.storage.local.get(['username', 'secret'], login);
    }
  }
}

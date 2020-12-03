
class User {
  constructor() {
    let user;
    let status = 'expired';
    const instance = this;
    function dispatch(eventName, values) {
      return function (err) {
        const evnt = new Event(eventName);
        Object.keys(values).map((key) => evnt[key] = values[key])
        document.dispatchEvent(evnt);
        if (err) {
          console.error(err);
        }
      }
    }
    function dispatchUpdate() {
      dispatch(instance.updateEvent(), {
        user: instance.loggedIn(),
        status
      })();
    }
    function dispatchError(errorMsg) {
      return dispatch(instance.errorEvent(), {errorMsg});
    }
    function setUser(u) {
      user = u;
      dispatchUpdate();
      console.log('update user event fired')
    }

    function updateStatus(s) {
      status = s;
      CE.properties.set('user.status', status, true);
      dispatchUpdate();
      console.log('update status event fired');
    }

    this.status = () => status;
    this.errorEvent = () => 'UserErrorEvent';
    this.updateEvent = () => 'UserUpdateEvent'
    this.isLoggedIn = function () {
      return status === 'active' && user !== undefined;
    }
    this.loggedIn = () => instance.isLoggedIn() ? JSON.parse(JSON.stringify(user)) : undefined;

    this.get = function (email, success, fail) {
      if (email.match(/^.{1,}@.{1,}\..{1,}$/)) {
        const url = CE.EPNTS.user.get(email);
        CE.Request.get(url, success, fail);
      } else {
        fail('Invalid Email');
      }
    }

    function removeCredential() {
      const cred = CE.properties.get('user.credential');
      if (cred !== null) {
        CE.properties.set('user.credential', null, true);
        instance.update();
      }

      user = undefined;
      updateStatus('expired');
    }

    this.logout = function () {
      const cred = CE.properties.get('user.credential');
      dispatchUpdate();
      if(cred !== null) {
        if (status === 'active') {
          const deleteCredUrl = CE.EPNTS.credential.delete(cred);
          CE.Request.delete(deleteCredUrl, removeCredential, instance.update);
        } else {
          removeCredential();
        }
      }
    };

    const userCredReg = /^User ([0-9]{1,})-.*$/;
    this.update = function (credential) {
      if ((typeof credential) === 'string') {
        if (credential.match(userCredReg)) {
          CE.properties.set('user.credential', credential, true);
        } else {
          removeCredential();
          credential = null;
        }
      } else {
        credential = CE.properties.get('user.credential');
      }
      if ((typeof credential) === 'string') {
        let url = CE.EPNTS.credential.status(credential);
        CE.Request.get(url, updateStatus);
        url = CE.EPNTS.user.get(credential.replace(userCredReg, '$1'));
        CE.Request.get(url, setUser);
      } else if (credential === null) {
        instance.logout(true);
      }
    };

    const addCredErrorMsg = 'Failed to add credential';
    this.addCredential = function (uId) {
      if (user !== undefined) {
        const url = CE.EPNTS.credential.add(user.id);
        CE.Request.get(url, instance.update, dispatchError(addCredErrorMsg));
      } else if (uId !== undefined) {
        const url = CE.EPNTS.credential.add(uId);
        CE.Request.get(url, instance.update, dispatchError(addCredErrorMsg));
      }
    };

    this.register = function (email, username) {
      const url = CE.EPNTS.user.add();
      const body = {email, username};
      CE.Request.post(url, body, instance.update, dispatchError('Registration Failed'));
    };

    this.openLogin = () => {
      const tabId = properties.get("SETTINGS_TAB_ID")
      const page = properties.get("settingsPage");
      window.open(`${page}#Login`, tabId);
    };

    afterLoad.push(() => CE.properties.onUpdate(['user.credential', 'user.status'], () => this.update()));
  }
}

User = new User();

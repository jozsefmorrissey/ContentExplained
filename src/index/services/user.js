
class User {
  constructor() {
    let user;
    let status;
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
      properties.set('user', u, true);
      console.log('update user event fired')
    }

    function updateStatus(s) {
      status = s;
      properties.set('user.status', status, true);
      dispatchUpdate();
      console.log('update status event fired');
    }

    this.status = () => status;
    this.errorEvent = () => 'UserErrorEvent';
    this.updateEvent = () => 'UserUpdateEvent'
    this.isLoggedIn = function (defVal) {
      return status === undefined ? defVal : status === 'active';
    }
    this.loggedIn = () => instance.isLoggedIn() ? JSON.parse(JSON.stringify(user || {})) : undefined;

    this.get = function (email, success, fail) {
      if (email.match(/^.{1,}@.{1,}\..{1,}$/)) {
        const url = EPNTS.user.get(email);
        Request.get(url, success, fail);
      } else {
        fail('Invalid Email');
      }
    }

    function removeCredential() {
      const cred = properties.get('user.credential');
      if (cred !== null) {
        properties.set('user.credential', null, true);
        properties.set('user', null, true);
        instance.update();
      }

      user = undefined;
      updateStatus('expired');
    }

    this.logout = function () {
      const cred = properties.get('user.credential');
      dispatchUpdate();
      if(cred !== null) {
        if (status === 'active') {
          const deleteCredUrl = EPNTS.credential.delete(cred);
          Request.delete(deleteCredUrl, removeCredential, instance.update);
        } else {
          removeCredential();
        }
      }
    };

    const userCredReg = /^User ([0-9]{1,})-.*$/;
    this.update = function (credential) {
      if ((typeof credential) === 'string') {
        if (credential.match(userCredReg)) {
          properties.set('user.credential', credential, true);
        } else {
          removeCredential();
          credential = null;
        }
      } else {
        credential = properties.get('user.credential');
      }
      if ((typeof credential) === 'string') {
        let url = EPNTS.credential.status(credential);
        Request.get(url, updateStatus, () => updateStatus('expired'));
        const u = properties.get('user');
        if (u === null || u === undefined || u.id !==
              Number.parseInt(credential.replace(/User ([0-9]{1,})-.*$/, '$1'))) {
          url = EPNTS.user.get(credential.replace(userCredReg, '$1'));
          Request.get(url, setUser);
          console.log('User Requested!')
        } else {
          setUser(u);
          console.log('No User Request!')
        }
      } else if (credential === null || credential === undefined) {
        updateStatus('expired');
        instance.logout(true);
      }
    };

    const addCredErrorMsg = 'Failed to add credential';
    this.addCredential = function (uId) {
      if (user !== undefined) {
        const url = EPNTS.credential.add(user.id);
        Request.get(url, instance.update, dispatchError(addCredErrorMsg));
      } else if (uId !== undefined) {
        const url = EPNTS.credential.add(uId);
        Request.get(url, instance.update, dispatchError(addCredErrorMsg));
      }
    };

    this.register = function (email, username) {
      const url = EPNTS.user.add();
      const body = {email, username};
      Request.post(url, body, instance.update, dispatchError('Registration Failed'));
    };

    this.openLogin = () => {
      const tabId = properties.get("SETTINGS_TAB_ID")
      const page = properties.get("settingsPage");
      window.open(`${page}#Login`, tabId);
    };

    afterLoad.push(() => properties.onUpdate(['user.credential', 'user.status', 'user'], () => this.update()));
  }
}

User = new User();

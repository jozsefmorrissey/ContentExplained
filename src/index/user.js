class User {
  constructor() {
    this.user = undefined;

    function successfullAdd(user) {
      user = data;
      const secret = user.secret;
      delete user.secret;
      chrome.storage.local.set({ secret, user });
      USER_ADD_CALL_SUCCESS.trigger();
    }

    function failedAdd(err) {
      USER_ADD_CALL_FAILURE.trigger(err);
    }


    this.add = function (username) {
      const url = `https://localhost:3001/content-explained/add/user/${username}`;
      Request.get(url, successfullAdd, failedAdd);
    }

    this.get = function (words, success, failure) {
      const url = `https://localhost:3001/content-explained/${words}`
      Request.get(url, success, failure);
    }

    function successfullOpinion (data) {
      const likeElems = document.getElementsByClassName('ce-likes');
      likeElems.forEach((item, i) => {
        item.innerHTML = data.likes;
      });
      const dislikeElems = document.getElementsByClassName('ce-dislikes');
      dislikeElems.forEach((item, i) => {
        item.innerHTML = data.likes;
      });
    }

    this.loggedIn = function () {
      return user !== undefined;
    }
  }
}

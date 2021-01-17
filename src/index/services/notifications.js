
class Notifications {
  constructor (activeTime) {
    const EXPLANATION = 'Explanation';
    const COMMENT = 'Comment';
    const QUESTION = 'Question';
    let notifications = {currPage: [], otherPage: []};

    this.hasNotifications = () => notifications.currPage.length > 0 &&
          notifications.otherPage.length > 0;

    this.getNotifications = () => JSON.parse(JSON.stringify(notifications));

    function words(data) {
      return data.explanation.words;
    }

    function fullText(data) {
      switch (data.type) {
        case EXPLANATION:
          return data.explanation.content;
        case COMMENT:
          return data.comment.value;
        case QUESTION:
          return data.explanation.content;
        default:
          return "Error getting text data";

      }
    }

    function shortText(data) {
        return fullText(data).substr(0, 20);
    }

    function author(data) {
      switch (data.type) {
        case EXPLANATION:
          return data.explanation.author.username;
        case COMMENT:
          return data.comment.author.username;
        case QUESTION:
        return data.explanation.author.username;
        default:
          return "Error getting author data";

      }
    }

    function getClass() {
      return `${data.type.tolowercase()}-notification`;
    }

    function update() {
      const user = User.loggedIn();
      if (user) {
        const userId = user.id;
        const siteUrl = window.location.href;
        Request.post(ENPTS.notification.get(), {userId, siteUrl}, (notes) => notifications = notes);
      }
    }

    afterLoad.push(() => properties.onUpdate(['user.credential', 'user.status'], () => update()));
















// -------------------------------------- User Present ----------------------//
    let activationCounter = -1;
    let isActive = false;

    this.hasPending = () => true;

    function activate() {
      activationCounter++;
      if (isActive === false) {
        isActive = true;
        console.log('active!');
      }
    }

    function deactivate(activationId) {
      return function () {
        if (activationId === activationCounter) {
          console.log('deactivated')
          isActive = false;
        }
      }
    }

    function activationTimer() {
      setTimeout(deactivate(activationCounter), activeTime);
    }

    window.addEventListener('focus', activate);
    window.addEventListener('blur', activationTimer);
    activate();
  }
}

Notifications = new Notifications(10000);

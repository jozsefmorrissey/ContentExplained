
class Notifications {
  constructor (activeTime) {
    const EXPLANATION = 'Explanation';
    const COMMENT = 'Comment';
    const QUESTION = 'Question';
    const template = new $t('notifications');
    const popup = new DragDropResize({position: 'fixed', height: '25vh', width: 'fit-content',
        minWidth: 0, minHeight: 0});
    popup.top().right();
    const instance = this;
    const byKey = {};
    let notifications = {currPage: [], otherPage: []};

    function key(note) {
      return `${note.type}-${note.id}`;
    }

    function gotoNotification(target) {
      const noteKey = target.getAttribute('ce-notification-key');
      const note = byKey[noteKey];
      let getElem;
      if (note.type === 'Comment') {
        getElem = () => document.querySelector(`[ce-comment-id="${note.comment.id}"]`);
      } else {
        getElem = () => hoverExplanations.getExplCnt();
      }
      const func = () => scrollIntoView(getElem(), 40, 10)
      hoverExplanations.displayExistingElem(note.explanation, func);
    }

    function openPage(target) {
      const url = target.getAttribute('ce-open');
      const name = target.getAttribute('ce-target');
      window.open(url, name);
    }

    matchRun('click', '[ce-open]', openPage, popup.container())
    matchRun('click', '[ce-notification-key]', gotoNotification, popup.container())


    this.hasNotifications = () => notifications.currPage.length > 0 &&
          notifications.otherPage.length > 0;

    this.getNotifications = () => JSON.parse(JSON.stringify(notifications));

    const getHeading = (note) => note.explanation.words;

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

    function getClass(note) {
      return `ce-notification ${note.type.toLowerCase()}-notification`;
    }

    this.html = () => template.render({key, notifications, getHeading, getText: shortText, getClass});

    function setNotifications(notes) {
      notifications = notes;
      notes.currPage.forEach((note) => byKey[key(note)] = note)
      popup.updateContent(instance.html());
      popup.show();
    }

    function update() {
      const user = User.loggedIn();
      if (user && user.id) {
        const userId = user.id;
        const siteUrl = window.location.href;
        Request.post(EPNTS.notification.get(), {userId, siteUrl}, setNotifications);
      }
    }

    document.addEventListener(User.updateEvent(), update);
















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

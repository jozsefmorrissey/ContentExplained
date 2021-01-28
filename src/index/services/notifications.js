
class Notifications {
  constructor (activeTime) {
    const EXPLANATION = 'Explanation';
    const COMMENT = 'Comment';
    const QUESTION = 'Question';
    const template = new $t('notifications');
    const popup = new DragDropResize({
      position: 'fixed', height: '25vh', width: 'fit-content',
      minWidth: 0, minHeight: 0, overflow: 'auto'
    });
    popup.top().right();
    const instance = this;
    const byKey = {};
    let currPage = [];
    let otherPage = [];

    function cleanUrl(url) {
      return url.replace(/^http(s):\/\//, 'http://');
    }

    function key(note) {
      return `${note.type}-${note.id}`;
    }

    function notificationChecked() {
      properties.set('displayNotification', null, true);
    }

    function gotoNotification(noteKey) {
      const note = byKey[noteKey];
      let getElem;
      if (note.type === 'Comment') {
        getElem = () => document.querySelector(`[ce-comment-id="${note.comment.id}"]`);
      } else {
        getElem = () => hoverExplanations.getExplCnt();
      }
      const func = () => scrollIntoView(getElem(), 40, 10)
      hoverExplanations.displayExistingElem(note.explanation, func);
      toggleParents(getElem(), false);
    }

    function shouldDisplay(displayNotification) {
      if (displayNotification) {
        const noteUrl = cleanUrl(displayNotification.url);
        const currUrl = cleanUrl(window.location.href);
        if(noteUrl === currUrl) {
          gotoNotification(displayNotification.noteKey);
          setTimeout(notificationChecked, 5000);
        }
      }
    }

    let winder;
    const windowName = `window`;
    function openPage(target) {
      const url = target.getAttribute('ce-open');
      const noteKey = target.getAttribute('ce-target');
      properties.set('displayNotification', {url, noteKey}, true)
      winder = window.open(url, windowName);
    }

    matchRun('click', '[ce-open]', openPage, popup.container())
    matchRun('click', '[ce-notification-key]',
          (target) => gotoNotification(target.getAttribute('ce-notification-key')),
          popup.container())


    this.hasNotifications = () => currPage.length > 0 &&
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

    this.html = () => template.render({key, currPage, otherPage, getHeading, getText: shortText, getClass});

    function setNotifications(notes, dontSave) {
      if (!dontSave) {
        properties.set('user.notifications', notes, true);
      }
      const currSite = cleanUrl(window.location.href);
      notes.forEach((notification) => {
        const noteSite = cleanUrl(notification.site.url);
        if (noteSite === currSite) {
          byKey[key(notification)] = notification;
          currPage.push(notification);
        } else {
          otherPage.push(notification);
        }
      });
      popup.updateContent(instance.html());
      properties.onUpdate('displayNotification', shouldDisplay);
      popup.show();
    }

    function update() {
      const savedNotifications = properties.get('user.notifications');
      const user = User.loggedIn();
      if (user && user.id) {
        if (savedNotifications === null || savedNotifications === undefined) {
          const userId = user.id;
          const siteUrl = window.location.href;
          Request.post(EPNTS.notification.get(), {userId, siteUrl}, setNotifications);
          console.log('requested notifications!')
        } else {
          setNotifications(savedNotifications, true)
          console.log('did not request notifications!')
        }
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

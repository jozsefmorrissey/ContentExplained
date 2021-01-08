
class Notifications {
  constructor (activeTime) {
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

    function currentAlerts() {
      return ['hey', 'how', 'are', 'you'];
    }

    function otherSites() {
      return [
        'http://www.trex.com',
        'http://www.potomous.com',
        'http://www.rino.com',
        'http://www.duck.com',
        'http://www.hippo.com'
      ]
    }

    function activationTimer() {
      setTimeout(deactivate(activationCounter), activeTime);
    }

    window.addEventListener('focus', activate);
    window.addEventListener('blur', activationTimer);
    activate();

    this.currentAlerts = currentAlerts;
    this.otherSites = otherSites;
  }
}

Notifications = new Notifications(10000);

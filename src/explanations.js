class Explanations {
  constructor(list) {
    this.list = list ? list : [];
    this.add = function (expl) {
      this.list.push(expl);
    }

    function onStateChange(success, failure) {
      return function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            var data = JSON.parse(this.responseText);
            if (success) {
              success(data);
            }
          } else if (failure) {
            failure(oXHR.status, oXHR.statusText);
          }
        }
      }
    };

    this.get = function (words, success, failure) {
      const xhr = new XMLHttpRequest();
      const url = `http://localhost:3000/content-explained/${words}`
      xhr.open("GET", url, true);
      xhr.onreadystatechange =  onStateChange(success, failure);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
    }
  }
}

console.log("HERE!!!!! ", chrome.runtime.getURL('./html/text-to-html.html'));

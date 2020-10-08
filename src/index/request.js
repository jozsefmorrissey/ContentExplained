Request = {
    onStateChange: function (success, failure) {
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
    },

    get: function (url, success, failure) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange =  Request.onStateChange(success, failure);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
      return xhr;
    },

    post: function (url, body, success, failure) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange =  Request.onStateChange(success, failure);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(body));
      return xhr;
    }
}

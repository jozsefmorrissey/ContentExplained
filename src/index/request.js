
Request = {
    onStateChange: function (success, failure) {
      let savedServerId;
      return function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            savedServerId = savedServerId || properties.get('ceServerId');
            const currServerId = this.headers['ce-server-id'];
            if (savedServerId && currServerId !== savedServerId) {
              CE_SERVER_UPDATE.trigger();
            }
            var resp = this.responseText;
            try {
              resp = JSON.parse(this.responseText);
            } catch (e){}
            if (success) {
              success(resp);
            }
          } else if (failure) {
            failure(this);
          }
        }
      }
    },

    get: function (url, success, failure) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange =  Request.onStateChange(success, failure);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', CE.properties.get('credential'));
      xhr.send();
      return xhr;
    },

    hasBody: function (method) {
      return function (url, body, success, failure) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.onreadystatechange =  Request.onStateChange(success, failure);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', CE.properties.get('credential'));
        xhr.send(JSON.stringify(body));
        return xhr;
      }
    },

    post: function () {Request.hasBody('POST')(...arguments)},
    delete: function () {Request.hasBody('DELETE')(...arguments)},
    options: function () {Request.hasBody('OPTIONS')(...arguments)},
    head: function () {Request.hasBody('HEAD')(...arguments)},
    put: function () {Request.hasBody('PUT')(...arguments)},
    connect: function () {Request.hasBody('CONNECT')(...arguments)},
}

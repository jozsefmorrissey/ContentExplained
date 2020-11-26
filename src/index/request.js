
dg.setRoot('ce-ui');

Request = {
    onStateChange: function (success, failure, id) {
      let savedServerId;
      return function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            if (this.headers) {
              savedServerId = savedServerId || properties.get('ceServerId');
              const currServerId = this.headers['ce-server-id'];
              if (currServerId && savedServerId && currServerId !== savedServerId) {
                CE_SERVER_UPDATE.trigger();
              }
            }
            var resp = this.responseText;
            CE.dg.value(id || Request.id(), 'response url', this.responseURL);
            CE.dg.value(id || Request.id(), 'response', resp);
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

    id: function (url, method) {
      return `request.${method}.${url}`;
    },

    get: function (url, success, failure) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      const id = Request.id(url, 'get');
      CE.dg.value(id, 'url', url);
      CE.dg.value(id, 'method', 'get');
      CE.dg.addHeaderXhr(xhr);
      xhr.onreadystatechange =  Request.onStateChange(success, failure, id);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', CE.properties.get('credential'));
      xhr.send();
      return xhr;
    },

    hasBody: function (method) {
      return function (url, body, success, failure) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        const id = Request.id(url, 'get');
        CE.dg.value(id, 'url', url);
        CE.dg.value(id, 'method', method);
        CE.dg.value(id, 'body', body);
        CE.dg.addHeaderXhr(xhr);
        xhr.onreadystatechange =  Request.onStateChange(success, failure, id);
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

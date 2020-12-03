
class Expl {
  constructor () {
    let currEnv;
    function createHoverResouces (data) {
      properties.set('siteId', data.siteId);
      HoverExplanations.set(data.list);
    }

    function addHoverResources () {
      const enabled = properties.get('enabled');
      const env = properties.get('env');
      if (enabled && env !== currEnv) {
        currEnv = env;
        EPNTS.setHost(env);
        const url = EPNTS.siteExplanation.get();
        Request.post(url, {siteUrl: window.location.href}, createHoverResouces);
      }
    }

    this.get = function (words, success, fail) {
      const url = EPNTS.explanation.get(words);
      Request.get(url, success, fail);
    };

    this.siteList = function (success, fail) {
    };

    this.authored = function (authorId, success, fail) {
      const url = EPNTS.explanation.author(authorId);
      Request.get(url, succes, fail);
    };

    this.add = function (words, content, success, fail) {
      const url = EPNTS.explanation.add();
      Request.post(url, {words, content}, success, fail);
    };


    properties.onUpdate(['enabled', 'env'], addHoverResources);
  }
}

Expl = new Expl();

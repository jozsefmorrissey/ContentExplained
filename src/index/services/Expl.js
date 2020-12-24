
class Expl {
  constructor () {
    let currEnv;
    let explanations = {};
    function createHoverResouces (data) {
      properties.set('siteId', data.siteId);
      Object.values(data.list).forEach((elem) => elem.forEach(
        (expl) => explanations[expl.id] = expl));
      hoverExplanations.set(data.list);
    }

    function addHoverResources () {
      const enabled = properties.get('enabled');
      const env = properties.get('env') || 'local';
      if (enabled && env !== currEnv) {
        currEnv = env;
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

    this.addComment = function (value, siteId, explanationId, commentId, success, failure) {
      function addCommentSuccess(comment) {
        explanations[explanationId].comments.push(comment);
        if ((typeof success) === 'function') success(comment);
      }
      function addCommentFailure(error) {
        if ((typeof failure) === 'function') failure(error);
      }
      const body = {value, siteId, explanationId, commentId};
      Request.post(EPNTS.comment.add(), body, addCommentSuccess, addCommentFailure);
    }

    this.add = function (words, content, success, fail) {
      const url = EPNTS.explanation.add();
      Request.post(url, {words, content}, success, fail);
    };


    properties.onUpdate(['enabled', 'env'], addHoverResources);
  }
}

Expl = new Expl();

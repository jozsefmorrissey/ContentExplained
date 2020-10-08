class Explanations {
  constructor(list) {
    this.list = list ? list : [];
    this.add = function (expl) {
      this.list.push(expl);
    }

    this.get = function (words, success, failure) {
      const url = `http://localhost:3000/content-explained/${words}`
      Request.get(url, success, failure);
    }

    this.like = function (words, index, success, failure) {
      const currUrl = window.location.href;
      const callUrl = `https://localhost:3001/content-explained/like/${words}/${index}?url=${currUrl}`;
      Request.get(callUrl, successfullOpinion, failedOpinion);
    }
    this.dislike = function (words, index, success, failure) {
      const currUrl = window.location.href;
      const callUrl = `https://localhost:3001/content-explained/like/${words}/${index}?url=${currUrl}`;
      Request.get(callUrl, successfullOpinion, failedOpinion);
    }
  }
}

console.log("HERE!!!!! ", chrome.runtime.getURL('./html/text-to-html.html'));


class Opinion {
  constructor() {
    let siteId, userId;
    const amendments = {};
    const opinions = {};

    function voteSuccess(explId, favorable, callback) {
      return function () {
        amendments[explId] = favorable;
        if ((typeof callback) === 'function') callback();
      }
    }

    function canVote (expl, favorable)  {
      if (opinions[expl.id] !== undefined && amendments[expl.id] === undefined) {
        return opinions[expl.id] !== favorable;
      }
      return userId !== undefined && amendments[expl.id] !== favorable;
    };

    function explOpinions(expl, favorable) {
      const attr = favorable ? 'likes' : 'dislikes';
      if (amendments[expl.id] === undefined) {
        return expl[attr];
      }
      let value = expl[attr];
      if (opinions[expl.id] === favorable) value--;
      if (amendments[expl.id] === favorable) value++;
      return value;
    }

    this.canLike = (expl) => canVote(expl, true);
    this.canDislike = (expl) => canVote(expl, false);
    this.likes = (expl) => explOpinions(expl, true);
    this.dislikes = (expl) => explOpinions(expl, false);


    this.voteup = (expl, callback) => {
      const url = EPNTS.opinion.like(expl.id, siteId);
      Request.get(url, voteSuccess(expl.id, true, callback));
    }

    this.votedown = (expl, callback) => {
      const url = EPNTS.opinion.dislike(expl.id, siteId);
      Request.get(url, voteSuccess(expl.id, false, callback));
    }

    function saveVotes(results) {
      results.map((expl) => opinions[expl.explanationId] = expl.favorable === 1);
    }

    function getUserVotes() {
      siteId = properties.get('siteId');
      if (siteId !== undefined && User.loggedIn() !== undefined) {
        userId = User.loggedIn().id;
        const url = EPNTS.opinion.bySite(siteId, userId);
        Request.get(url, saveVotes);
      }
    }
    properties.onUpdate(['siteId', 'loggedIn'], getUserVotes);
  }
}

Opinion = new Opinion();

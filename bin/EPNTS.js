
class Endpoints {
  constructor(config, host) {
    const instance = this;
    host = host || '';
    this.setHost = (newHost) => {
      if ((typeof newHost) === 'string') {
        host = config._envs[newHost] || newHost;
      }
    };
    this.setHost(host);
    this.getHost = (env) => env === undefined ? host : config._envs[env];

    const endPointFuncs = {setHost: this.setHost, getHost: this.getHost};
    this.getFuncObj = function () {return endPointFuncs;};


    function build(str) {
      const pieces = str.split(/:[a-zA-Z0-9]*/g);
      const labels = str.match(/:[a-zA-Z0-9]*/g) || [];
      return function () {
        let values = [];
        if (arguments[0] === null || (typeof arguments[0]) !== 'object') {
          values = arguments;
        } else {
          const obj = arguments[0];
          labels.map((value) => values.push(obj[value.substr(1)] !== undefined ? obj[value.substr(1)] : value))
        }
        let endpoint = '';
        for (let index = 0; index < pieces.length; index += 1) {
          const arg = values[index];
          let value = '';
          if (index < pieces.length - 1) {
            value = arg !== undefined ? encodeURIComponent(arg) : labels[index];
          }
          endpoint += pieces[index] + value;
        }
        return `${host}${endpoint}`;
      }
    }

    function configRecurse(currConfig, currFunc) {
      const keys = Object.keys(currConfig);
      for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];
        const value = currConfig[key];
        if (key.indexOf('_') !== 0) {
          if (value instanceof Object) {
            currFunc[key] = {};
            configRecurse(value, currFunc[key]);
          } else {
            currFunc[key] = build(value);
          }
        } else {
          currFunc[key] = value;
        }
      }
    }

    configRecurse(config, endPointFuncs);
  }
}

try {
  exports.EPNTS = new Endpoints(require('../public/json/endpoints.json')).getFuncObj();
} catch (e) {}

const EPNTS = new Endpoints({
  "_envs": {
    "local": "https://localhost:3001/content-explained",
    "dev": "https://dev.jozsefmorrissey.com/content-explained",
    "prod": "https://node.jozsefmorrissey.com/content-explained"
  },
  "user": {
    "add": "/user",
    "get": "/user/:idsOemail",
    "login": "/user/login",
    "update": "/user/update/:updateSecret",
    "requestUpdate": "/user/update/request"
  },
  "credential": {
    "add": "/credential/add/:userId",
    "activate": "/credential/activate/:id/:userId/:activationSecret",
    "delete": "/credential/:idOauthorization",
    "activationUrl": "/credential/activation/url/:activationSecret",
    "get": "/credential/:userId",
    "status": "/credential/status/:authorization"
  },
  "site": {
    "add": "/site",
    "get": "/site/get"
  },
  "explanation": {
    "add": "/explanation",
    "author": "/explanation/author/:authorId",
    "get": "/explanation/:words",
    "update": "/explanation"
  },
  "siteExplanation": {
    "add": "/site/explanation/:explanationId",
    "get": "/site/explanation"
  },
  "opinion": {
    "like": "/like/:explanationId/:siteId",
    "dislike": "/dislike/:explanationId/:siteId",
    "bySite": "/opinion/:siteId/:userId"
  },
  "endpoints": {
    "json": "/html/endpoints.json",
    "EPNTS": "/EPNTS/:env"
  },
  "images": {
    "logo": "/images/icons/logo.png",
    "wiki": "/images/icons/wikapedia.png",
    "txt": "/images/icons/txt.png",
    "merriam": "/images/icons/Merriam-Webster.png"
  },
  "merriam": {
    "search": "/merriam/webster/:searchText"
  },
  "_secure": [
    "user.update",
    "credential.get",
    "credential.delete",
    "site.add",
    "explanation.add",
    "explanation.update",
    "siteExplanation.add",
    "opinion.like",
    "opinion.dislike"
  ]
}
, 'prod').getFuncObj();
try {exports.EPNTS = EPNTS;}catch(e){}
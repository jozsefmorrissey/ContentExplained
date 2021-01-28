
class ToggleMenu {
  constructor() {
    const instance = this;
    const controlTemplate = new $t('popup-cnt/tab-contents/comment-controls');
    this.togglesById = {};
    this.toggles = [];
    const uniqId = Math.floor(Math.random() * 100000000);
    this.TOGGLE_MENU_ID = 'ce-toggle-MENU-id-' + uniqId;
    ToggleMenu.menue[this.TOGGLE_MENU_ID] = this;
    for (let index = 0; index < arguments.length; index += 1) {
      let toggle = JSON.parse(JSON.stringify(arguments[index]));
      this.toggles.push(toggle);
      this.togglesById[toggle.id] = toggle;
    }

    this.toggle = (id, onOff) => {
      const toggler = this.togglesById[id];
      toggler.showing = onOff !== undefined ? onOff :!toggler.showing;
      const toggleTarget = document.getElementById(id);
      toggleTarget.hidden = !toggler.showing;
      if (toggler.showing === true) {
        toggler.disabled = false;
        const toggleBtn = document.querySelector(`[toggle-id=${id}]`);
        toggleBtn.hidden = false;
        toggleBtn.disabled = false;
      }
      instance.update();

    };
    this.showing = (id) => toggler.showing;
    this.html = () => controlTemplate.render(this);
    this.update = () => {
      const container = document.getElementById(instance.TOGGLE_MENU_ID).parentElement;
      container.innerHTML = instance.html();
    }
  }
}

{
  ToggleMenu.menue = {};
  ToggleMenu.watching = [];
  let toggled = (event) => {
    const elem = event.target;
    if (elem.matches('button[toggle-id]')) {
      const toggleId = elem.getAttribute('toggle-id');
      const listElem = elem.parentElement.parentElement
      const toggleMenuId = listElem.getAttribute('id');
      const toggleMenu = ToggleMenu.menue[toggleMenuId];
      toggleMenu.toggle(toggleId);
    }
  }

  ToggleMenu.watch = (container) => {
    if (ToggleMenu.watching.indexOf(container) === -1) {
      container.addEventListener('click', toggled);
    }
  }
}


class Comment {
  constructor(explanation, comment, color, siblingId) {
    siblingId = siblingId || Comment.siblingId++;
    const template = new $t('popup-cnt/tab-contents/add-comment');
    const controlTemplate = new $t('popup-cnt/tab-contents/comment-controls');
    const COMMENT_SUBMIT_BTN_CLASS = 'ce-comment-submit-btn-class';
    const scope = {explanation, comment};
    scope.rating = 0;
    if (comment) {
      scope.rating = Math.ceil(comment.author.likes / (comment.author.dislikes + comment.author.likes));
    }
    const uniqId = Math.floor(Math.random() * 100000000);
    scope.ROOT_ELEM_ID = 'ce-comment-root-elem-id-' + uniqId;
    scope.ADD_CNT_ID = 'ce-comment-add-cnt-id-' + uniqId;
    scope.COMMENTS_CNT_ID = 'ce-comments-cnt-id-' + uniqId;
    scope.TEXT_AREA_INPUT_ID = 'ce-comment-textarea-id-' + uniqId;
    scope.CONTROLS_CNT_ID = 'ce-comment-controls-id-' + uniqId;
    scope.showComments = comment === undefined;
    scope.showAdd = false;
    scope.siblingId = siblingId;
    scope.commentHtml = '';
    scope.loggedIn = User.isLoggedIn();
    scope.color = color;
    scope.value = comment === undefined ? '' : comment.value;
    let found = false;
    for (let index = 0; explanation.comments && index < explanation.comments.length; index += 1) {
      const childComment = explanation.comments[index];
      if ((comment === undefined && childComment.commentId === null) ||
          (comment !== undefined && comment.id === childComment.commentId)) {
        found = true;
        scope.commentHtml += Comment.for(null, explanation, childComment, !color, siblingId).html();
      }
    }
    const toggleComments = new ToggleMenu({
      id: scope.COMMENTS_CNT_ID,
      showing: scope.showComments,
      show: {text: 'Show Comments'},
      hide: {text: 'Hide Comments'},
      disabled: !found
    });
    scope.commentToggle = () => toggleComments.html();

    const toggleAdd = new ToggleMenu({
      id: scope.ADD_CNT_ID,
      showing: scope.showAdd,
      hide: {text: 'Close Comment'},
      show: {text: 'Add Comment'},
      disabled: !User.isLoggedIn()
    });
    scope.addToggle = () => toggleAdd.html();


    this.add = (dbComment) => {
      const container = document.getElementById(scope.COMMENTS_CNT_ID).children[0];
      const newComment = Comment.for(null, explanation, dbComment, !color);
      toggleAdd.toggle(scope.ADD_CNT_ID, false);
      toggleComments.toggle(scope.COMMENTS_CNT_ID, true);
      container.append(strToHtml(newComment.html()));
    }
    this.html = () => template.render(scope);
  }
}

{
  let hypenStrs = function () {
    let str = arguments[0];
    for (let index = 1; index < arguments.length; index += 1) {
      str += '-' + arguments[index];
    }
    return str;
  }
  let uniqueId = (explanation, comment) => {
    const commentId = comment ? comment.id : undefined;
    return hypenStrs(explanation.id, commentId);
  }



  let submit = (event) => {
    const elem = event.target;
    if (elem.matches('.ce-comment-submit-btn-class')) {
      const textarea = document.getElementById(elem.getAttribute('textarea-id'));
      const value = textarea.value;
      const siteId = properties.get('siteId');
      const explanationId = Number.parseInt(textarea.getAttribute('explanation-id'));
      const commentId = textarea.getAttribute('comment-id') || undefined;
      const uniqId = hypenStrs(explanationId, commentId);
      let addSuccess = (comment) => cache[uniqId].add(comment);
      let addFailure = (comment) => console.log(comment, '\nfailure!!!');
      Expl.addComment(value, siteId, explanationId, commentId, addSuccess, addFailure);
    }
  }

  let cache = {};
  let watching = [];
  Comment.for = (container, explanation, comment, color) => {
    const uniqId = uniqueId(explanation, comment);
    if (!cache[uniqId]) {
      cache[uniqId] = new Comment(explanation, comment, color);
      if (container && watching.indexOf(container) === -1) {
        container.addEventListener('click', submit);
        ToggleMenu.watch(container);
      }
    }
    return cache[uniqId];
  }

  Comment.siblingId = 0;
}

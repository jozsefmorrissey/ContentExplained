const UI_ID = 'ce-ui';
const UI = new ShortCutCointainer(UI_ID, ['c', 'e'], '<h1>Hello ContentExplained</h1>');

const MERRIAM_WEB_DEF_CNT_ID = 'merriam-webster-def-cnt';
const MERRIAM_WEB_SUG_CNT_ID = 'merriam-webster-submission-cnt';
const CONTEXT_EXPLANATION_CNT_ID = 'content-explanation-cnt';
const WIKI_CNT_ID = 'wikapedia-cnt'

const USER_ADD_CALL_SUCCESS = new CustomEvent('user-add-call-success');
const USER_ADD_CALL_FAILURE = new CustomEvent('user-add-call-failure');
const CE_LOADED = new CustomEvent('user-add-call-failure');

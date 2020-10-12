const UI_ID = 'ce-ui';
const UI = new ShortCutCointainer(UI_ID, ['c', 'e'], '<h1>Hello ContentExplained</h1>');

const MERRIAM_WEB_DEF_CNT_ID = 'ce-merriam-webster-def-cnt';
const MERRIAM_WEB_SUG_CNT_ID = 'ce-merriam-webster-suggestion-cnt';
const HISTORY_CNT_ID = 'ce-history-cnt';
const ADD_EDITOR_ID = 'ce-add-editor-id';
const CONTEXT_EXPLANATION_CNT_ID = 'ce-content-explanation-cnt';
const WIKI_CNT_ID = 'ce-wikapedia-cnt';
const RAW_TEXT_CNT_ID = 'ce-raw-text-cnt';

const USER_ADD_CALL_SUCCESS = new CustomEvent('user-add-call-success');
const USER_ADD_CALL_FAILURE = new CustomEvent('user-add-call-failure');
const CE_LOADED = new CustomEvent('user-add-call-failure');

const CE_HOST = 'https://localhost:3001';

const URL_USER_LOGIN = `${host}/content-explained/user/login/`;
const URL_USER_ADD = `${host}/content-explained/user/add/`;
const URL_USER_GET = `${host}/content-explained/user/get/`;
const URL_USER_SYNC = `${host}/content-explained/user/sync/`;

const URL_IMAGE_LOGO = `${host}/images/icons/logo.png`;
const URL_IMAGE_MERRIAM = `${host}/images/icons/Merriam-Webster.png`;
const URL_IMAGE_WIKI = `${host}/images/icons/wikapedia.png`;
const URL_IMAGE_TXT = `${host}/images/icons/txt.png`;

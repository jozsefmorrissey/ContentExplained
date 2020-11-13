const UI_ID = 'ce-ui';
const UI = new ShortCutCointainer(UI_ID, ['c', 'e'], '<h1>Hello ContentExplained</h1>');

const MERRIAM_WEB_DEF_CNT_ID = 'ce-merriam-webster-def-cnt';
const MERRIAM_WEB_SUG_CNT_ID = 'ce-merriam-webster-suggestion-cnt';
const HISTORY_CNT_ID = 'ce-history-cnt';
const ADD_EDITOR_ID = 'ce-add-editor-id';
const CONTEXT_EXPLANATION_CNT_ID = 'ce-content-explanation-cnt';
const WIKI_CNT_ID = 'ce-wikapedia-cnt';
const RAW_TEXT_CNT_ID = 'ce-raw-text-cnt';

const CE_HOST = 'https://localhost:3001/content-explained';

const URL_MERRIAM_REQ = `${CE_HOST}/merriam/webster/`;

const URL_USER_LOGIN = `${CE_HOST}/user/login/`;
const URL_USER_ADD = `${CE_HOST}/user/add/`;
const URL_USER_GET = `${CE_HOST}/user/`;
const URL_USER_SYNC = `${CE_HOST}/user/sync/`;

const URL_IMAGE_LOGO = `${CE_HOST}/images/icons/logo.png`;
const URL_IMAGE_MERRIAM = `${CE_HOST}/images/icons/Merriam-Webster.png`;
const URL_IMAGE_WIKI = `${CE_HOST}/images/icons/wikapedia.png`;
const URL_IMAGE_TXT = `${CE_HOST}/images/icons/txt.png`;

const URL_CE_GET = `${CE_HOST}/`;
const URL_CE_LIKE = `${CE_HOST}/like/`;
const URL_CE_DISLIKE = `${CE_HOST}/dislike/`;

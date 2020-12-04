
class Developer extends Page {
  constructor() {
    super();
    const instance = this;
    const ENV_SELECT_ID = 'ce-env-select-id';
    const DG_HOST_INPUT_ID = 'ce-dg-host-input';
    const DG_ID_INPUT_ID = 'ce-dg-id-input';
    let show = false;
    this.label = function () {return 'Developer';};
    this.hide = function () {return !show;}
    this.scope = () => {
      const envs = Object.keys(EPNTS._envs);
      const currEnv = properties.get('env');
      const debugGuiHost = properties.get('debugGuiHost') || 'https://node.jozsefmorrissey.com/debug-gui';
      const debugGuiId = properties.get('debugGuiId');
      return {ENV_SELECT_ID, DG_HOST_INPUT_ID, DG_ID_INPUT_ID,
              envs, currEnv, debugGuiHost, debugGuiId};
    };
    this.template = function() {return 'icon-menu/links/developer';}
    function envUpdate(event) {properties.set('env', event.target.value, true)};
    this.onOpen = () => {
      document.getElementById(ENV_SELECT_ID).onchange = propertyUpdate('env');
      document.getElementById(DG_HOST_INPUT_ID).onchange = propertyUpdate('debugGuiHost');
      document.getElementById(DG_ID_INPUT_ID).onchange = propertyUpdate('debugGuiId');
    }

    new KeyShortCut('dev', () => {
      show = !show;
      if (show) {
        properties.set('debug', true, true);
        Settings.settings[instance.constructor.name].activate(true);
      } else {
        properties.set('debug', false, true);
        Settings.updateMenus();
      }
    });

    this.updateDebug = (debug) => {show = debug; Settings.updateMenus();}
  }
}
const developerPage = new Developer();
const developerSettings = new Settings(developerPage);
properties.onUpdate('debug', developerPage.updateDebug);

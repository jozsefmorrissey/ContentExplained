
new Settings(new Login());
const profileSetting = new Settings(new Profile());
new Settings(new FavoriteLists());
new Settings(new RawTextTool());


const developerPage = new Developer();
const developerSettings = new Settings(developerPage);
properties.onUpdate('debug', developerPage.updateDebug);

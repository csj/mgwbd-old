import Config from 'components/app/config';


class FlagService {
  constructor() {
    this.clientFlags = {};
    this.clientFlagConfig = Config.clientFlagConfig;
    this.setDefaultClientFlags();
  }

  get(flagName) {
    // Look in various places. For now, only `clientFlags`.
    return this.clientFlags[flagName];
  }

  getClientFlagConfig() {
    return this.clientFlagConfig;
  }

  getClientFlags() {
    return this.clientFlags;
  }

  setClientFlag(name, value) {
    this.clientFlags[name] = value;
  }

  setDefaultClientFlags() {
    this.clientFlagConfig.forEach(setting => {
      this.setClientFlag(setting.canonicalName, setting.defaultValue);
    });
  }
}


FlagService.Factory = class {
  create() {
    return _instance;
  }
}


const _instance = new FlagService();


export default FlagService;


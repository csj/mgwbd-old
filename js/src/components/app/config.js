
const ConfigProduction = {
  serverEndpoint: '',
  clientFlagConfig: [
    {
      'canonicalName': 'showWipGames',
      'displayName': 'Show games still under development',
      'values': [true, false],
      'defaultValue': false,
    },
  ],
}


const ConfigDevelopment = {
  ...ConfigProduction,
  serverEndpoint: 'http://localhost:5000',
  withCredentials: true,
};


const Config = {
  'development': ConfigDevelopment,
  'production': ConfigProduction,
}[process.env.NODE_ENV];


export default Config;


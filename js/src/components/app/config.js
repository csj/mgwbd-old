
const ConfigDevelopment = {
  serverEndpoint: 'http://localhost:5000',
  withCredentials: true,
};


const ConfigProduction = {
  serverEndpoint: '',
}


const Config = {
  'development': ConfigDevelopment,
  'production': ConfigProduction,
}[process.env.NODE_ENV];


export default Config;


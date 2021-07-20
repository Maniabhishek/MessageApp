const dotenv = require('dotenv');

dotenv.config();

const environments = {}

environments.staging = {
    'port':3000,
    'httpsport':3001,
    'envName':'staging',
}

environments.production = {
    'port':5000,
    'httpsport':5001,
    'envName':'production',
}

const environmentChosen = typeof(process.env.NODE_ENV) !== 'string' ? 'staging': process.env.NODE_ENV.toLowerCase()

const exportedEnv = typeof(environments[environmentChosen]) === 'object' ?  environments[environmentChosen] : environments.staging;
module.exports = exportedEnv;
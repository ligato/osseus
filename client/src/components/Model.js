//in order to reference or change the state of these plugins declare as global:
//     let pluginModule = require('../Plugins');
//
//in order to reference the name of the REST_API object for example:
//     pluginModule.plugins[0].pluginName //log: 'REST API'
//
//in order to change the name of the REST_API object for example:
//     pluginModule.plugins[0]pluginName = 'peep'

var REST_API = {
    pluginName: 'REST API',
    selected: false,
    id: 0,
    port: 0
};

var GRPC = {
    pluginName: 'GRPC',
    selected: false,
    id: 1,
    port: 0
};

var PROMETHEUS = {
    pluginName: 'PROMETHEUS',
    selected: false,
    id: 2,
    port: 0
};

var ETCD = {
    pluginName: 'ETCD',
    selected: false,
    id: 3,
    port: 0
};

var REDIS = {
    pluginName: 'REDIS',
    selected: false,
    id: 4,
    port: 0
};

var CASSANDRA = {
    pluginName: 'CASSANDRA',
    selected: false,
    id: 5,
    port: 0
};

var CONSUL = {
    pluginName: 'CONSUL',
    selected: false,
    id: 6,
    port: 0
};

var LOGRUS = {
    pluginName: 'LOGRUS',
    selected: false,
    id: 7,
    port: 0
};

var LOG_MNGR = {
    pluginName: 'LOG MNGR',
    selected: false,
    id: 8,
    port: 0
};

var STTS_CHECK = {
    pluginName: 'STTS CHECK',
    selected: false,
    id: 9,
    port: 0
};

var PROBE = {
    pluginName: 'PROBE',
    selected: false,
    id: 10,
    port: 0
};

var KAFKA = {
    pluginName: 'KAFKA',
    selected: false,
    id: 11,
    port: 0
};

var DATASYNC = {
    pluginName: 'DATASYNC',
    selected: false,
    id: 12,
    port: 0
};

var IDX_MAP = {
    pluginName: 'IDX MAP',
    selected: false,
    id: 13,
    port: 0
};

var SRVC_LABEL = {
    pluginName: 'SRVC LABEL',
    selected: false,
    id: 14,
    port: 0
};

var CONFIG = {
    pluginName: 'CONFIG',
    selected: false,
    id: 15,
    port: 0
};

var categories = [
    [['REST_API', 'RPC'],      ['GRPC', 'RPC'],         ['PROMETHEUS', 'RPC']],  
    [['ETCD', 'DS'],           ['REDIS', 'DS'],         ['CASSANDRA', 'DS'],    ['CONSUL', 'DS']],  
    [['LOGRUS', 'LOGGING'],    ['LOG_MNGR', 'LOGGING']],
    [['STTS_CHECK', 'HEALTH'], ['PROBE', 'HEALTH']],    
    [['KAFKA', 'MISC'],        ['DATA_SYNC', 'MISC'],   ['IDX_MAP', 'MISC'],    ['SRVC_LABEL', 'MISC'], ['CONFIG', 'MISC']]
]

var images = ['/images/01-rest-api.png',  '/images/02-grpc.png',         '/images/03-prometheus.png', '/images/04-etcd.png',
              '/images/05-redis.png',     '/images/06-cassandra.png',    '/images/07-consul.png',     '/images/08-logrus.png',
              '/images/09-log-mngr.png',  '/images/10-status-check.png', '/images/11-probe.png',      '/images/12-kafka.png',
              '/images/13-data-sync.png', '/images/14-idx-map.png',      '/images/15-srvc-label.png', '/images/16-config.png',
]

var plugins = [REST_API,  GRPC,       PROMETHEUS,   ETCD,      
               REDIS,     CASSANDRA,  CONSUL,       LOGRUS,     
               LOG_MNGR,  STTS_CHECK, PROBE,        KAFKA,     
               DATASYNC,  IDX_MAP,    SRVC_LABEL,   CONFIG];

var projectName = 'untitled';

var project = {
    projectName,
    plugins
};

var generatedCode = 'Code Viewer'


module.exports = {
    project: project,
    images: images,
    generatedCode: generatedCode,
    categories: categories
}





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
    id: 0,
    selected: false,
    image: '/images/01-rest-api.png',
    port: 0
};

var GRPC = {
    pluginName: 'GRPC',
    id: 1,
    selected: false,
    image: '/images/02-grpc.png',
    port: 0
};

var PROMETHEUS = {
    pluginName: 'PROMETHEUS',
    id: 2,
    selected: false,
    image: '/images/03-prometheus.png',
    port: 0
};

var ETCD = {
    pluginName: 'ETCD',
    id: 3,
    selected: false,
    image: '/images/04-etcd.png',
    port: 0
};

var REDIS = {
    pluginName: 'REDIS',
    id: 4,
    selected: false,
    image: '/images/05-redis.png',
    port: 0
};

var CASSANDRA = {
    pluginName: 'CASSANDRA',
    id: 5,
    selected: false,
    image: '/images/06-cassandra.png',
    port: 0
};

var CONSUL = {
    pluginName: 'CONSUL',
    id: 6,
    selected: false,
    image: '/images/07-consul.png',
    port: 0
};

var LOGRUS = {
    pluginName: 'LOGRUS',
    id: 7,
    selected: false,
    image: '/images/08-logrus.png',
    port: 0
};

var LOG_MNGR = {
    pluginName: 'LOG MNGR',
    id: 8,
    selected: false,
    image: '/images/09-log-mngr.png',
    port: 0
};

var STTS_CHECK = {
    pluginName: 'STTS CHECK',
    id: 9,
    selected: false,
    image: '/images/10-status-check.png',
    port: 0
};

var PROBE = {
    pluginName: 'PROBE',
    id: 10,
    selected: false,
    image: '/images/11-probe.png',
    port: 0
};

var KAFKA = {
    pluginName: 'KAFKA',
    id: 11,
    selected: false,
    image: '/images/12-kafka.png',
    port: 0
};

var DATASYNC = {
    pluginName: 'DATASYNC',
    id: 12,
    selected: false,
    image: '/images/13-data-sync.png',
    port: 0
};

var IDX_MAP = {
    pluginName: 'IDX MAP',
    id: 13,
    selected: false,
    image: '/images/14-idx-map.png',
    port: 0
};

var SRVC_LABEL = {
    pluginName: 'SRVC LABEL',
    id: 14,
    selected: false,
    image: '/images/15-srvc-label.png',
    port: 0
};

var CONFIG = {
    pluginName: 'CONFIG',
    id: 15,
    selected: false,
    image: '/images/16-config.png',
    port: 0
};

var plugins = [REST_API,  GRPC,       PROMETHEUS,   ETCD,      
               REDIS,     CASSANDRA,  CONSUL,       LOGRUS,     
               LOG_MNGR,  STTS_CHECK, PROBE,        KAFKA,     
               DATASYNC,  IDX_MAP,    SRVC_LABEL,   CONFIG];

module.exports = {
    plugins: plugins
}





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
    image: '/images/01-rest-api.png',
    port: 0
};

var GRPC = {
    pluginName: 'GRPC',
    selected: false,
    id: 1,
    image: '/images/02-grpc.png',
    port: 0
};

var PROMETHEUS = {
    pluginName: 'PROMETHEUS',
    selected: false,
    id: 2,
    image: '/images/03-prometheus.png',
    port: 0
};

var ETCD = {
    pluginName: 'ETCD',
    selected: false,
    id: 3,
    image: '/images/04-etcd.png',
    port: 0
};

var REDIS = {
    pluginName: 'REDIS',
    selected: false,
    id: 4,
    image: '/images/05-redis.png',
    port: 0
};

var CASSANDRA = {
    pluginName: 'CASSANDRA',
    selected: false,
    id: 5,
    image: '/images/06-cassandra.png',
    port: 0
};

var CONSUL = {
    pluginName: 'CONSUL',
    selected: false,
    id: 6,
    image: '/images/07-consul.png',
    port: 0
};

var LOGRUS = {
    pluginName: 'LOGRUS',
    selected: false,
    id: 7,
    image: '/images/08-logrus.png',
    port: 0
};

var LOG_MNGR = {
    pluginName: 'LOG MNGR',
    selected: false,
    id: 8,
    image: '/images/09-log-mngr.png',
    port: 0
};

var STTS_CHECK = {
    pluginName: 'STTS CHECK',
    selected: false,
    id: 9,
    image: '/images/10-status-check.png',
    port: 0
};

var PROBE = {
    pluginName: 'PROBE',
    selected: false,
    id: 10,
    image: '/images/11-probe.png',
    port: 0
};

var KAFKA = {
    pluginName: 'KAFKA',
    selected: false,
    id: 11,
    image: '/images/12-kafka.png',
    port: 0
};

var DATASYNC = {
    pluginName: 'DATASYNC',
    selected: false,
    id: 12,
    image: '/images/13-data-sync.png',
    port: 0
};

var IDX_MAP = {
    pluginName: 'IDX MAP',
    selected: false,
    id: 13,
    image: '/images/14-idx-map.png',
    port: 0
};

var SRVC_LABEL = {
    pluginName: 'SRVC LABEL',
    selected: false,
    id: 14,
    image: '/images/15-srvc-label.png',
    port: 0
};

var CONFIG = {
    pluginName: 'CONFIG',
    selected: false,
    id: 15,
    image: '/images/16-config.png',
    port: 0
};

var plugins = [REST_API, GRPC, PROMETHEUS, ETCD,
    REDIS, CASSANDRA, CONSUL, LOGRUS,
    LOG_MNGR, STTS_CHECK, PROBE, KAFKA,
    DATASYNC, IDX_MAP, SRVC_LABEL, CONFIG];


module.exports = {
    plugins: plugins,
}





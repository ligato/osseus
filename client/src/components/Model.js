// Copyright (c) 2019 Cisco and/or its affiliates.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at:
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/*
================================
Project Definition
================================
*/
var projectName = 'untitled';

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

var plugins = [
    /*RPC*/      REST_API,   GRPC,      PROMETHEUS,   
    /*DS*/       ETCD,       REDIS,     CASSANDRA,  CONSUL,  
    /*LOGGING*/  LOGRUS,     LOG_MNGR,
    /*HEALTH*/   STTS_CHECK, PROBE,
    /*MISC*/     KAFKA,      DATASYNC,  IDX_MAP,    SRVC_LABEL,   CONFIG
];

var agentName = 'untitled';

var customPlugins = [];

var project = {
    projectName,
    plugins,
    agentName,
    customPlugins
};
 
/*
================================
Global Utility Definitions
================================
*/
// Images used for plugin icons
var images = [
    /*RPC*/     '/images/rpc.png',     '/images/rpc.png',     '/images/rpc.png',
    /*DS*/      '/images/ds.png',      '/images/ds.png',      '/images/ds.png',   '/images/ds.png',    
    /*LOGGING*/ '/images/logging.png', '/images/logging.png', 
    /*HEALTH*/  '/images/health.png',  '/images/health.png',   
    /*MISC*/    '/images/misc.png',    '/images/misc.png',    '/images/misc.png', '/images/misc.png', '/images/misc.png',
]

// Categories used for determining the type of each plugin
var categories = [
/*RPC*/     [['REST_API', 'RPC'],      ['GRPC', 'RPC'],         ['PROMETHEUS', 'RPC']],  
/*DS*/      [['ETCD', 'DS'],           ['REDIS', 'DS'],         ['CASSANDRA', 'DS'],    ['CONSUL', 'DS']],  
/*LOGGING*/ [['LOGRUS', 'LOGGING'],    ['LOG_MNGR', 'LOGGING']],
/*HEALTH*/  [['STTS_CHECK', 'HEALTH'], ['PROBE', 'HEALTH']],    
/*MISC*/    [['KAFKA', 'MISC'],        ['DATA_SYNC', 'MISC'],   ['IDX_MAP', 'MISC'],    ['SRVC_LABEL', 'MISC'], ['CONFIG', 'MISC']],
/*CUSTOM*/  [['untitled', 'CUSTOM']],
]

// Once project is generated the template is stored here for client usage
var template = ' ';

// Module Export
module.exports = {
    project: project,
    images: images,
    categories: categories,
    template: template
}

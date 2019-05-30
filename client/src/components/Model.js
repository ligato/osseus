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
/*RPC*/     [['REST_API', 'RPC'],      ['GRPC', 'RPC'],         ['PROMETHEUS', 'RPC']],  
/*DS*/      [['ETCD', 'DS'],           ['REDIS', 'DS'],         ['CASSANDRA', 'DS'],    ['CONSUL', 'DS']],  
/*LOGGING*/ [['LOGRUS', 'LOGGING'],    ['LOG_MNGR', 'LOGGING']],
/*HEALTH*/  [['STTS_CHECK', 'HEALTH'], ['PROBE', 'HEALTH']],    
/*MISC*/    [['KAFKA', 'MISC'],        ['DATA_SYNC', 'MISC'],   ['IDX_MAP', 'MISC'],    ['SRVC_LABEL', 'MISC'], ['CONFIG', 'MISC']],
/*CUSTOM*/  [['untitled', 'CUSTOM']],
]

var images = [
/*RPC*/     '/images/rpc.png',     '/images/rpc.png',     '/images/rpc.png',
/*DS*/      '/images/ds.png',      '/images/ds.png',      '/images/ds.png',   '/images/ds.png',    
/*LOGGING*/ '/images/logging.png', '/images/logging.png', 
/*HEALTH*/  '/images/health.png',  '/images/health.png',   
/*MISC*/    '/images/misc.png',    '/images/misc.png',    '/images/misc.png', '/images/misc.png', '/images/misc.png',
]

var projectName = 'untitled';

var agentName = 'untitled'

var plugins = [
/*RPC*/      REST_API,   GRPC,      PROMETHEUS,   
/*DS*/       ETCD,       REDIS,     CASSANDRA,  CONSUL,  
/*LOGGING*/  LOGRUS,     LOG_MNGR,
/*HEALTH*/   STTS_CHECK, PROBE,
/*MISC*/     KAFKA,      DATASYNC,  IDX_MAP,    SRVC_LABEL,   CONFIG
];

var customPlugins = [];

var project = {
    projectName,
    plugins,
    agentName,
    customPlugins
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Temporary Hard-Coded Structure
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var project_folder = {
    name: 'myproject',
    absolutePath: '/myproject',
    fileType: 'folder',
    children: ['/myproject/cmd', '/myproject/plugins']
}

var cmd_folder = {
    name: 'cmd',
    absolutePath: '/myproject/cmd',
    fileType: 'folder',
    children: ['/myproject/cmd/agent']
}

var agent_folder = {
    name: 'agent',
    absolutePath: '/myproject/cmd/agent',
    fileType: 'folder',
    children: ['/myproject/cmd/agent/main.go', '/myproject/cmd/agent/doc.go', '/myproject/cmd/agent/README.md']
}

var main_go = {
    name: 'main.go',
    absolutePath: '/myproject/cmd/agent/main.go',
    fileType: 'file',
    children: []
}

var readme = {
    name: 'readme.md',
    absolutePath: '/myproject/cmd/agent/README.md',
    fileType: 'file',
    children: []
}

var doc_go = {
    name: 'doc.go',
    absolutePath: '/myproject/cmd/agent/doc.go',
    fileType: 'file',
    children: []
}

var plugins_folder = {
    name: 'plugins',
    absolutePath: '/myproject/plugins',
    fileType: 'folder',
    children: ['/myproject/plugins/custom0']  
}

var custom_folder = {
    name: 'custom0',
    absolutePath: '/myproject/plugins/custom0',
    fileType: 'folder',
    children: ['/myproject/plugins/custom0/doc.go', '/myproject/plugins/custom0/options.go', '/myproject/plugins/custom0/plugin_impl_custom0.go']
}

var custom_doc_go = {
    name: 'custom0/doc.go',
    absolutePath: '/myproject/plugins/custom0/doc.go',
    fileType: 'file',
    children: []
}

var custom_options_go = {
    name: 'custom0/options.go',
    absolutePath: '/myproject/plugins/custom0/options.go',
    fileType: 'file',
    children: []
}

var custom_impl_go = {
    name: 'custom0/plugin_impl.go',
    absolutePath: '/myproject/plugins/custom0/plugin_impl_custom0.go',
    fileType: 'file',
    children: []
}

var structure = [project_folder, cmd_folder,     agent_folder,   main_go,           readme,
                 doc_go,         plugins_folder, custom_folder,  custom_doc_go,     custom_options_go, custom_impl_go];

var main_go_contents = {
  fileName: 'main.go',
  content: '\n/*** This is an autogenerated file; This file can be edited but changes should be saved***/\n\npackage main\n\nimport (\n    \"os\"\n    \"github.com/ligato/cn-infra/agent\"\n    \"github.com/ligato/cn-infra/logging\"\n    log \"github.com/ligato/cn-infra/logging/logrus\"\n    \"github.com/ligato/cn-infra/rpc/rest\"\n)\n\n// projectAgent is a struct holding internal data for the myproject Agent\ntype projectAgent struct {\n    HTTPHandlers    rest.HTTPHandlers\n}\n\n// New creates new projectAgent instance.\nfunc New() *projectAgent {\n    return \u0026projectAgent {\n        HTTPHandlers:    \u0026rest.DefaultPlugin,\n    }\n}\n\n// Init initializes main plugin.\nfunc (pr *projectAgent) Init() error {\n    return nil\n}\n\nfunc (pr *projectAgent) AfterInit() error {\n    resync.DefaultPlugin.DoResync()\n    return nil\n}\n\n// Close can be used to close used resources.\nfunc (pr *projectAgent) Close() error {\n    return nil\n}\n\n// String returns name of the plugin.\nfunc (pr *projectAgent) String() string {\n    return \"projectAgent\"\n}\n\nfunc main() {\n    projectAgent := New()\n\n    a := agent.NewAgent(agent.AllPlugins(projectAgent))\n\n    if err := a.Run(); err != nil {\n        log.DefaultLogger().Fatal(err)\n    }\n}\n\nfunc init() {\n    log.DefaultLogger().SetOutput(os.Stdout)\n    log.DefaultLogger().SetLevel(logging.DebugLevel)\n}'
}

var readme_contents = {
  fileName: 'readme.md',
  content: '\n# myproject\n\n[![GitHub license](https://img.shields.io/badge/license-Apache%20license%202.0-blue.svg)](https://github.com/ligato/cn-infra/blob/master/LICENSE.md)\n\nShort project description here\n\n## Installation\n\nInstallation instructions here\n\n## Documentation\n\nGoDocs can be browsed [online](url-to-godoc-here).\n\n## Contributing\n\nIf you are interested in contributing, please see the contribution guidelines.'
}

var doc_go_contents = {
  fileName: 'doc.go',
  content: 'package main"'
}

var custom_doc_go_contents = {
  fileName: 'custom0/doc.go',
  content: 'package zero'
}

var custom_options_go_contents = {
  fileName: 'custom0/options.go',
  content: '\n/*** This is an autogenerated file; This file can be edited but changes should be saved***/\n\npackage zero\n\nimport (\n    \"log\"\n    \"github.com/ligato/cn-infra/logging\"\n)\n\n// DefaultPlugin is default instance of Plugin.\nvar DefaultPlugin = *NewPlugin()\n\n// NewPlugin creates a new Plugin with the provides Options\nfunc NewPlugin(opts ...Option) *Plugin {\n    p := \u0026Plugin{}\n\n    p.PluginName = \"custom0\"\n\t// todo: initialize any other pluign Deps here, if applicable\n\n    for _, o := range opts {\n        o(p)\n    }\n\n    if p.Deps.Log == nil {\n        log.Println(p.String())\n        p.Deps.Log = logging.ForPlugin(p.String())\n    }\n\n    return p\n}\n\n// Option is a function that acts on a Plugin to inject Dependencies or configuration\ntype Option func(*Plugin)\n\n// UseDeps returns Option that can inject custom dependencies.\nfunc UseDeps(cb func(*Deps)) Option {\n    return func(p *Plugin) {\n        cb(\u0026p.Deps)\n    }\n}'
}

var custom_impl_go_contents = {
  fileName: 'custom0/plugin_impl.go',
  content: '\n/*** This is an autogenerated file; This file can be edited but changes should be saved***/\n\npackage zero\n\nimport (\n    \"github.com/ligato/cn-infra/infra\"\n    \"github.com/ligato/cn-infra/logging\"\n\t// todo: add any necessary imports for your plugin\n)\n\n// RegisterFlags registers command line flags.\nfunc RegisterFlags() {\n    // todo: add command line flags here if needed\n}\n\nfunc init() {\n    RegisterFlags()\n}\n\n// Plugin holds the internal data structures of the Rest Plugin\ntype Plugin struct {\n    Deps\n}\n\n// Deps groups the dependencies of the Rest Plugin.\ntype Deps struct {\n    infra.PluginDeps\n\t// todo: add any additional dependencies here\n}\n\n// Init initializes the Plugin\nfunc (p *Plugin) Init() error {\n    p.Log.SetLevel(logging.DebugLevel)\n    return nil\n}\n\n// AfterInit can be used to run plugin functionality.\nfunc (p *Plugin) AfterInit() (err error) {\n    return nil\n}\n\n// Close is NOOP.\nfunc (p *Plugin) Close() error {\n    return nil\n}'
}

var files = [main_go_contents, readme_contents, doc_go_contents, custom_doc_go_contents, custom_options_go_contents, custom_impl_go_contents];

var template = ' ';

module.exports = {
    project: project,
    images: images,
    categories: categories,
    structure: structure,
    files: files,
    template: template
}

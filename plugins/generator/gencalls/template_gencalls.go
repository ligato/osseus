package gencalls

// todo: refactor to be mainCodeTemplate
const goCodeTemplate = `
/*** This is an autogenerated file; This file can be edited but changes should be saved***/

package main

import (
    "os"
    "github.com/ligato/cn-infra/agent"
    "github.com/ligato/cn-infra/logging"
    log "github.com/ligato/cn-infra/logging/logrus"
{{- range .PluginAttributes}}
    {{.ImportPath -}}
{{- end}}
)

// {{.ProjectName}} is a struct holding internal data for the {{.ProjectName}} Agent
type {{.ProjectName}} struct {
{{- range .PluginAttributes}}
    {{.Declaration}}
{{- end}}
}

// New creates new {{.ProjectName}} instance.
func New() *{{.ProjectName}} {
    return &{{.ProjectName}} {
{{- range .PluginAttributes}}
{{- if eq .Initialization "config"}}
        PluginConfig: config.ForPlugin("{{$.ProjectName}}"),
{{- else}}
        {{.Initialization}}
{{- end}}
{{- end}}
    }
}

// Init initializes main plugin.
func (pr *{{.ProjectName}}) Init() error {
    return nil
}

func (pr *{{.ProjectName}}) AfterInit() error {
    resync.DefaultPlugin.DoResync()
    return nil
}

// Close can be used to close used resources.
func (pr *{{.ProjectName}}) Close() error {
    return nil
}

// String returns name of the plugin.
func (pr *{{.ProjectName}}) String() string {
    return "{{.ProjectName}}"
}

{{- if .IdxMapExists}}
// IndexFunction is used in idx map, returns map field->values for a given item.
func IndexFunction(item interface{}) map[string][]string{
    return nil
}
{{- end}}

func main() {
    {{.ProjectName}} := New()

    a := agent.NewAgent(agent.AllPlugins({{.ProjectName}}))

    if err := a.Run(); err != nil {
        log.DefaultLogger().Fatal(err)
    }
}

func init() {
    log.DefaultLogger().SetOutput(os.Stdout)
    log.DefaultLogger().SetLevel(logging.DebugLevel)
}`

const pluginImplTemplate = `
/*** This is an autogenerated file; This file can be edited but changes should be saved***/

package {{.PluginName}}

import (
    "github.com/ligato/cn-infra/infra"
    "github.com/ligato/cn-infra/logging"
)

// RegisterFlags registers command line flags.
func RegisterFlags() {
    // TODO: add command line flags here if needed
}

func init() {
    RegisterFlags()
}

// Plugin holds the internal data structures of the Rest Plugin
type Plugin struct {
    Deps
}

// Deps groups the dependencies of the Rest Plugin.
type Deps struct {
    infra.PluginDeps
}

// Init initializes the Plugin
func (p *Plugin) Init() error {
    p.Log.SetLevel(logging.DebugLevel)
    return nil
}

// AfterInit can be used to run plugin functionality.
func (p *Plugin) AfterInit() (err error) {
    return nil
}

// Close is NOOP.
func (p *Plugin) Close() error {
    return nil
}`

const pluginOptionsTemplate = `
/*** This is an autogenerated file; This file can be edited but changes should be saved***/

package {{.PluginName}}

import (
    "log"
    "github.com/ligato/cn-infra/logging"
)

// DefaultPlugin is default instance of Plugin.
var DefaultPlugin = *NewPlugin()

// NewPlugin creates a new Plugin with the provides Options
func NewPlugin(opts ...Option) *Plugin {
    p := &Plugin{}

    p.PluginName = "{{.PluginName}}"

    for _, o := range opts {
        o(p)
    }

    if p.Deps.Log == nil {
        log.Println(p.String())
        p.Deps.Log = logging.ForPlugin(p.String())
    }

    return p
}

// Option is a function that acts on a Plugin to inject Dependencies or configuration
type Option func(*Plugin)

// UseDeps returns Option that can inject custom dependencies.
func UseDeps(cb func(*Deps)) Option {
    return func(p *Plugin) {
        cb(&p.Deps)
    }
}`
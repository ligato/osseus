package gencalls

const goCodeTemplate = `
package main

import (
    "github.com/ligato/cn-infra/agent"
    "github.com/ligato/cn-infra/logging"
    log "github.com/ligato/cn-infra/logging/logrus"
    {{.Resync}}{{.Etcd}}{{.Cassandra}}{{.Redis}}

	//todo variable number of imports
)
type {{.ProjectName}} struct {
	
}

func New() *{{.ProjectName}} {

	return &{{.ProjectName}} {
		
	}
}

func (pr *{{.ProjectName}}) Init() error {
	return nil
}

func (pr *{{.ProjectName}}) AfterInit() error {
	resync.DefaultPlugin.DoResync()
	return nil
}

// Close could close used resources.
func (pr *{{.ProjectName}}) Close() error {
	return nil
}

// String returns name of the plugin.
func (pr *{{.ProjectName}}) String() string {
	return "{{.ProjectName}}"
}

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

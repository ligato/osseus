package main

import (
	"log"

	"github.com/ligato/cn-infra/agent"
	"github.com/ligato/cn-infra/db/keyval/etcd"
	"github.com/ligato/cn-infra/logging"
	"github.com/ligato/cn-infra/logging/logrus"
)

func main() {
	logrus.DefaultLogger().SetLevel(logging.DebugLevel)

	// Start simple agent with connector plugins
	a := agent.NewAgent(
		agent.AllPlugins(&etcd.DefaultPlugin),
	)

	if err := a.Run(); err != nil {
		log.Fatal(err)
	}
}

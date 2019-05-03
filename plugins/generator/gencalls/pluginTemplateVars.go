package gencalls

const (
	// REST
	restImport = `"github.com/ligato/cn-infra/rpc/rest"`
	restDecl = `HTTPHandlers    rest.HTTPHandlers`
	restInit = `HTTPHandlers:    &rest.DefaultPlugin,`

	// GRPC
	grpcImport = `"github.com/ligato/cn-infra/rpc/grpc"`
	grpcRef = `GRPC`
	grpc = `grpc`

	// Prometheus
	prometheusImport = `"github.com/ligato/cn-infra/rpc/prometheus"`
	prometheusRef = `Prometheus`
	prometheus = `prometheus`
	//todo prometheus uses .API

	// Etcd
	etcdImport = `"github.com/ligato/cn-infra/db/keyval/etcd"`
	etcdRef = `ETCDDataSync`
	etcd = `etcd`

	// Redis
	redisImport = `"github.com/ligato/cn-infra/db/keyval/redis"`
	redisDecl = `Redis    *redis.Plugin`
	redisInit = `Redis:    &redis.DefaultPlugin,`

	// Cassandra
	cassandraImport = `"github.com/ligato/cn-infra/db/keyval/cassandra"`
	cassandraDecl = `Cassandra    *cassandra.Plugin`
	cassandraInit = `Cassandra:    &cassandra.DefaultPlugin,`

	// Consul
	consulImport = `"github.com/ligato/cn-infra/db/keyval/consul"`
	consulDecl = `Consul:    *consul.Plugin`
	consulInit = `Consul:    &consul.DefaultPlugin,`

	// Logrus
	logrusImport = ``
	logrusRef = ``
	logrus = ``

	// Log Manager
	logMgrImport = `"github.com/ligato/cn-infra/logging/logmanager"`
	logMgrDecl = `LogManager    *logmanager.Plugin`
	logMgrInit = `LogManager:    &logmanager.DefaultPlugin,`

	// Status Check
	statusImport = `"github.com/ligato/cn-infra/health/statuscheck"`
	statusRef = `StatusCheck`
	status = `statuscheck`
	//todo StatusCheck  statuscheck.StatusReader

	// Probe
	probeImport = `"github.com/ligato/cn-infra/health/probe"`
	probeDecl = `Probe    *probe.Plugin    `
	probeInit = `Probe:    &probe.DefaultPlugin,`

	// Kafka
	kafkaImport = `"github.com/ligato/cn-infra/messaging/kafka"`
	kafkaRef = `Kafka`
	kafka = `kafka`
	//todo 			Kafka messaging.Mux (import "github.com/ligato/cn-infra/messaging")
	//Kafka:         &kafka.DefaultPlugin

	// Datasync/Resync
	resyncImport = `"github.com/ligato/cn-infra/datasync/resync"`
	resyncDecl = `Resync    *resync.Plugin`
	resyncInit = `Resync:    &resync.DefaultPlugin,`

	// Idx Map
	idxMapImport = `"github.com/ligato/cn-infra/idxmap"`
	idxMapRef = ``
	idxMap = ``

	// Service Label
	serviceLblImport = `"github.com/ligato/cn-infra/servicelabel"`
	serviceLblDecl = `ServiceLabel    *servicelabel.Plugin`
	serviceLblInit = `ServiceLabel:    &servicelabel.DefaultPlugin,`

	// Config
	configImport = ``
	configRef = ``
	config = ``

)

// AllPlugins is a dictionary that holds all available plugin data
// used for lookup of a plugin's attributes
var AllPlugins = map[string][]string{
	//"rest api":      []string{restImport, restRef, rest},
	"grpc":      []string{restImport, restDecl, restInit},
	//"prometheus":      []string{restImport, restRef, rest},
	//"etcd":      []string{etcdImport, etcdRef, etcd},
	"redis":     []string{redisImport, redisDecl, redisInit},
	"cassandra": []string{cassandraImport,cassandraDecl, cassandraInit},
	"consul":      []string{consulImport, consulDecl, consulInit},
	//"logrus":      []string{restImport, restRef, rest},
	"log mngr":      []string{logMgrImport, logMgrDecl, logMgrInit},
	//"stts check":      []string{restImport, restRef, rest},
	"probe":      []string{probeImport, probeDecl, probeInit},
	//"kafka":      []string{restImport, restRef, rest},
	"datasync":    []string{resyncImport, resyncDecl, resyncInit},
	//"idx map":      []string{restImport, restRef, rest},
	"srvc label":      []string{serviceLblImport, serviceLblDecl, serviceLblInit},
	//"config":      []string{restImport, restRef, rest},
}

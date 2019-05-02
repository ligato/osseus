package gencalls

const (
	// REST
	restImport = `"github.com/ligato/cn-infra/rpc/rest"`
	restRef = `REST`
	rest = `rest`
	//todo rest uses .HTTPHandlers not .Plugin and no * (REST rest.HTTPHandlers)

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
	redisRef = `Redis`
	redis = `redis`

	// Cassandra
	cassandraImport = `"github.com/ligato/cn-infra/db/keyval/cassandra"`
	cassandraRef = `Cassandra`
	cassandra = `cassandra`

	// Consul
	consulImport = `"github.com/ligato/cn-infra/db/keyval/consul"`
	consulRef = `Consul`
	consul = `consul`

	// Logrus
	logrusImport = ``
	logrusRef = ``
	logrus = ``

	// Log Manager
	logMgrImport = `"github.com/ligato/cn-infra/logging/logmanager"`
	logMgrRef = `LogManager`
	logMgr = `logmanager`

	// Status Check
	statusImport = `"github.com/ligato/cn-infra/health/statuscheck"`
	statusRef = `StatusCheck`
	status = `statuscheck`
	//todo StatusCheck  statuscheck.StatusReader

	// Probe
	probeImport = `"github.com/ligato/cn-infra/health/probe"`
	probeRef = `Probe`
	probe = `probe`

	// Kafka
	kafkaImport = `"github.com/ligato/cn-infra/messaging/kafka"`
	kafkaRef = `Kafka`
	kafka = `kafka`
	//todo 			Kafka messaging.Mux (import "github.com/ligato/cn-infra/messaging")
	//Kafka:         &kafka.DefaultPlugin

	// Datasync/Resync
	resyncImport = `"github.com/ligato/cn-infra/datasync/resync"`
	resyncRef = `Resync`
	resync = `resync`

	// Idx Map
	idxMapImport = `"github.com/ligato/cn-infra/idxmap"`
	idxMapRef = ``
	idxMap = ``

	// Service Label
	serviceLblImport = `"github.com/ligato/cn-infra/servicelabel"`
	serviceLblRef = `ServiceLabel`
	serviceLbl = `servicelabel`

	// Config
	configImport = ``
	configRef = ``
	config = ``

)

// AllPlugins is a dictionary that holds all available plugin data
// used for lookup of a plugin's attributes
var AllPlugins = map[string][]string{
	//"rest api":      []string{restImport, restRef, rest},
	"grpc":      []string{restImport, restRef, rest},
	//"prometheus":      []string{restImport, restRef, rest},
	//"etcd":      []string{etcdImport, etcdRef, etcd},
	"redis":     []string{redisImport, redisRef, redis},
	"cassandra": []string{cassandraImport,cassandraRef, cassandra},
	"consul":      []string{consulImport, consulRef, consul},
	//"logrus":      []string{restImport, restRef, rest},
	"log mngr":      []string{logMgrImport, logMgrRef, logMgr},
	//"stts check":      []string{restImport, restRef, rest},
	"probe":      []string{probeImport, probeRef, probe},
	//"kafka":      []string{restImport, restRef, rest},
	"datasync":    []string{resyncImport, resyncRef, resync},
	//"idx map":      []string{restImport, restRef, rest},
	"srvc label":      []string{serviceLblImport, serviceLblRef, serviceLbl},
	//"config":      []string{restImport, restRef, rest},
}

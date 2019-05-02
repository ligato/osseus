package gencalls

const (
	// REST
	restImport = `"github.com/ligato/cn-infra/rpc/rest"`
	restRef = `REST`
	rest = `rest`
	//todo rest uses .HTTPHandlers not .Plugin and no * (REST rest.HTTPHandlers)

	// GRPC
	grpcImport = `"github.com/ligato/cn-infra/rpc/grpc"`
	grpcRef = 't'
	grpc = 't'

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
	consulRef = 't'
	consul = 't'

	// Logrus
	logrusImport = `"github.com/ligato/cn-infra/logging/logrus"`
	logrusRef = 't'
	logrus = 't'

	// Log Manager
	logMgrImport = 't'
	logMgrRef = 't'
	logMgr = 't'

	// Status Check
	statusImport = `"github.com/ligato/cn-infra/health/statuscheck"`
	statusRef = `StatusCheck`
	status = `statuscheck`
	//todo StatusCheck  statuscheck.StatusReader

	// Probe
	probeImport = 't'
	probeRef = 't'
	probe = 't'

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
	serviceLblRef = 't'
	serviceLbl = 't'

	// Config
	configImport = 't'
	configRef = 't'
	config = 't'

)

// AllPlugins is a dictionary that holds all available plugin data
// used for lookup of a plugin's attributes
var AllPlugins = map[string][]string{
	//"rest api":      []string{restImport, restRef, rest},
	"etcd":      []string{etcdImport, etcdRef, etcd},
	"redis":     []string{redisImport, redisRef, redis},
	"datasync":    []string{resyncImport, resyncRef, resync},
	"cassandra": []string{cassandraImport,cassandraRef, cassandra},
	//"grpc":      []string{restImport, restRef, rest},
	//"prometheus":      []string{restImport, restRef, rest},
	//"consul":      []string{restImport, restRef, rest},
	//"logrus":      []string{restImport, restRef, rest},
	//"log mngr":      []string{restImport, restRef, rest},
	//"stts check":      []string{restImport, restRef, rest},
	//"probe":      []string{restImport, restRef, rest},
	//"kafka":      []string{restImport, restRef, rest},
	//"idx map":      []string{restImport, restRef, rest},
	//"srvc label":      []string{restImport, restRef, rest},
	//"config":      []string{restImport, restRef, rest},
}

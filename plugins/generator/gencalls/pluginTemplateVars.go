package gencalls

const (
	// REST
	restImport = `"github.com/ligato/cn-infra/rpc/rest"`
	restDecl = `HTTPHandlers    rest.HTTPHandlers`
	restInit = `HTTPHandlers:    &rest.DefaultPlugin,`

	// GRPC
	grpcImport = `"github.com/ligato/cn-infra/rpc/grpc"`
	grpcDecl = `GRPC    grpc.Server`
	grpcInit = `GRPC:    &grpc.DefaultPlugin,`

	// Prometheus
	prometheusImport = `"github.com/ligato/cn-infra/rpc/prometheus"`
	prometheusDecl = `Prometheus    prometheus.API`
	prometheusInit = `Prometheus:    &prometheus.DefaultPlugin,`

	// Etcd
	//assuming the kvstore tutorial method; not newEtcdConnectionWithBytes()
	etcdImport = `"github.com/ligato/cn-infra/db/keyval"
    "github.com/ligato/cn-infra/db/keyval/etcd"`
	etcdDecl = `KVStore    keyval.KvProtoPlugin`
	etcdInit = `KVStore:    &etcd.DefaultPlugin,`

	// Redis
	redisImport = `"github.com/ligato/cn-infra/db/keyval/redis"`
	redisDecl = `Redis    *redis.Plugin`
	redisInit = `Redis:    &redis.DefaultPlugin,`

	// Cassandra
	cassandraImport = `"github.com/ligato/cn-infra/db/sql/cassandra"`
	cassandraDecl = `Cassandra    *cassandra.Plugin`
	cassandraInit = `Cassandra:    &cassandra.DefaultPlugin,`

	// Consul
	consulImport = `"github.com/ligato/cn-infra/db/keyval/consul"`
	consulDecl = `Consul    *consul.Plugin`
	consulInit = `Consul:    &consul.DefaultPlugin,`

	// Logrus
	logrusImport = ``
	logrusDecl = `Logrus    logging.Logger`
	logrusInit = `Logrus:    log.DefaultLogger(),`

	// Log Manager
	logMgrImport = `"github.com/ligato/cn-infra/logging/logmanager"`
	logMgrDecl = `LogManager    *logmanager.Plugin`
	logMgrInit = `LogManager:    &logmanager.DefaultPlugin,`

	// Status Check
	statusImport = `"github.com/ligato/cn-infra/health/statuscheck"`
	statusDecl = `StatusCheck    statuscheck.StatusReader`
	statusInit = `StatusCheck:    &statuscheck.DefaultPlugin,`

	// Probe
	probeImport = `"github.com/ligato/cn-infra/health/probe"`
	probeDecl = `Probe    *probe.Plugin    `
	probeInit = `Probe:    &probe.DefaultPlugin,`

	// Kafka
	kafkaImport = `"github.com/ligato/cn-infra/messaging/kafka"
    "github.com/ligato/cn-infra/messaging"`
	kafkaDecl = `Kafka    messaging.Mux`
	kafkaInit = `Kafka:    &kafka.DefaultPlugin,`

	// Datasync/Resync
	resyncImport = `"github.com/ligato/cn-infra/datasync/resync"`
	resyncDecl = `Resync    *resync.Plugin`
	resyncInit = `Resync:    &resync.DefaultPlugin,`

	// Idx Map
	idxMapImport = `"github.com/ligato/cn-infra/idxmap"
    "github.com/ligato/cn-infra/idxmap/mem"`
	idxMapDecl = `mapping    idxmap.NamedMappingRW`
	idxMapInit = `mapping:    mem.NewNamedMapping(logging.DefaultLogger, "mappingName", IndexFunction),`

// Service Label
	serviceLblImport = `"github.com/ligato/cn-infra/servicelabel"`
	serviceLblDecl = `ServiceLabel    *servicelabel.Plugin`
	serviceLblInit = `ServiceLabel:    &servicelabel.DefaultPlugin,`

	// Config
	configImport = `"github.com/ligato/cn-infra/config"`
	configDecl = `PluginConfig config.PluginConfig`
	configInit = "config"

)

// AllPlugins is a dictionary that holds all available plugin data
// used for lookup of a plugin's attributes
var AllPlugins = map[string][]string{
	"rest api":      []string{restImport, restDecl, restInit},
	"grpc":      []string{grpcImport, grpcDecl, grpcInit},
	"prometheus":      []string{prometheusImport, prometheusDecl, prometheusInit},
	"etcd":      []string{etcdImport, etcdDecl, etcdInit},
	"redis":     []string{redisImport, redisDecl, redisInit},
	"cassandra": []string{cassandraImport,cassandraDecl, cassandraInit},
	"consul":      []string{consulImport, consulDecl, consulInit},
	"logrus":      []string{logrusImport, logrusDecl, logrusInit},
	"log mngr":      []string{logMgrImport, logMgrDecl, logMgrInit},
	"stts check":      []string{statusImport, statusDecl, statusInit},
	"probe":      []string{probeImport, probeDecl, probeInit},
	"kafka":      []string{kafkaImport, kafkaDecl, kafkaInit},
	"datasync":    []string{resyncImport, resyncDecl, resyncInit},
	"idx map":      []string{idxMapImport, idxMapDecl, idxMapInit},
	"srvc label":      []string{serviceLblImport, serviceLblDecl, serviceLblInit},
	"config":      []string{configImport, configDecl, configInit},
}

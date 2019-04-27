package gencalls

const (
	// DefPlugin variable
	DefPlugin = `.DefaultPlugin`

	// Plugin variable
	Plugin = `.Plugin`

	// Resync
	resyncImport = `    "github.com/ligato/cn-infra/datasync/resync"
`
	resync = `resync`

	// Etcd
	etcdImport = `    "github.com/ligato/cn-infra/db/keyval/etcd"
`
	etcd = `etcd`

	// Cassandra
	cassandraImport = `    "github.com/ligato/cn-infra/db/keyval/cassandra"
`
	cassandra = `cassandra`

	// Redis
	redisImport = `    "github.com/ligato/cn-infra/db/keyval/redis"
`
	redis = `redis`
)

// AllPlugins holds all available plugin data
/*var AllPlugins = map[string][]string{
	"etcd":      []string{etcdImport, etcd},
	"redis":     []string{redisImport, redis},
	"resync":    []string{resyncImport, resync},
	"cassandra": []string{cassandraImport, cassandra},
}*/

//temp AllPlugins with only an import
var AllPlugins = map[string]string{
	"etcd":      etcdImport,
	"redis":     redisImport,
	"resync":    resyncImport,
	"cassandra": cassandraImport,
}

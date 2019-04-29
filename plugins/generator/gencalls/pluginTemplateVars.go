package gencalls

const (
	// Resync
	resyncImport = `    "github.com/ligato/cn-infra/datasync/resync"
`
	resyncRef = `    Resync`
	resync = `resync`

	// Etcd
	etcdImport = `    "github.com/ligato/cn-infra/db/keyval/etcd"
`
	etcdRef = `    ETCDDataSync`
	etcd = `etcd`

	// Cassandra
	cassandraImport = `    "github.com/ligato/cn-infra/db/keyval/cassandra"
`
	cassandraRef = `    Cassandra`
	cassandra = `cassandra`

	// Redis
	redisImport = `    "github.com/ligato/cn-infra/db/keyval/redis"
`
	redisRef = `    Redis`
	redis = `redis`
)

// AllPlugins holds all available plugin data
var AllPlugins = map[string][]string{
	"etcd":      []string{etcdImport, etcdRef, etcd},
	"redis":     []string{redisImport, redisRef, redis},
	"resync":    []string{resyncImport, resyncRef, resync},
	"cassandra": []string{cassandraImport,cassandraRef, cassandra},
}

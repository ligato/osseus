package gencalls

var (
    AllPlugins = []string{
        "etcd",
        "cassandra",
        "redis",
        "resync",
    }
)

const (
	// DefPlugin variable
	DefPlugin = `.DefaultPlugin`

	// Plugin variable
    Plugin = `.Plugin`
    
    // Amper variable
    Amper = `&`

	// Resync
	resyncImport = `"github.com/ligato/cn-infra/datasync/resync"
    `
	resync = `resync`

	// Etcd
	etcdImport = `"github.com/ligato/cn-infra/db/keyval/etcd"
    `
	etcd = `etcd`

	// Cassandra
	cassandraImport = `"github.com/ligato/cn-infra/db/keyval/cassandra"
    `
	cassandra = `cassandra`

	// Redis
	redisImport = `"github.com/ligato/cn-infra/db/keyval/redis"
    `
	redis = `redis`
)

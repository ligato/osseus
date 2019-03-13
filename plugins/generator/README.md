# Generator Plugin

The `Generator Plugin` facilitates watching ETCD for new changes/events, capturing those changes, and providing newly generated code of different plugin configurations back to ETCD in this sequence:

1. Sets a Watcher to monitor ETCD for new changes
2. Captures new changes if keyprefix is a match and begins code generation
3. Sends code generation back to etcd under new prefix

<p align="center">
    <img src="../../docs/img/Generator.jpg" alt="Generator state flow">
</p>

## Notes

**scheduler dump**: `curl localhost:9191/scheduler/dump`

**etcdctl commands**: https://github.com/etcd-io/etcd/tree/master/etcdctl
```bash
# Store a new plugin
etcdctl put /config/plugin/v1/plugin-value/kafka {name: "kafka", template: "kafka_temp", status: "ok"}

# Delete a plugin
etcdctl del /config/plugin/v1/plugin-value/kafka

# Return all keys
etcdctl get --from-key ''
```


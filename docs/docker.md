## Development Installation

### First, clone the repo:
```
git clone https://github.com/ligato/osseus
cd /osseus
```
### Build the UI & Agent images:<br/>
```bash
# UI
docker build --force-rm=true -t ui --no-cache -f docker/ui/Dockerfile .

# Agent
docker build --force-rm=true -t agent --build-arg AGENT_COMMIT=2c2b0df32201c9bc814a167e0318329c78165b5c --no-cache -f docker/agent/Dockerfile .
```

### Build and run ETCD **before** running the Agent container:
```bash
docker run -p 2379:2379 --name etcd --rm quay.io/coreos/etcd:latest /usr/local/bin/etcd -advertise-client-urls http://0.0.0.0:2379 -listen-client-urls http://0.0.0.0:2379
```

### Lastly, run the UI and Agent:
```bash
# Agent
docker run -p 9191:9191 agent

# UI
docker run ui
```

**NOTE:**
To test everything is working properly, first make sure that there are no errors in any of the build processes or when the containers start up. Then, go to the local network endpoint where the **UI** is displayed, choose some plugins & click "Generate". You'll then see the Agent go through transactions and can double check that the k-v pairs were stored successfully in etcd by running ```etcdctl get --from-key ''``` in a separate terminal.
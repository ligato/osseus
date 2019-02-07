# Osseus

_Objective, TravisCI build status, Coverage, License_

## Architecture

_Architecture info goes here_

## Prerequisites

- [Docker](https://docs.docker.com/install/)

## Installation

_This is only the web server skeleton installation, will be updated later_

```python
# clone and go into directory
git clone https://github.com/ligato/osseus
cd /osseus

# run dockerfile to build image
docker build --force-rm=true -t osseus --build-arg AGENT_COMMIT=2c2b0df32201c9bc814a167e0318329c78165b5c --build-arg --no-cache .

# run etcd
docker run -p 2379:2379 --name etcd --rm quay.io/coreos/etcd:v3.1.0 /usr/local/bin/etcd -advertise-client-urls http://0.0.0.0:2379 -listen-client-urls http://0.0.0.0:2379

# run and go into image with bash
docker run -it --name agent --privileged --rm osseus bash

# run agent, which will show it is connected to ETCD
$: cd go/src/github.com/dev/osseus
$: go run agent.go
```

## Common Errors

_Will be moved/removed later on_

**Windows**

- Proxy error: Restart docker & run again.
- Build-agent or build error: Check line endings in build-agent or build are LF.

## Testing

_Testing info goes here_

## Contributing

_Contributing info goes here_

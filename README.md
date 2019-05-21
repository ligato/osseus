# Osseus

[![Github license](https://img.shields.io/badge/license-Apache%20license%202.0-blue.svg)](https://github.com/ligato/osseus/blob/master/LICENSE.md)

Osseus is full-stack web application for generating configurable plugin templates to be used in a wide variety of cloud-based applications. The user is able to select from available plugins provided by [CN-Infra](https://github.com/ligato/cn-infra) and generate working Go code to be immediately usable in an application.

## K8s Development Installation

### First, clone the repo:
```
git clone https://github.com/ligato/osseus
cd /osseus
```

### Install Microk8s (Linux)
```bash 
sudo snap install microk8s --classic --channel=1.13/stable

# Check everything is configured
microk8s.status
```

### Start & run Osseus in a cluster
```bash
# Start cluster
microk8s.start

# Check cluster info
microk8s.kubectl cluster-info

# Run Osseus
microk8s.kubectl apply -f osseus.yaml

# Open a browser to view the application
http://localhost:3000
```

## Documentation

Detailed documentation can be found [here](https://github.com/ligato/osseus/tree/master/docs).

## Architecture

Osseus is built utilizing the CN-Infra framework, which provides plugin/library support and a plugin lifecycle management platform. We have each part of our application broken up into a microservice of it's own: Frontend, Agent, and Key-Value Store (ETCD). By taking advantage of containerization with Docker, we are able to improve scalability, resiliency from failing components, maintainability, and many more aspects as opposed to monolithic design.

The architecture of the Osseus web application is shown below:

<p align="center">
    <img src="docs/img/ColorArchitecture.png" alt="Osseus Architecture">
</p>

Osseus uses React & SASS for our frontend, which is a component-based JavaScript library and a feature-rich CSS extension language. Go was chosen as our backend language due to the consistency of developing with the CN-Infra platform, where we are able to use packages that are built for ease-of-use in the design of our generator and restapi plugins. Lastly, ETCD allows for multiversion persistent key-value storage & is commonly used for data that is not frequently updated; there is also many plugins/libraries that support ETCD through the CN-Infra framework.

## Contributing

Contributions to Osseus are welcome. We use the standard pull request model. You can 
either pick an open issue and assign it to yourself or open a new issue and discuss your feature.

The tool used for managing third-party dependencies is [dep](https://github.com/golang/dep).
After adding or updating a dependency in `Gopkg.toml` run `dep ensure` to download
specified dependencies into the vendor folder.

# Osseus

[![Github license](https://img.shields.io/badge/license-Apache%20license%202.0-blue.svg)](https://github.com/ligato/osseus/blob/master/LICENSE.md)

Osseus is full-stack web application for generating configurable plugin templates to be used in a wide variety of cloud-based applications. The user is able to select from available plugins provided by [CN-Infra](https://github.com/ligato/cn-infra) and generate working Go code to be immediately usable in an application.

## :rocket: Quickstart

### Requirements:

| Prereq. | Version |
| ------- | :-----: |
| NodeJS  | 10.15^  |
| Go      |  1.10^  |
| Docker  | 18.09^  |

### First, clone the repo:
```
git clone https://github.com/ligato/osseus
cd /osseus
```

### Install dependencies
```bash 
# Install dependencies for the agent
dep ensure

# Install dependencies for the client
cd client/
npm install
```

### Run each component in a separate terminal
```bash
# Run Etcd
sudo docker run -p 12379:12379 --name etcd --rm \ 
    quay.io/coreos/etcd:v3.3.8 /usr/local/bin/etcd \ 
    -advertise-client-urls http://0.0.0.0:12379 \ 
    -listen-client-urls http://0.0.0.0:12379

# Run agent
cd cmd/agent/
go run main.go

# Run client
cd client/
npm start
```

## :book: Documentation

Detailed documentation for each component of the application can be found [here](https://github.com/ligato/osseus/tree/dev/docs).

## :wrench: Architecture

Osseus was built using the [CN-Infra](https://github.com/ligato/cn-infra) framework, which provides component/library support and plugin lifecycle management to our application. Our development strategy was to split its production into separate efforts: building a user interface (UI), REST API and a code generator. The UI provides a way for the user to configure an agent setup consisting of chosen plugins. The REST API facilitates the communication between the UI and our data store (Etcd), which takes the user selected plugins and stores them under a certain key. The Generator then produces skeleton code for the user’s configuration and stores this back in Etcd where the UI webhook can retrieve this configuration in a tar file format.

The architecture of the Osseus web application is shown below:

<p align="center">
    <img src="docs/img/Architecture.png" alt="Osseus Architecture">
</p>

We use React & SASS for our frontend, which is a component-based JavaScript library and a feature-rich CSS extension language. Go was chosen as our backend language due to the consistency of developing with CN-Infra, where we are able to use packages that are built for ease-of-use in the design of our generator and restapi plugins. Lastly, ETCD allows for multiversion persistent key-value storage and was chosen for its integration with various plugins/libraries through CN-Infra.

## :bulb: Contributing

Contributions to Osseus are welcome. We use the standard pull request model. You can 
either pick an open issue and assign it to yourself or open a new issue and discuss your feature.

The tool used for managing third-party dependencies is [dep](https://github.com/golang/dep).
After adding or updating a dependency in `Gopkg.toml` run `dep ensure` to download
specified dependencies into the vendor folder.

## :memo: License
Licensed under the [Apache License](https://github.com/ligato/osseus/blob/master/LICENSE.md)

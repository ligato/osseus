#!/bin/bash

set -e

# setup Go paths
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin
export PATH=$PATH:$GOPATH/bin
echo "export GOROOT=$GOROOT" >> ~/.bashrc
echo "export GOPATH=$GOPATH" >> ~/.bashrc
echo "export PATH=$PATH" >> ~/.bashrc
mkdir -p $GOPATH/{bin,pkg,src}

curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh
go get -u github.com/golang/protobuf/protoc-gen-go

# checkout agent code
mkdir -p $GOPATH/src/github.com/dev
cd $GOPATH/src/github.com/dev
git clone https://github.com/anthonydevelops/osseus.git

# build the agent
cd $GOPATH/src/github.com/dev/osseus
git checkout grpc-server

# install dependencies
dep ensure -vendor-only
dep ensure

# install grpcserver package
cd plugins/grpcserver
go install

# build agent executable
cd $GOPATH/src/github.com/dev/osseus/cmd/agent
go build

# copy agent executable to bin
cd $GOPATH/src/github.com/dev/osseus
cp cmd/agent/agent $GOPATH/bin/
#!/bin/bash

set -e

# setup Go paths
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
# export GOBIN=$GOROOT/bin
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin
export PATH=$PATH:$GOPATH/bin
echo "export GOROOT=$GOROOT" >> ~/.bashrc
echo "export GOPATH=$GOPATH" >> ~/.bashrc
echo "export PATH=$PATH" >> ~/.bashrc
mkdir -p $GOPATH/{bin,pkg,src}

curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh

# checkout agent code
mkdir -p $GOPATH/src/github.com/ligato
cd $GOPATH/src/github.com/ligato
git clone --single-branch --branch dev https://github.com/ligato/osseus.git

# install dependencies
cd $GOPATH/src/github.com/ligato/osseus
dep ensure -vendor-only
dep ensure

# build agent executable
cd $GOPATH/src/github.com/ligato/osseus/cmd/agent
go build

# copy agent executable to bin
cd $GOPATH/src/github.com/ligato/osseus
cp cmd/agent/agent $GOPATH/bin/
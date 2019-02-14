#!/bin/bash

set -e

# setup Go paths
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin
echo "export GOROOT=$GOROOT" >> ~/.bashrc
echo "export GOPATH=$GOPATH" >> ~/.bashrc
echo "export PATH=$PATH" >> ~/.bashrc
mkdir -p $GOPATH/{bin,pkg,src}

# install golint, gvt & Glide
#go get -u github.com/golang/lint/golint
#go get -u github.com/FiloSottile/gvt
#curl https://glide.sh/get | sh
go get -u github.com/ligato/cn-infra

# checkout agent code
mkdir -p $GOPATH/src/github.com/dev
cd $GOPATH/src/github.com/dev
git clone https://github.com/ligato/osseus.git

# build the agent
cd $GOPATH/src/github.com/dev/osseus
git checkout $1
go build

cp agent.go $GOPATH/bin/
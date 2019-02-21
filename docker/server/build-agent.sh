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

curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh
go get -u github.com/golang/protobuf/protoc-gen-go

# checkout agent code
mkdir -p $GOPATH/src/github.com/dev
# cd $GOPATH/src/github.com/dev
# git clone https://github.com/anthonydevelops/osseus.git

# build the agent
# cd $GOPATH/src/github.com/dev/osseus
# git checkout grpc-server
# cd plugins/grpc-server
# go build
# protoc -I=. --go_out=. ./service.proto

# cp cmd/agent/main.go $GOPATH/bin/
#!/bin/bash

set +e
sudo docker rmi -f osseus
set -e

CURRENT_FOLDER=`pwd`
AGENT_COMMIT=`git rev-parse HEAD`
echo "repo agent commit number: "$AGENT_COMMIT

while [ "$1" != "" ]; do
    case $1 in
        -a | --agent )          shift
                                AGENT_COMMIT=$1
                                ;;
        * )                     echo "invalid parameter "$1
                                exit 1
    esac
    shift
done

echo "build agent commit number: "$AGENT_COMMIT

sudo docker build --force-rm=true -t osseus --build-arg AGENT_COMMIT=$AGENT_COMMIT --no-cache .
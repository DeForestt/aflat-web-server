#!/bin/sh
# This script is used to build and run the the aflat project in the docker container

export PATH=$PATH:/aflat/bin

aflat make run >> dev.null;

# set working directory to /run
cd /run
aflat build 2> /dev/null;
./bin/a.out >> output.txt;

cat output.txt
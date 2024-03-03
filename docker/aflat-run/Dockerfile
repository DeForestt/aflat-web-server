# create a new ubuntu image
FROM ubuntu:latest


# install g++ cmake and git
RUN apt-get update && apt-get install -y g++ cmake git  libboost-all-dev

RUN git clone http://www.github.com/DeForestt/aflat.git

WORKDIR /aflat
RUN mkdir build
RUN mkdir bin
WORKDIR /aflat/build
RUN cmake ..
RUN make
WORKDIR /aflat/
RUN bash rebuild-libs.sh
RUN mkdir /project
WORKDIR /project
COPY . .
ENTRYPOINT ["/aflat/bin/aflat"]
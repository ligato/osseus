FROM ubuntu:16.04

ARG AGENT_COMMIT="xxx"

RUN apt-get update && apt-get install -y \
  sudo wget git build-essential gdb vim nano python \
  iproute2 iputils-ping inetutils-traceroute libapr1 supervisor telnet netcat

RUN mkdir /opt/agent
RUN mkdir /opt/agent/dev

WORKDIR /opt/agent/dev


# install Go & Glide
RUN wget https://dl.google.com/go/go1.11.5.linux-amd64.tar.gz && \
  tar -xvf go1.11.5.linux-amd64.tar.gz && \
  mv go /usr/local && \
  rm -f go1.11.5.linux-amd64.tar.gz

# build & install Protobuf & gogo protobuf compiler
RUN apt-get install -y make && \
  apt-get install -y autoconf automake libtool curl make g++ unzip

RUN git clone https://github.com/google/protobuf.git && \
  cd protobuf && ./autogen.sh && ./configure && \
  make -j4 && \
  make install && \
  ldconfig && \
  cd .. && rm -rf protobuf

COPY cmd/agent/etcd.conf .

# copy and execute agent build script
COPY docker/agent/build-agent.sh .
RUN  ./build-agent.sh ${AGENT_COMMIT}

WORKDIR /root/

# add supervisor conf file
COPY config/supervisord.conf /etc/supervisord.conf

# run supervisor as the default executable
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
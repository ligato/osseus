# Backend Docker Installation

```bash
# Get the project & cd into it
git clone https://github.com/anthonydevelops/osseus
cd /osseus
git checkout grpc-server

# Build the backend docker image
docker build --force-rm=true -t dev/osseus --build-arg AGENT_COMMIT=2c2b0df32201c9bc814a167e0318329c78165b5c --no-cache -f docker/server/Dockerfile .

# After the build, run the docker container
docker run --name server --privileged --rm dev/osseus

# or SSH into the container
docker run -it --name server --privileged --rm dev/osseus bash
```

# Backend Docker Installation

```bash
# Get the project & cd into it
git clone https://github.com/anthonydevelops/osseus
cd /osseus
git checkout grpc-server

# Build the backend docker image
docker build --force-rm=true -t dev/osseus --build-arg AGENT_COMMIT=2c2b0df32201c9bc814a167e0318329c78165b5c --no-cache -f docker/server/Dockerfile .

# After the build, run docker image and ssh into it
docker run -it --name agent --privileged dev/osseus bash

# If you make changes & exit out, you can restart it
docker start agent
docker exec -it agent
```

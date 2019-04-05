# Docker Installation

```bash
# Get the project & cd into it
git clone https://github.com/ligato/osseus
cd /osseus

# Build the agent docker image
docker build --force-rm=true -t agent --build-arg AGENT_COMMIT=2c2b0df32201c9bc814a167e0318329c78165b5c --no-cache -f docker/agent/Dockerfile .

# Build the ui docker image
docker build --force-rm=true -t ui --no-cache -f docker/ui/Dockerfile .

# After the build, run agent
docker run --name agent --privileged --rm agent
# or ui
docker run --name ui --privileged --rm ui

# or SSH into the container(s)
docker run -it --name <some-name-here> --privileged --rm <container-name> bash
```

# base image
FROM node:10.15.3

# set working directory
WORKDIR /app
COPY client/. .

# install dependencies
RUN npm install

# start ui
CMD ["npm", "start"]
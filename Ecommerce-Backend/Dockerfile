# docker file for a Node.js application
# use the official Node.js image as a base image
FROM node:18
# set the working directory in the container
# this is where the application code will be copied
WORKDIR /app
# copy package.json and package-lock.json to the working directory
COPY package*.json ./
# install the application dependencies
RUN npm install
# copy the rest of the application code to the working directory
COPY . .
# outline the port that the application will listen on
EXPOSE 5000
# outling server start command
CMD ["node", "server.js"]

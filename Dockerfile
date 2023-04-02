FROM node:14.17.5-alpine

#set the working directory to /app
WORKDIR /app

# Expose the port 3000
EXPOSE 3000

# Set the default command to run when a container starts
CMD ["npm", "start"]

# Install app dependencies
COPY package.json /app

#run npm install
RUN npm install
RUN npm install -g typescript
RUN npm install -g ts-node

# Copy code in the docker image
COPY . /app

#build typescript
RUN npm run build



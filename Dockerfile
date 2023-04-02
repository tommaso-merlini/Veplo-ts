# FROM node:14.17.5-alpine

# WORKDIR /app

# COPY package.json ./
# RUN npm install
# RUN npm install -g typescript
# RUN npm install -g ts-node

# COPY . .

# RUN npm run build

# EXPOSE 3000
# CMD ["npm", "run", "start"]

FROM node:14.17.5-alpine

WORKDIR /app
# Expose the port 3000
EXPOSE 3000
# Set the default command to run when a container starts
CMD ["npm", "start"]

# Install app dependencies
COPY package.json /app

RUN npm install
RUN npm install -g typescript
RUN npm install -g ts-node
# Copy your code in the docker image
COPY . /app

RUN npm run build



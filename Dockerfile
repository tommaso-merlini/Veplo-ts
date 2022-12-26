FROM node:14.17.5-alpine

WORKDIR /app

COPY package.json ./

RUN npm install
RUN npm install -g typescript
RUN npm install -g ts-node

# RUN npm i -g prisma

COPY . .

# RUN npx prisma generate --schema ./prisma/schema.prisma

RUN npm run build

# COPY ./prisma/schema.prisma ./dist/prisma/

EXPOSE 3000 
CMD ["npm", "run", "start"]
FROM node:14.8.0-alpine3.12
WORKDIR /opt/zher_web
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "serve"]

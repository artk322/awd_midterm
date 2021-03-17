FROM node:14.8.0-alpine3.12
WORKDIR /opt/zher_api
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 26230
CMD ["npm", "run", "dev"]

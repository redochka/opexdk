#FROM node:13-alpine
FROM node:15.10.0-buster

WORKDIR /app

COPY ./ ./opexdk

WORKDIR /app/opexdk

# Increase npm install performance
RUN npm set progress=false

RUN npm install

RUN npm install -g gulp

ENTRYPOINT ["docker-entrypoint.sh"]
FROM node:20

WORKDIR /app

COPY ./ ./opexdk

WORKDIR /app/opexdk

# Increase npm install performance
RUN npm set progress=false

RUN npm install

RUN npm uninstall -g ; npm install -g .
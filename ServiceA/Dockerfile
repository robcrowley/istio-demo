FROM node:8.9.0-alpine

EXPOSE 3000
COPY package*.json /tmp/
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmp/node_modules /src
ARG service_version
ENV SERVICE_VERSION ${service_version:-v1}
COPY app.js /src/
WORKDIR /src
CMD node app.js
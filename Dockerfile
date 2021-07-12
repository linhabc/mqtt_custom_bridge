FROM node:14-alpine

ENV ADAPTER_MQTT_PORT=1881

ENV MAINFLUX_HOST="mqtt://host.docker.internal:1883"

# ENV REDIS_HOST="host.docker.internal"
# ENV REDIS_PORT="6379"

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 1881
CMD [ "node", "index.js" ]
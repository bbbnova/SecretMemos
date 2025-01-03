FROM node:23-alpine
WORKDIR /usr/src/notepass
COPY ./package* .
RUN npm ci
COPY . .
RUN npm install pm2 -g
RUN pm2 list
CMD ["pm2-runtime", "server.js", "--no-daemon", "--name", "notepass"]
RUN rm iv.txt
RUN rm secret_key.txt

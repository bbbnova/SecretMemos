FROM node:23-alpine
WORKDIR /usr/src/notepass
COPY ./package* .
RUN npm ci
COPY . .
CMD ["npm", "start"]

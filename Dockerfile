FROM node:22

WORKDIR /app

COPY package.json /app

RUN npm install --loglevel verbose

COPY . /app

EXPOSE 1810

CMD ["node", "server.js"]
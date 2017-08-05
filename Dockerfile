FROM ubuntu:16.04

RUN apt-get update 
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y docker.io

RUN mkdir /app
RUN mkdir /tmp/app

COPY ./client /tmp/app/client
COPY ./server /app/server

WORKDIR /tmp/app/client
RUN npm install
RUN npm run build
RUN cp -r /tmp/app/client/build /app/public

WORKDIR /app/server
RUN npm install
RUN npm run compile
RUN npm test

WORKDIR /app/server
EXPOSE 8000

CMD ["npm", "start"]

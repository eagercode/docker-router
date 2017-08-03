FROM node:8.2.1

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

WORKDIR /app/server
EXPOSE 8000

CMD ["npm", "start"]

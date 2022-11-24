FROM node:latest

USER root

WORKDIR /usr/src/app

COPY . .

RUN apt-get -y update
RUN apt-get -y autoremove
RUN apt-get -y clean
RUN npm i

EXPOSE 1500

CMD ["npm", "start"]

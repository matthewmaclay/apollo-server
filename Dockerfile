FROM node:11
RUN mkdir -p /usr/matthew/app

WORKDIR /usr/matthew/app
COPY package.json /usr/matthew/app
RUN npm install
COPY . /usr/matthew/app
CMD ["npm","run","start"]
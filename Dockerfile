FROM node:10.9

WORKDIR /nodeApi

# ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# Bundle app source
COPY . .
RUN npm i -g @nestjs/cli
RUN npm install

EXPOSE 4201

CMD [ "npm", "start", ":dev" ]
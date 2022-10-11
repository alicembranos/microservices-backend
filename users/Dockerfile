FROM node:latest

RUN mkdir -p /app/users

WORKDIR /app/users

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4001

CMD ["npm" , "start"]
FROM node

WORKDIR /app/users

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4001

CMD ["npm" , "start"]
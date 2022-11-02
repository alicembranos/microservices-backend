FROM node

RUN mkdir -p /app/spotify

WORKDIR /app/spotify

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4002

CMD ["npm" , "start"]
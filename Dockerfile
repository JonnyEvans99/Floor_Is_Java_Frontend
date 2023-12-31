FROM node:latest

WORKDIR /app

COPY package*.json ./

ARG API_URL
ENV API_URL ${API_URL}

ARG SESSION_SECRET
ENV SESSION_SECRET ${SESSION_SECRET}

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

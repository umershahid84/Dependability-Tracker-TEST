FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ENV NODE_ENV=development
EXPOSE 5000
EXPOSE 5005


CMD ["npm", "run", "dev"]

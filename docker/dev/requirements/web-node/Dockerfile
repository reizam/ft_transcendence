FROM node:14-alpine

ARG API_URI

ENV NODE_ENV=development
ENV API_URI ${API_URI}

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./

EXPOSE 4000

CMD ["npm", "run", "dev", "--", "--port", "4000"]
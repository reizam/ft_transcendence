FROM node:16-alpine

ARG BACKEND_URL

ENV NODE_ENV=development
ENV BACKEND_URL ${BACKEND_URL}

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
# COPY package-lock.json ./

RUN npm install --production=false

COPY . ./

EXPOSE 80

CMD ["npm", "run", "dev", "--", "--port", "80"]
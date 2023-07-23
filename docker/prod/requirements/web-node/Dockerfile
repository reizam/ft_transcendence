FROM node:16-alpine

ARG BACKEND_URL

ENV NODE_ENV=production
ENV BACKEND_URL ${BACKEND_URL}

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
# COPY package-lock.json ./

RUN npm install

COPY . ./

EXPOSE 4000

RUN npm run build

CMD ["npm", "run", "start", "--", "--port", "4000"]
FROM node:14-alpine

ENV NODE_ENV=development
ARG DATABASE_URL

ENV DATABASE_URL ${DATABASE_URL}

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./
COPY prisma/schema.prisma ./prisma/schema.prisma

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev-prisma"]
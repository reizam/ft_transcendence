FROM node:16-alpine

ARG DATABASE_URL
ARG JWT_SECRET
ARG FORTYTWO_APP_ID
ARG FORTYTWO_APP_SECRET
ARG FORTYTWO_CALLBACK_URL
ARG FRONTEND_URL

ENV NODE_ENV development
ENV DATABASE_URL ${DATABASE_URL}
ENV JWT_SECRET ${JWT_SECRET}
ENV FORTYTWO_APP_ID ${FORTYTWO_APP_ID}
ENV FORTYTWO_APP_SECRET ${FORTYTWO_APP_SECRET}
ENV FORTYTWO_CALLBACK_URL ${FORTYTWO_CALLBACK_URL}
ENV FRONTEND_URL ${FRONTEND_URL}

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY .dockerignore ./
# COPY package-lock.json ./

RUN npm install -g prisma
RUN npm install -g @nestjs/cli
RUN npm install
RUN apk add xdg-utils

COPY . ./
COPY ./prisma ./prisma

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:prod-prisma"]
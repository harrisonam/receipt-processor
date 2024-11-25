FROM node:18-alpine as base

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npm run test
EXPOSE 3000
CMD ["npm","run", "start"]
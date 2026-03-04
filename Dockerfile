FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine

RUN addgroup -S app && adduser -S app -G app
WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev

USER app

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["node", "build"]

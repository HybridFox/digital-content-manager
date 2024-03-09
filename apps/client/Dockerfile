# Stage 0: Build Angular
FROM node:hydrogen-alpine AS build
ARG APP_VERSION

RUN apk add --no-cache python3 build-base

WORKDIR /usr/build
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN echo $APP_VERSION
ENV VITE_APP_VERSION=$APP_VERSION
RUN npm run nx run client:build

# Stage 1: Serve React
FROM nginx:1.25.0-alpine

COPY --from=build /usr/build/dist/apps/client/. /usr/share/nginx/html
COPY apps/client/nginx.conf /etc/nginx/nginx.template
COPY apps/client/docker-entrypoint.sh /
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

FROM node:24.4.1-alpine3.22 AS build
ARG VERSION
WORKDIR /src

COPY package*.json ./
RUN npm ci

COPY . .
RUN VITE_VERSION="$VERSION" npm run build


FROM caddy:2.10.0

RUN setcap -r /usr/bin/caddy

WORKDIR /srv

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /src/dist /srv

ENV PORT=80

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
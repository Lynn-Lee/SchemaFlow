FROM node:24-alpine AS builder

ARG VITE_OPENAI_API_ENDPOINT
ARG VITE_LLM_MODEL_NAME
ARG VITE_HIDE_SCHEMAFLOW_CLOUD
ARG VITE_HIDE_CHARTDB_CLOUD
ARG VITE_DISABLE_ANALYTICS

ENV NODE_OPTIONS=--max-old-space-size=4096

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN echo "VITE_OPENAI_API_ENDPOINT=${VITE_OPENAI_API_ENDPOINT}" > .env && \
    echo "VITE_LLM_MODEL_NAME=${VITE_LLM_MODEL_NAME}" >> .env && \
    echo "VITE_HIDE_SCHEMAFLOW_CLOUD=${VITE_HIDE_SCHEMAFLOW_CLOUD:-${VITE_HIDE_CHARTDB_CLOUD}}" >> .env && \
    echo "VITE_DISABLE_ANALYTICS=${VITE_DISABLE_ANALYTICS}" >> .env

RUN npm run build

FROM nginx:stable-alpine AS production

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY ./default.conf.template /etc/nginx/conf.d/default.conf.template
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]

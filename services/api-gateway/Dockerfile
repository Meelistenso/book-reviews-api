# BUILD FOR LOCAL DEVELOPMENT
FROM node:20-alpine AS development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm ci

# Bundle app source
COPY services/api-gateway services/api-gateway
COPY libraries libraries

RUN cd services/api-gateway

# BUILD FOR PRODUCTION
FROM node:20-alpine AS build

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/services/api-gateway ./services/api-gateway
COPY --from=development /usr/src/app/libraries ./libraries

RUN npm run build api-gateway

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory and passing in
# --omit=dev ensures that only the production dependencies are installed. This
# ensures that the node_modules directory is as optimized as possible
RUN npm ci --omit=dev && npm cache clean --force

# PRODUCTION
FROM node:20-alpine AS production

# Copy the bundled code from the build stage to the production image
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/services/api-gateway/main.js" ]


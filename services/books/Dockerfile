
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
COPY services/books services/books
COPY libraries libraries

RUN cd services/books && npm ci

# BUILD FOR PRODUCTION
FROM node:20-alpine AS build

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/services/books ./services/books
COPY --from=development /usr/src/app/libraries ./libraries

RUN npm run build books

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
COPY --from=build /usr/src/app/services/books/node_modules ./dist/services/books/node_modules

CMD [ "node", "dist/services/books/main.js" ]

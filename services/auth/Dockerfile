###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20-alpine AS development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig.json tsconfig.json
COPY --chown=node:node nest-cli.json nest-cli.json

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY --chown=node:node services/auth services/auth
COPY --chown=node:node libraries libraries

RUN cd services/auth && npm ci

# Use the node user from the image (instead of the root user)
# USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig.json tsconfig.json
COPY --chown=node:node nest-cli.json nest-cli.json

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=development /usr/src/app/services/auth ./services/auth
COPY --chown=node:node --from=development /usr/src/app/libraries ./libraries

RUN npm run build auth

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --omit=dev && npm cache clean --force

# USER node

###################
# PRODUCTION
###################

FROM node:20-alpine AS production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/services/auth/node_modules ./dist/services/auth/node_modules

CMD [ "node", "dist/services/auth/main.js" ]

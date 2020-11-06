# Indicate that we want to use node 14.7.0 alpine.
#? Alpine is simply a lighter image, although it is not as comprehensive as the normal image
FROM node:14.7-alpine


# Copy the package.json and yarn.lock files to the /tmp directory, in order to install dependencies
#? This is done to improve
COPY package.json /tmp
COPY yarn.lock /tmp

# Change into the /tmp directory
WORKDIR /tmp

# Install all the dependencies
RUN yarn

# Make the directory the backend will reside in and copy the node modules into it
RUN mkdir -p /app && cp -a /tmp/node_modules /app/ && cp package.json /app

# Change to the directory and add the backend's source files
WORKDIR /app
COPY . .

RUN yarn run build

RUN rm -r ./src

EXPOSE 80
EXPOSE 443

# Start the backend in production mode
CMD [ "yarn", "start" ]

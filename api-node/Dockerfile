FROM node

# Create working app directory
RUN mkdir -p /usr/src/apiserver
WORKDIR /usr/src/apiserver

# Copy application files to working directory
COPY ./apiserver /usr/src/apiserver/

# Install app dependencies from package.json
RUN npm install

EXPOSE 8080
CMD [ "npm", "start" ]

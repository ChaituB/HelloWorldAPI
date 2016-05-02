FROM nginx

# Copy custom nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Create working directory
RUN mkdir -p /usr/src/nginx/html

# Copy static html files to working directory
COPY ./src /usr/src/nginx/html

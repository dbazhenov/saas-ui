FROM nginx:stable-alpine

# Backup the default config files
RUN mv -v /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf_

# Copy our custom Nginx configuration
COPY nginx_daemon.insert /etc/nginx/nginx.conf_insert
COPY nginx_server.conf /etc/nginx/conf.d/nginx_server.conf
RUN sed -i "s/log_format/# JSON Extended Log format\n    $(cat /etc/nginx/nginx.conf_insert)\n    log_format/g;" /etc/nginx/nginx.conf

# Copy the FE result from the NPM build process
COPY build /usr/share/nginx/html

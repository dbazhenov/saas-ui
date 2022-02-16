FROM nginx:1.21.6

# Remove the default config
RUN rm /etc/nginx/conf.d/default.conf

COPY saas.conf /etc/nginx/conf.d
COPY build /usr/share/nginx/html

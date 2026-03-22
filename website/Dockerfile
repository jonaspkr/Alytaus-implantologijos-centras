FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html
RUN chmod -R 644 /usr/share/nginx/html && find /usr/share/nginx/html -type d -exec chmod 755 {} +
EXPOSE 8080

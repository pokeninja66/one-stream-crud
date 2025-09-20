FROM richarvey/nginx-php-fpm:3.1.6

WORKDIR /var/www/html

# Copy app code
COPY . .

# Laravel/Composer environment
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr
ENV COMPOSER_ALLOW_SUPERUSER 1

# Copy our custom start script
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Use our script as entrypoint (it runs then hands back to parent)
CMD ["/usr/local/bin/start.sh"]
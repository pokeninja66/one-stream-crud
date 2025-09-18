FROM nginx:alpine

# Install PHP and PHP-FPM
RUN apk add --no-cache \
    php83 \
    php83-fpm \
    php83-mysqli \
    php83-pdo \
    php83-pdo_mysql \
    php83-pdo_sqlite \
    php83-mbstring \
    php83-xml \
    php83-curl \
    php83-zip \
    php83-gd \
    php83-intl \
    php83-bcmath \
    php83-fileinfo \
    php83-openssl \
    php83-tokenizer \
    php83-ctype \
    php83-json \
    php83-dom \
    php83-simplexml \
    php83-xmlreader \
    php83-xmlwriter \
    php83-phar \
    php83-opcache \
    php83-pcntl \
    php83-posix \
    php83-sockets \
    php83-sysvmsg \
    php83-sysvsem \
    php83-sysvshm \
    php83-shmop \
    php83-sodium \
    php83-iconv \
    php83-calendar \
    php83-exif \
    php83-gettext \
    php83-imap \
    php83-ldap \
    php83-pgsql \
    php83-pdo_pgsql \
    php83-redis \
    php83-soap \
    php83-xsl \
    php83-zlib \
    php83-session \
    composer \
    nodejs \
    npm

# Set working directory
WORKDIR /var/www/html

# Copy composer files
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copy package files
COPY package.json package-lock.json ./

# Install Node dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build frontend assets
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Configure PHP-FPM
RUN sed -i 's/user = nobody/user = www-data/' /etc/php83/php-fpm.d/www.conf \
    && sed -i 's/group = nobody/group = www-data/' /etc/php83/php-fpm.d/www.conf \
    && sed -i 's/listen.owner = nobody/listen.owner = www-data/' /etc/php83/php-fpm.d/www.conf \
    && sed -i 's/listen.group = nobody/listen.group = www-data/' /etc/php83/php-fpm.d/www.conf \
    && sed -i 's/;listen.mode = 0660/listen.mode = 0660/' /etc/php83/php-fpm.d/www.conf

# Configure PHP
RUN echo "memory_limit = 256M" >> /etc/php83/php.ini \
    && echo "upload_max_filesize = 64M" >> /etc/php83/php.ini \
    && echo "post_max_size = 64M" >> /etc/php83/php.ini \
    && echo "max_execution_time = 300" >> /etc/php83/php.ini \
    && echo "opcache.enable=1" >> /etc/php83/php.ini \
    && echo "opcache.memory_consumption=128" >> /etc/php83/php.ini \
    && echo "opcache.interned_strings_buffer=8" >> /etc/php83/php.ini \
    && echo "opcache.max_accelerated_files=4000" >> /etc/php83/php.ini \
    && echo "opcache.revalidate_freq=2" >> /etc/php83/php.ini \
    && echo "opcache.fast_shutdown=1" >> /etc/php83/php.ini

# Configure NGINX
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Create startup and deploy scripts
COPY docker/start.sh /start.sh
COPY docker/deploy.sh /deploy.sh
RUN chmod +x /start.sh /deploy.sh

EXPOSE 80

CMD ["/start.sh"]

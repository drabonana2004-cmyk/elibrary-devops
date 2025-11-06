FROM php:8.2-apache

# Extensions PHP
RUN docker-php-ext-install pdo pdo_mysql

# Apache config
COPY apache.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

# Application
WORKDIR /var/www/html
COPY . .

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html/storage

EXPOSE 8000
CMD ["apache2-foreground"]
# Herfaa — Laravel API image for Render (PHP 8.4; code uses Pdo\Mysql constants)
FROM php:8.4-cli

# System libraries + PHP extensions Laravel needs (MySQL, image uploads, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip libzip-dev libpng-dev libjpeg-dev libfreetype6-dev libonig-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring zip gd bcmath exif \
    && rm -rf /var/lib/apt/lists/*

# Composer (copied from the official Composer image)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

# Install PHP dependencies (production only) and link public storage
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist \
    && php artisan storage:link || true

# Render injects the port to listen on via $PORT.
# On boot: run pending migrations, then start the app.
CMD php artisan migrate --force \
    && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}

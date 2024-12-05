# Use the official PHP image with Apache
FROM php:8.1-apache

# Enable Apache mod_rewrite for clean URLs
RUN a2enmod rewrite

# Set the working directory
WORKDIR /var/www/html

# Copy the application files to the container (including package.json)
COPY . /var/www/html/

# Expose port 80 (Apache default port)
EXPOSE 80

# Start Apache in the foreground
CMD ["apache2-foreground"]

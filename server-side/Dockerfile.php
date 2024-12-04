# Use an official PHP image with Apache
FROM php:8.1-apache

# Enable mod_rewrite for PHP
RUN a2enmod rewrite

# Set the working directory to where the PHP files are located
WORKDIR /var/www/html

# Copy the PHP files to the container
COPY . /var/www/html/

# Expose port 80 to access the PHP server
EXPOSE 80

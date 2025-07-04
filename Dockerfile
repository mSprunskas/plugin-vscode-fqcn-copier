# Use the official Node.js 20 Alpine base image
FROM node:20-alpine

# Create a non-root user for the app
RUN adduser -D -s /bin/sh app

# Set working directory
WORKDIR /home/app/src

# docker build -t nodejs20 .
# docker run -itd --user root -v ./:/home/app/src --rm --name nodejs20 nodejs20
# docker exec -it nodejs20 sh

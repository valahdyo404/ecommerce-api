FROM node:16.12.0-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 3000

# # Create a script to run migrations and start the application
# RUN echo '#!/bin/sh\n\
# npm run migrate\n\
# npm start\n\
# ' > /app/start.sh && chmod +x /app/start.sh

# # Set the start script as the default command
# CMD ["/app/start.sh"]

CMD npm run migrate && npm start

FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define environment variables
ENV NODE_ENV production
ENV PORT 3000

# Command to run the application
CMD ["node", "server.js"]
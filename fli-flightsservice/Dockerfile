# Use the official Node.js 14 LTS image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Copy the Postman collection file
COPY serviceAccountKey.json .

# Build the application
RUN npm run build

# Start the application
CMD [ "npm", "start" ]

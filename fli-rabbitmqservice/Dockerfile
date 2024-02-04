# Use the official Node.js 14 LTS image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port on which your NestJS application will run
EXPOSE 3005

# Set the command to run your NestJS application using the built output
CMD ["node", "dist/main"]
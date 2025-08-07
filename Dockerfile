# Use an official Deno runtime as a parent image
FROM denoland/deno:1.44.4

# Set the working directory in the container
WORKDIR /app

# Expose the port the app runs on
EXPOSE 8000

# Copy the rest of the application code
COPY . .

# Cache the dependencies
RUN deno cache server.ts

# Specify the command to run on container startup
CMD ["run", "--allow-net", "--allow-read", "--allow-env", "server.ts"]

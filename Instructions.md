# Popcorn Palace - Movie Theater Application

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v18 or higher)
- NPM (v9 or higher)
- Docker (v20 or higher)
- Docker Compose (v2 or higher)

## Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/roeina68/popcorn_palace_ts.git
cd popcorn_palace_ts
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env

# Server Configuration
PORT=3000
NODE_ENV=development
```

4. Start the PostgreSQL database using Docker Compose:
```bash
# Start the database container
docker-compose up -d

# Wait for the database to be ready (about 10-15 seconds)
```


## Running the Application

### Development Mode
```bash
npm run start:dev
```
This will start the application in development mode with hot-reload enabled.

### Production Mode
```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

### Test Mode
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api
```

## Available Scripts

- `npm run start:dev`: Start the application in development mode
- `npm run start:prod`: Start the application in production mode
- `npm run build`: Build the application
- `npm test`: Run tests
- `npm run test:cov`: Run tests with coverage
- `npm run test:watch`: Run tests in watch mode

## Docker Commands

```bash
# Start the database container
docker-compose up -d

# Stop the database container
docker-compose down

# View container logs
docker-compose logs -f

# Restart the database container
docker-compose restart
```

## Project Structure

```
src/
├── common/          # Common utilities and services
├── config/          # Configuration files
├── movies/          # Movie module
├── showtimes/       # Showtime module
├── bookings/        # Booking module
└── main.ts          # Application entry point
```


## Support

For any questions or issues, please create an issue in the GitHub repository.
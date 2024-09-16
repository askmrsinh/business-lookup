# Express Node TS project for business lookup API

This project provides an HTTP REST API for business lookup, built with an Express.js server using TypeScript.
The API enables users to lookup for businesses, filter by type, limit, and sort them by proximity to specified
coordinate (latitude and longitude).

<!-- ⛔️ MD-MAGIC-EXAMPLE:START (TOC:collapse=true&collapseText=Click to expand) -->
<details>
<summary>Table of Contents (click to expand)</summary>

* [Express Node TS Project for Business Lookup API](#express-node-ts-project-for-business-lookup-api)
    * [Getting Started](#getting-started)
        * [Prerequisites](#prerequisites)
        * [Installation](#installation)
        * [Setting up the Database](#setting-up-the-database)
        * [Running the Application](#running-the-application)
    * [API Routes](#api-routes)
        * [GET /discovery](#get-discovery)
            * [Query Parameters](#query-parameters)
            * [Response](#response)
            * [Examples](#examples)
            * [Error Handling](#error-handling)
    * [Available Scripts](#available-scripts)
    * [Technology Stack](#technology-stack)
    * [Project Structure](#project-structure)
    * [Testing](#testing)

</details>
<!-- ⛔️ MD-MAGIC-EXAMPLE:END -->


## Getting Started

### Prerequisites

Please ensure that you have Node.js 20 and pnpm installed for local development. Alternatively, you can use Docker to
run the application in a containerized environment using the included compose file, which eliminates the need for local
Node.js and pnpm installations.

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/askmrsinh/business-lookup business-lookup
   cd business-lookup
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Setting up the Database

Run migrations and seed the database:

```
npx mikro-orm migration:fresh && npx mikro-orm seeder:run
```

### Running the Application

To run the application in development mode (watch mode):

```bash
pnpm start:dev
```

The server will be available at `http://localhost:3000`.

## API Routes

### GET /discovery

Lists all businesses with optional sorting, limiting, and filtering.

#### Query Parameters

| Parameter | Type    | Description                                      | Default |
| --------- | ------- | ------------------------------------------------ | ------- |
| lat       | number  | Latitude for distance calculation                | 0       |
| long      | number  | Longitude for distance calculation               | 0       |
| limit     | integer | Maximum number of results to return (-1 for all) | -1      |
| type      | string  | Filter businesses by type (eg. Cafe)             |         |

#### Response

The response is an array of business objects, each containing:

- `name`: Name of the business
- `latitude`: Latitude coordinate of the business
- `longitude`: Longitude coordinate of the business
- `distance`: Distance from the provided coordinates (default from 0,0)

> [!NOTE]  
> The distance calculation (in kilometers) is performed using the spherical law of cosines formula at the database
> level. Sorting, limiting, and filtering are also handled at the database level for optimal performance.

#### Examples

1. Get all businesses (sorted by nearest to 0,0, default):

   ```
   GET /discovery
   ```

   ```json
   [
     {
       "name": "Business 4",
       "latitude": 48.8566,
       "longitude": 2.3522,
       "distance": 5437.294595456117
     },
     {
       "name": "Business 3",
       "latitude": 51.5074,
       "longitude": -0.1278,
       "distance": 5727.37416793213
     },
     {
       "name": "Business 6",
       "latitude": 51.5074,
       "longitude": -0.1278,
       "distance": 5727.37416793213
     },
     {
       "name": "Business 1",
       "latitude": 40.7128,
       "longitude": -74.006,
       "distance": 8667.068154202436
     },
     {
       "name": "Business 5",
       "latitude": 41.8781,
       "longitude": -87.6298,
       "distance": 9811.334640548625
     },
     {
       "name": "Business 2",
       "latitude": 34.0522,
       "longitude": -118.2437,
       "distance": 12574.353209790605
     }
   ]
   ```

2. Get businesses near a specific location, sorted by distance:

   ```
   GET /discovery?lat=40.7128&long=-74.0060
   ```

   ```json
   [
     {
       "name": "Business 1",
       "latitude": 40.7128,
       "longitude": -74.006,
       "distance": 0
     },
     {
       "name": "Business 5",
       "latitude": 41.8781,
       "longitude": -87.6298,
       "distance": 1144.291273946347
     },
     {
       "name": "Business 2",
       "latitude": 34.0522,
       "longitude": -118.2437,
       "distance": 3935.746254609723
     },
     {
       "name": "Business 3",
       "latitude": 51.5074,
       "longitude": -0.1278,
       "distance": 5570.222179737958
     },
     {
       "name": "Business 6",
       "latitude": 51.5074,
       "longitude": -0.1278,
       "distance": 5570.222179737958
     },
     {
       "name": "Business 4",
       "latitude": 48.8566,
       "longitude": 2.3522,
       "distance": 5837.24090382584
     }
   ]
   ```

3. Get three businesses near a specific location, sorted by distance:

   ```
   GET /discovery?lat=40.7128&long=-74.0060&limit=3
   ```

   ```json
   [
     {
       "name": "Business 1",
       "latitude": 40.7128,
       "longitude": -74.006,
       "distance": 0
     },
     {
       "name": "Business 5",
       "latitude": 41.8781,
       "longitude": -87.6298,
       "distance": 1144.291273946347
     },
     {
       "name": "Business 2",
       "latitude": 34.0522,
       "longitude": -118.2437,
       "distance": 3935.746254609723
     }
   ]
   ```

4. Get the closest cafe to a specific location:
   ```
   GET /discovery?lat=40.7128&long=-74.0060&limit=1&type=Cafe
   ```
   ```json
   [
     {
       "name": "Business 1",
       "latitude": 40.7128,
       "longitude": -74.006,
       "distance": 0
     }
   ]
   ```

#### Error Handling

- Invalid query parameters will result in a 400 Bad Request response with details about the error.
- Valid latitude ranges from -90 to 90.
- Valid longitude ranges from -180 to 180.
- Limit can be any non-negative integer or -1 (for all results).

Example:

```
GET /discovery?lat=invalid8&long=9000&limit=-42.42
```

```json
{
  "message": "Invalid request.",
  "error": {
    "lat": [
      "lat must be a number",
      "lat must be a valid earth latitude",
      "lat must not be less than -90",
      "lat must not be greater than 90"
    ],
    "long": ["long must be a valid earth longitude", "long must not be greater than 180"],
    "limit": ["limit must be an integer number", "limit must not be less than -1"]
  }
}
```

## Available Scripts

- `pnpm start`: Initializes the Database and start the application in production mode
- `pnpm start:dev`: Start the application in development (watch) mode
- `pnpm start:prod`: Start the application in production mode
- `pnpm test`: Run tests
- `pnpm lint`: Check code style with Prettier and ESLint
- `pnpm format`: Format code with Prettier

## Technology Stack

- Express.js
- TypeScript
- MikroORM
- SQLite
- class-validator (for request validation)
- class-transformer (for request deserialization)
- Pino (for logging)
- Jest (for testing)

## Project Structure

The project uses a typical Express.js structure with TypeScript. Key files and directories include:

- `server.ts`: Main application file
- `app/`: Contains application logic
  - `controllers/`: API route handlers
  - `entities/`: Database entity definitions
  - `seeders/`: Database seeders
  - `dtos/`: Request deserialization and validation

## Testing

The project includes comprehensive tests for the `/discovery` API endpoint. Run the tests using:

```
pnpm test
```

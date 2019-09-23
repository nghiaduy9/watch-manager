# Night Watch watch manager

## INSTALLATION

### Requirements

- Node.js >= 8
- Dotenv files: `.env.production` and/or `.env.development`

### Instructions

```bash
$ yarn install
$ yarn start # yarn dev for development
```

## DOCUMENTATION

### Environment Variables

- `NODE_ENV` (string): "development" or "production" environment
- `PORT` (number): Port number to run the server
- `SCHEDULER_ADDRESS` (string): Address of scheduler service

### Database (MongoDB)

#### Watch schema

- `_id` (ObjectId): Unique ID
- `userID` (ObjectId): ID of the user to whom this watch belongs
- `url` (string): URL to crawl
- `interval` (positive integer): Number of seconds between executions
- `targets` (object[]): Array of target objects
  - `name` (string): Unique name
  - `cssSelector` (string): CSS selector
  - `type` (string): Type of the data. Currently, only "string" is a valid type
  - `data` (string): Current value
  - `updatedAt` (Date): Time at which the data was last updated
- `active` (boolean): Being scheduled or not
- `createdAt` (Date): Time at which the user was created
- `updatedAt` (Date): Time at which the user was last updated

### Routes

#### GET `/`

> Just for testing

##### Response body

- `iam`: `"/"`

#### POST `/`

> Add a new watch

##### Request body

- `userID` (ObjectId): ID of the user to whom this watch belongs
- `url` (string): URL to crawl
- `interval` (positive integer): Number of seconds between executions
- `targets` (object[]): Array of target objects
  - `name` (string): Unique name
  - `cssSelector` (string): CSS selector
  - `type` (string): Type of the data. Currently, only "string" is a valid type

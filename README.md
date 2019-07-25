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

### Routes

#### GET `/`

> Just for testing

##### Response body

- `iam`: `"/"`

#### POST `/`

> Add a new watch

##### Request body

- `interval` (positive integer): Number of seconds between executions
- `url` (string): URL to crawl
- `cssSelectors` (object): Mapping from CSS selectors to their types. Currently, only "string" is a valid type.

# Night Watch watch manager

## INSTALLATION

### Requirements

- Node.js >= 12.0.0

## DOCUMENTATION

### Environment Variables

- `NODE_ENV` (string): "development" or "production" environment
- `PORT` (number): Port number to run the server
- `MONGODB_URI` (string): MongoDB URI
- `MONGODB_DB_NAME` (string): Database name
- `GATEWAY_ADDRESS` (string): Address of the API gateway

### Routes

#### 1. GET `/`

> Just for testing

##### Response body

- `iam`: `"/"`

#### 2. POST `/`

> Add a new watch

##### Request body

- `userID` (ObjectID): ID of the user to whom this watch belongs
- `url` (string): URL to crawl
- `interval` (positive integer): Number of seconds between executions
- `targets` (object[]): Array of target objects
  - `name` (string): Unique name
  - `cssSelector` (string): CSS selector
  - `type` (string): Type of the data. Currently, only "string" is a valid type

#### 3. GET `/:id`

> Get all information of a watch

##### Route parameters

- `id` (ObjectID): ID of the watch

##### Response body

See [Watch schema][0].

#### 4. PUT `/:id/targets`

> Update targets information of a watch

##### Route parameters

- `id` (ObjectID): ID of the watch

##### Request body

Array of updated target objects (not all)

- `name` (string): Unique name
- `cssSelector` (string): CSS selector
- `type` (string): Type of the data. Currently, only "string" is a valid type
- `data` (string): New value

#### 5. PUT `/:id/status/:newStatus`

> Activate or deactivate a watch

##### Route parameters

- `id` (ObjectID): ID of the watch
- `newStatus` (string): Either "active" or "inactive"

[0]: https://github.com/night-watch-project/watch-manager/blob/master/src/models/watch.js

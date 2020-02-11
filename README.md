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

#### 0. GET `/`

> Just for testing

##### Response body

- `iam`: `"/"`

#### 1. POST `/`

> Add a new watch

##### Request body

- `userID` (ObjectID): ID of the user to whom this watch belongs
- `url` (string): URL to crawl
- `interval` (positive integer): Number of seconds between executions
- `targets` (object[]): Array of target objects
  - `name` (string): Unique name
  - `cssSelector` (string): CSS selector
  - `type` (string): Type of the data. Currently, only "string" is a valid type

#### 2. GET `/:id`

> Get all information of a watch

##### Route parameters

- `id` (ObjectID): ID of the watch

##### Response body

See [Watch schema][0].

#### 3. PUT `/:id/targets`

> Update targets information of a watch

##### Route parameters

- `id` (ObjectID): ID of the watch

##### Request body

Array of updated target objects (not all)

- `name` (string): Unique name
- `cssSelector` (string): CSS selector
- `type` (string): Type of the data. Currently, only "string" is a valid type
- `data` (string): New value

#### 4. PUT `/:id/status/:newStatus`

> Activate or deactivate a watch

##### Route parameters

- `id` (ObjectID): ID of the watch
- `newStatus` (string): Either "active" or "inactive"

#### 5. GET `/users/:userID`

> Get all watches of an user

##### Route parameters

- `userID` (ObjectID): ID of the user

##### Response body

Array of watch objects. See [Watch schema][0].

[0]: https://github.com/night-watch-project/watch-manager/blob/master/src/schemas/models/watch.js

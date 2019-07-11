# Night Watch app server

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

### Routes

#### GET `/`

> Just for testing

##### Response body

- iam: `"/"`

#### POST `/watch`

> Add a new watch

##### Request body

- interval (positive integer): Number of seconds between executions
- url (string): URL to crawl
- cssSelectors (object): Mapping from CSS selectors to their types. Currently, only "string" is a valid type.

##### Response body

- success (boolean): Status

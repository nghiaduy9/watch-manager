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

| ROUTE        | METHOD | REQ BODY                                                  | RES BODY               | USE           |
| ------------ | ------ | --------------------------------------------------------- | ---------------------- | ------------- |
| `/`          | GET    |                                                           | `{ iam: '/' }`         |
| `/api`       | GET    |                                                           | `{ iam: '/api' }`      |
| `/api/watch` | POST   | `{ url: string, cssSelectors: object, interval: number }` | `{ success: boolean }` | Add new watch |

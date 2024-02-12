# kanban

## Getting Started

To initiate the project, follow the steps outlined below:

##### 1. In the root folder :

```
docker-compose up
```

To run Postgress and the backend

##### 2. In the /frontend folder :

We need to install and launch a command

```
yarn

yarn dev
```

### Localhost

- Frontend: The frontend can be accessed at http://localhost:5173/.
- Backend: The backend and API documentation (Swagger) are available at http://localhost:3000/api.

### Database

If you want to see the data you can do, thanks to prisma :

_In the backend folder :_

```
npx prisma studio
```

And go to http://localhost:5555

### Utilizing Prisma

For local development, you need to configure environment variables. Copy the .env.example file and rename it to .env in the same directory.

## To-Do

- Implement tests to ensure reliability and stability of the application.

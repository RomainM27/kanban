# kanban

## To Start the project

1. In the root folder :

```
docker-compose up
```

To run Postgress and the backend

2. In the /frontend folder :

We need to install and launch a command

```
yarn

yarn dev
```

### Localhost

- Frontend : http://localhost:5173/
- Backend : http://localhost:3000/api Info with swagger

### Database

If you want to see the data you can do, thanks to prisma :

_In the backend folder :_

```
npx prisma studio
```

And go to http://localhost:5555

### If you want to use prisma

You need to add a .env, in local, you can copy the .env.exemple and rename it .env

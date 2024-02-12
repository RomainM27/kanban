# kanban

## To Start the project

1. In the root folder :

```
docker-compose up
```

To run Postgress and the backend

2. In the /frontend folder :

```
yarn dev
```

### Localhost

- Frontend : http://localhost:5173/
- Backend : http://localhost:3000/api
  (Once it's up you can check : http://localhost:3000/api/boards/1)

### Database

If you want to see the data you can do, thanks to prisma :

_In the backend folder :_

```
npx prisma studio
```

And go to http://localhost:5555

# CSCI2720_Project
Repository for CSCI2720 group project

## First thing first
Make sure to `git pull` all the time.
```
git pull
```

## Every time you pull
please do this to make sure you install all modules.
```
cd Project // Get into the frontend
npm i
cd Database // Get into the db init
npm i
cd Server // Get into the backend
npm i
```
Do not modify `Project/.gitignore`.

## How to run the code
### MongoDB initialisation
We are using MongoDB Altas and please do this to initialise the database. Usually, It is all set.
```
cd Project/Database
npm i
node index
```

### Backend
please do this to run the Express.js server. If the server is not running, the frontend cannot call API to do the jobs. Only the POST method is used so please use Postman or your code to call the API and Browser will not work.
```
cd Project/Server
npm i
node index
```

### Frontend
Since we are using vite (It is faster.), please do this to run the code.
```
npm run dev
```

## Tailwind CSS
Tailwind CSS is installed so please google it for styling

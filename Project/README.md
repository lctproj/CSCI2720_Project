# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Database Initialisation
We use MongoDB Altas to host the database for us. To initialise the database, please do the following code.
```
cd Database
node index
```
For the sake of simplicity, the database access setting allows anyone from anywhere to connect. Note that further data processing needs to be conducted so for now it is only for reference.

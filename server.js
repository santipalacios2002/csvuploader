// to be used to add paths
const path = require('path');
// to be used for routing handling

const express = require('express');


// importing routes
const routes = require('./controller');

// to be used as an ORM
const sequelize = require('./config/connection');
const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// to be used once we create routes
app.use(routes);

// synchronization for server and DB
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port: ${PORT}`));
});
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: "localhost" , 
  user: "root",
  password: "rohitsingh2077" ,
  database: "airbnb",
})

module.exports = pool.promise();
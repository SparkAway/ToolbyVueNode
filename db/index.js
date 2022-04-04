const mysql = require('mysql');
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '0308',
    database: 'ToolbyVue',
})
module.exports = db;
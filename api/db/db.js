import mysql from 'mysql2';
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "medias",
    port:8889
})

db.connect((error) => {
    if (error) { throw error }
else {
    console.log('your connected')
};
})
export default db
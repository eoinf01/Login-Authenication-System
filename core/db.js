

const sqlite3 = require('sqlite3').verbose();

// open the database connection
let DB_PATH = ':memory:';
let db = new sqlite3.Database(DB_PATH, (err) => {
    if (err)
        console.error(err.message);
    console.log('Connected to ' + DB_PATH + ' database.')

    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON;', (error) => {
        if (error)
            console.error("Pragma statement didn't work.");
        else
            console.log("Foreign Key Enforcement is on.");
    });
});

//create an User table
db.serialize(() => {
    // Queries scheduled here will be serialized.
    //Created user table
    db.run('CREATE TABLE IF NOT EXISTS User(userID integer primary key AUTOINCREMENT,' +
        'username varchar(20) not null,' +
        'password varchar(20) not null,' +
        'role_name varchar(20) not null)');
    //insert user eoinf01 into database
    db.run('insert into User values(1,"eoinf01","$2a$10$IfpCzMu2a92tghZFikScrOFlEVFo.qvaPEA3VYItpiZD/QjilNZhS","admin")');
    //insert user eoin into database
    db.run('insert into User values(2,"eoin","$2a$10$IfpCzMu2a92tghZFikScrOFlEVFo.qvaPEA3VYItpiZD/QjilNZhS","guest")');
    //insert user sophie into database
    db.run('insert into User values(3,"sophie","$2a$10$IfpCzMu2a92tghZFikScrOFlEVFo.qvaPEA3VYItpiZD/QjilNZhS","ordinary")');
});

module.exports = db;
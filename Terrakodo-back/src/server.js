const express = require('express')
let mysql = require('mysql2');
let bodyParser = require('body-parser')
var cors = require('cors')
const app = express()
const port = 3000;

app.use(bodyParser.json());
app.use(cors())

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'terrakodo-task'
});

connection.connect((err) => {
    if (err) {
      return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');

    let query = `CREATE TABLE tasks (
            id bigint UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
            title varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
            description varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
            priority ENUM ('1','2','3','4','5'),
            status ENUM ('TO_DO', 'IN_PROGRESS', 'DONE') DEFAULT 'TO_DO',
            completion_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) 
        ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;

    connection.query(
        query,
        (err, results, fields) => {
          console.log("Tasks created with success")
        }
    );
      
});

app.post('/api/task', (req, res) => {
    let data = { 
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority
    };
  
    let query = "INSERT INTO tasks SET ?";
    
    connection.query(query, data,(err, results) => {
        if (err) res.status(400).send({message: err.message})
        res.status(200).send(data);
    });
})

app.get('/api/task',(req, res) => {
    let query = "SELECT * FROM tasks";
    
    connection.query(query, (err, results) => {
        if(err) res.status(400).send({message: err.message})
        res.status(200).send(results);
    });
});

app.delete('/api/task/:id',(req, res) => {
    let query = "DELETE FROM tasks WHERE id = "+req.params.id+"";
      
    connection.query(query, (err, results) => {
        if (err) res.status(400).send({message: err.message})
        res.status(200).send({message: "Successfully deleted"});
    });
});

app.delete('/api/task/:id',(req, res) => {
    let query = "DELETE FROM tasks WHERE id = "+req.params.id+"";
      
    connection.query(query, (err, results) => {
        if (err) res.status(400).send({message: err.message})
        res.status(200).send({message: "Successfully deleted"});
    });
});

app.put('/api/items/:id',(req, res) => {
    let query = "UPDATE tasks SET title='" + req.body.title + "', description ='" + req.body.description + "' WHERE id=" + req.params.id;
    
    connection.query(query, (err, results) => {
        if (err) res.status(400).send({message: err.message});
        res.status(200).send(results)
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
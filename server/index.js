const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

//Middleware
app.use(cors());
app.use(express.json());

//Routes

//Create Todo
app.post('/todos', async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query("INSERT INTO todo (description) VALUES ($1) RETURNING *", //RETURNING * will return the "rows" data
      [description]
    );

    res.json(newTodo.rows[0]);

  } catch (err) {
    console.log(err.message);
  }
});

//Get All Todos
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows)

  } catch (err) {
    console.log(err.message);    
  };
});

//Get A Single Todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singleTodo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

    res.json(singleTodo.rows[0]);

  } catch (err) {
    console.log(err.message);    
  };
});

//Update a Todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updatedTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);

    res.json("Todo was updated");

  } catch (err) {
    console.log(err.message);    
  };
});

//Delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);

    res.json(`Todo ID ${id} has been deleted`);

  } catch (err) {
    console.log(err.message);    
  };
});


//Server
app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
import express, { response } from 'express';
import cors from 'cors';
import database from "../src/database.js"

const app = express();
app.use(express.json());
app.use(cors());

//route for searching your notes
app.get("/api/search/:searchValue", async (req, res) => {
    const searchValue = req.params.searchValue;
    const result = await database.raw(`select * from notes where title like '%${searchValue}%' or category like '%${searchValue}%' or description like '%${searchValue}%' or date like '%${searchValue}%'`);
    res.status(200);
    res.json(result);
});

//create a new note
app.post("/api/notes", async (req, res)=> {
    const {title, category, date, description} = req.body;
    const insert = await database.raw(`insert into notes (title, category, date, description) values ('${title}','${category}', '${date}', '${description}')`);
    const id = insert.lastInsertRowid;
    const result = await database.raw(`select * from notes where id= ${id}`);
    res.status(200);
    res.json(result);
})

//get all notes
app.get("/api/notes", async (req, res) => {
    const result = await database.raw(`select * from notes`);
    res.status(200);
    res.json(result);
});

//get one single note
app.get("/api/notes/:id", async (req, res) => {
    const id = req.params.id;
    const result = await database.raw(`select * from notes where id='${id}'`);
    res.status(200);
    res.json(result);
});

//update note
app.put("/api/note/:id", async (req, res) =>{
    const id = req.params.id;
    const {title, category, date, description} = req.body;
    await database.raw(`update notes set title='${title}', category='${category}', date='${date}', description='${description}' where id=${id}`);
    const result = await database.raw(`select * from notes where id= ${id}`);
    res.status(200);
    res.json(result);
})

//delete note
app.delete("/api/note/:id", async (request, response) => {
    const id = request.params.id;
    await database.raw(`delete from notes where id=${id}`);
    const result =  await database.raw(`select * from notes`);
    response.status(200);
    response.json(result);
  });

//Route that handles every other route
app.all("/*", async (request, response ) => {
    response.status(404);
    response.json({error: "This route does not exist"});
});

const hostname = "localhost";
const port = 4000;

app.listen(port, hostname, () => {
    console.log(`Server listening on http://${hostname}:${port}`);
  });
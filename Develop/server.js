const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf8', function(error, data) {
    if (error) {
      console.log("Error reading file: ", error);
      res.status(500).send("Internal Server Error");
      return;
    }

    try {
      let notes = JSON.parse(data);
      res.json(notes);
    } catch (parseError) {
      console.log("Error parsing JSON: ", parseError);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf8', function(error, data) {
    if (error) {
      console.log("Error: ", error);
      res.status(500).send("Internal Server Error");
      return;
    }

    let notes = JSON.parse(data);
    const newNote = req.body;
    newNote.id = notes.length + 1; 
    notes.push(newNote);

    fs.writeFile('db/db.json', JSON.stringify(notes), 'utf8', function(err) {
      if (err) {
        console.log("Error: ", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.sendStatus(200);
    }); 
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  fs.readFile('db/db.json', 'utf8', function(error, data) {
    if (error) {
      console.log("Error: ", error);
      res.status(500).send("Internal Server Error");
      return;
    }

    let notes = JSON.parse(data);
    const index = notes.findIndex(note => note.id === parseInt(id));
    if (index === -1) {
      res.status(404).send("Note not found");
      return;
    }

    notes.splice(index, 1);

    fs.writeFile('db/db.json', JSON.stringify(notes), 'utf8', function(err) {
      if (err) {
        console.log("Error: ", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.sendStatus(200);
    }); 
  });
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to allow cross-origin requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf8', function(error, data) {
    if (error) {
      console.log("Error: ", error);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(JSON.parse(data))
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
    newNote.id = notes.length + 1; // Generate a unique ID for the new note
    notes.push(newNote);

    fs.writeFile('db/db.json', JSON.stringify(notes), 'utf8', function(err) {
      if (err) {
        console.log("Error: ", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.sendStatus(200); // Send a success status
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

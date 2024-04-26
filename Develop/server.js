const express = require('express');
const path = require('path');
const fs = require('fs');
const exp = require('constants');
// we CREATE an EXPRESS INSTANCE
const app = express();
const PORT = process.env.PORT || 3000;

// Express Config --> Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static('public'));

// Explicitly set the MIME type for JavaScript files

/*
app.get('/assets/js/index.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'assets', 'js', 'index.js'));
});
*/

// Serve your HTML file
app.get('/api/notes', (req, res) => {
   // console.log('Incoming Request OBJECT: ', req)
    // what are supposed to do(?)

    // we want to request/find the NOTES DATASET
    fs.readFile('db/db.json', 'utf8', function(error, data) {
        if(error) {
            console.log("Error: ", error);
            // return;
        }
        console.log('Data: ', data)
        console.log('data type: ', typeof data)

        // RESPONDE to the INCOMING REQUEST
        res.json(JSON.parse(data))
    });
    // we CAN parse or filter/sort ACT ON the dataset
    

});

app.post('/api/notes', (req, res) => {
    console.log("Incoming Data BODY: ", req.body)
    console.log("Type of BODY: ", typeof req.body)
})


app.get('/notes', (req, res) => {
  //res.sendFile(path.join(__dirname, 'public', 'notes.html'));
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', (req, res) => {
  //res.sendFile(path.join(__dirname, 'public', 'index.html'));
  res.sendFile(path.join(__dirname, './public/index.html'));
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

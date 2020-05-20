var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();
var PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Renders index html
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
//Renders notes html
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
//Loads data from JSON database
app.get("/api/notes", function(req, res) {
    fs.readFile("./db/db.json", function(err, data) {
        if(err) throw err;

        return res.json(JSON.parse(data));
    });
});
//Posts data to JSON database
app.post("/api/notes", function(req, res) {
    const newNote = req.body;

    fs.readFile("./db/db.json", function(err, data) {
        if(err) throw err;

        const storedNotes = JSON.parse(data);

        if(storedNotes.length > 0) {
            newNote.id = storedNotes[storedNotes.length - 1].id + 1;
        }
        else {
            newNote.id = 1;
        }
        storedNotes.push(newNote);

        fs.writeFile("./db/db.json", JSON.stringify(storedNotes), function(err) {
            if(err) throw err;
        });
    
        return res.json(newNote);
    });
});
//Empties JSON
app.delete("/api/notes/:id", function(req, res) {
    const deleteID = req.params.id;
    
    fs.readFile("./db/db.json", function(err, data) {
        if(err) throw err;

        let notes = JSON.parse(data);
        let DBNotes = [];

        for(note of notes) {
            if(note.id != deleteID) {
                finalNotes.push(note);
                console.log(note);
            }
        }

        fs.writeFile("./db/db.json", JSON.stringify(DBNotes), function(err) {
            if(err) throw err;
        });
        
        return res.json(finalNotes);
    });
});
//alerts user to app staring
app.listen(PORT, function() {
    console.log(`App listening on PORT  + ${PORT} http://localhost:${PORT}/notes`);
});
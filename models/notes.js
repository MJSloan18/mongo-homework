var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NotesSchema = new Schema({
    // `title` is of type String
    title: String,
    // `body` is of type String
    body: String
});

var Notes = mongoose.model("Notes", NotesSchema);

module.exports = Notes;

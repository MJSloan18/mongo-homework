var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var ArticlesSchema = new Schema({
    // `title` is required and of type String
    title: {
        type: String,
        required: true
    },
    // `link` is required and of type String
    link: {
        type: String,
        required: true
    },
    notes: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Articles = mongoose.model("Articles", ArticlesSchema);

module.exports = Articles;

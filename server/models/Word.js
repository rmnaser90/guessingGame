const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WordSchema = new Schema({
   word:String,
   level:String

})

const Word = mongoose.model('Word', WordSchema)
module.exports = Word


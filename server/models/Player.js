const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlayerSchema = new Schema({
    name: String,
    inGame: Boolean,
    game:{type: Schema.Types.ObjectId, ref: 'Game'},
    gameHistory:[{type: Schema.Types.ObjectId, ref: 'Game'}]

})


const Player = mongoose.model('Player', PlayerSchema)
module.exports = Player
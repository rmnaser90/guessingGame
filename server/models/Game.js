const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GameSchema = new Schema({
    pin: Number,
    public: Boolean,
    player1: { type: Schema.Types.ObjectId, ref: 'Player' },
    player2: { type: Schema.Types.ObjectId, ref: 'Player' },
    guessingPlayer: { type: Schema.Types.ObjectId, ref: 'Player' },
    drawingPlayer: { type: Schema.Types.ObjectId, ref: 'Player' },
    currentWord: { type: Schema.Types.ObjectId, ref: 'Word' },
    finishedDrawing: Boolean,
    finishedGuessing: Boolean,
    canvas: String,
    score: Number,
    winner: { type: Schema.Types.ObjectId, ref: 'player' },
    status: String,
})




const Game = mongoose.model('Game', GameSchema)
module.exports = Game
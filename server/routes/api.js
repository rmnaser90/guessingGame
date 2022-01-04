const express = require('express')
const router = express.Router()
const axios = require('axios')

const Player = require('../models/Player')
const Game = require('../models/Game')
const Word = require('../models/Word')

const getWords = async function () {
    const words = await axios.get('https://random-word-api.herokuapp.com/word?number=1000&swear=1')
    for (let i = 0; i < words.data.length; i++) {
        const word = new Word({
            word: words.data[i],
            level: i < 300 ? 'easy' : i < 600 ? 'medium' : 'hard'
        })
        const dbRes = await word.save()
    }
}

router.post('/newPlayer', async function (req, res) {
    req.body.inGame = false
    const player = new Player(req.body)
    const dbRes = await player.save()
    res.send(dbRes)
})

router.post('/signIn', async function (req, res) {
    const { id } = req.body
    const player = await Player.findById(id)
    res.send(player)
})

router.post('/newGame', async function (req, res) {
    const { id, public } = req.body
    const player = await Player.findById(id)
    if (player.inGame) {
        res.send({ error: true, msg: 'Player is already in game' })
        return
    }
    const pin = Math.floor(Math.random() * 1000000)
    const game = new Game({
        public,
        pin,
        player1: id,
        drawingPlayer: id,
        score: 0,
        status: 'waiting'
    })
    player.game = game
    player.inGame = true
    player.save()
    const dbRes = await game.save()
    res.send(dbRes)
})

router.put('/joinGame', async function (req, res) {
    const { id, pin } = req.body
    const player = await Player.findById(id)
    if (player.inGame) {
        res.send({ error: true, msg: 'Player is already in game' })
        return
    }
    const game = await Game.findOne({ pin, status: "waiting" }).populate('player2').exec()
    if (game == null) {
        res.send({ error: true, msg: 'wrong pin' })
        return
    }

    player.inGame = true
    player.game = game
    game.player2 = player
    game.guessingPlayer = player
    game.status = 'playing'
    const gameRes = await game.save()
    const playerRes = await player.save()
    res.send({ game: gameRes, error: false, msg: 'You have joined the game with ' + game.player1.name })
})

router.put('/pickWord', async function (req, res) {
    const { id, gameId, level } = req.body
    const game = await Game.findById(gameId)
    if (game.drawingPlayer != id) {
        res.send({ error: true, msg: "It's not your turn to draw" })
        return
    }
    if (game.status === "waiting") {
        res.send({ error: true, msg: "wait for a player to join" })
        return
    }
    const words = await Word.find({ level })
    const randomNum = Math.floor(Math.random() * words.length)
    game.currentWord = words[randomNum]
    game.finishedDrawing = false
    const dbRes = await game.save()
    res.send(game)

})


module.exports = router

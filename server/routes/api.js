const express = require("express");
const router = express.Router();
const axios = require("axios");

const Player = require("../models/Player");
const Game = require("../models/Game");
const Word = require("../models/Word");
const { populate } = require("../models/Player");

const getWords = async function () {
  const words = await axios.get(
    "https://random-word-api.herokuapp.com/word?number=1000&swear=1"
  );
  for (let i = 0; i < words.data.length; i++) {
    const word = new Word({
      word: words.data[i],
      level: i < 300 ? "easy" : i < 600 ? "medium" : "hard",
    });
    const dbRes = await word.save();
  }
};

router.post("/newPlayer", async function (req, res) {
  req.body.inGame = false;
  const player = new Player(req.body);
  const dbRes = await player.save();
  res.send(dbRes);
});

router.post("/signIn", async function (req, res) {
  const { id } = req.body;
  const player = await Player.findById(id);
  res.send(player);
});

router.post("/newGame", async function (req, res) {
  const { id, public: isPublic } = req.body;
  const player = await Player.findById(id);
  if (player.inGame) {
    res.send({ error: true, msg: "Player is already in game" });
    return;
  }
  const pin = Math.floor(Math.random() * 1000000);
  const game = new Game({
    isPublic,
    pin,
    player1: id,
    drawingPlayer: id,
    score: 0,
    status: "waiting",
    currentWord: { word: "", level: "" },
    finishedDrawing: false,
    finishedGuessing: true,
  });
  player.game = game;
  player.inGame = true;
  await player.save();
  const dbRes = await game.save();
  const gameState = {
    pin: dbRes.pin,
    gameId: dbRes.id,
    page: "waiting",
    isDrawing: false,
    isGuessing: false,
    team: { player1: player.name, player2: "Waiting for Player" },
  };
  res.send({ gameState });
});

router.put("/joinGame", async function (req, res) {
  const { id, pin } = req.body;
  const player = await Player.findById(id);
  if (player.inGame) {
    res.send({ error: true, msg: "Player is already in game" });
    return;
  }
  const game = await Game.findOne({ pin, status: "waiting" })
    .populate("player2 player1")
    .exec();
  if (game == null) {
    res.send({ error: true, msg: "wrong pin" });
    return;
  }

  player.inGame = true;
  player.game = game;
  game.player2 = player;
  game.guessingPlayer = player;
  game.status = "playing";
  const gameRes = await game.save();
  const playerRes = await player.save();
  const gameState = {
    pin: gameRes.pin,
    gameId: gameRes.id,
    page: "canvas",
    isDrawing: false,
    isGuessing: false,
    finishedDrawing: false,
    team: { player1: game.player1.name, player2: player.name },
  };
  res.send({
    gameState,
    error: false,
    msg: "You have joined the game with " + game.player1.name,
  });
});

router.put("/pickWord", async function (req, res) {
  const { id, gameId, level } = req.body;
  const game = await Game.findById(gameId).populate("player1 player2").exec();
  if (game.drawingPlayer != id && !game.finishedGuessing) {
    res.send({ error: true, msg: "It's not your turn to draw" });
    return;
  }
  if (game.status === "waiting") {
    res.send({ error: true, msg: "wait for a player to join" });
    return;
  }
  const words = await Word.find({ level });
  const randomNum = Math.floor(Math.random() * words.length);
  game.currentWord = words[randomNum];
  game.finishedDrawing = false;
  await game.save();
  const gameState = {
    gameId: game.id,
    pin: game.pin,
    page: "canvas",
    isDrawing: true,
    isGuessing: false,
    score: game.score,
    word: game.currentWord,
    team: { player1: game.player1.name, player2: game.player2.name },
  };
  res.send({ gameState });
});

router.put("/sendDrawing", async function (req, res) {
  const { id, gameId, canvas } = req.body;
  const game = await Game.findById(gameId).populate("player1 player2").exec();
  if (game.drawingPlayer != id && !game.finishedGuessing) {
    res.send({ error: true, msg: "it's not your turn to draw" });
    return;
  }
  const isDrawing = false;
  const isGuessing = false;
  game.finishedDrawing = true;
  game.finishedGuessing = false;
  game.canvas = canvas;
  const dbRes = await game.save();

  const gameState = {
    isDrawing,
    isGuessing,
    gameId: game.id,
    pin: game.pin,
    page: "canvas",
    canvas: game.canvas,
    score: game.score,
    word: game.currentWord,
    team: { player1: game.player1.name, player2: game.player2.name },
  };
  res.send({ gameState });
});

router.put("/guessWord", async function (req, res) {
  const { id, gameId, word } = req.body;
  const game = await Game.findById(gameId).populate("player1 player2").exec();
  const { level } = game.currentWord;
  if (game.guessingPlayer != id && !game.finishedDrawing) {
    res.send({ error: true, msg: "not your turn to guess" });
    return;
  }
  if (word.toLowerCase() != game.currentWord.word.toLowerCase()) {
    res.send({ error: true, msg: "Wrong Guess! try again" });
    return;
  }
  const points = level == "easy" ? 1 : level == "medium" ? 2 : 3;
  const isDrawing = false;
  const isGuessing = false;
  game.guessingPlayer = game.drawingPlayer;
  game.drawingPlayer = id;
  game.score += points;
  game.currentWord = { word: "", level: "" };
  game.finishedDrawing = false;
  game.finishedGuessing = true;
  await game.save();

  const gameState = {
    gameId: game.id,
    pin: game.pin,
    page: "pickWord",
    isDrawing,
    isGuessing,
    canvas: game.canvas,
    score: game.score,
    team: { player1: game.player1.name, player2: game.player2.name },
  };
  res.send({ gameState });
});
router.put("/gameOver", async function (req, res) {
  const { id, gameId } = req.body;
  const game = await Game.findById(gameId);
  const player1 = await Player.findById(game.player1);
  const player2 = await Player.findById(game.player2);
  player1.inGame = false;
if(player2!=null){
  player2.inGame = false;
  await player2.save();
}

  game.status = "finished";
  await game.save();
  await player1.save();

  res.send({ error: true, msg: "Score: " + game.score });
});

router.post("/gameState", async function (req, res) {
  const { id, gameId } = req.body;
  const game = await Game.findById(gameId).populate("player1 player2").exec();
  const player1 = game.player1.name;
  const player2 = game.player2 ? game.player2.name : "waiting for player";
  const player = await Player.findById(id);
  const isDrawing =
    game.drawingPlayer == id &&
    game.status == "playing" &&
    game.finishedGuessing &&
    game.currentWord.level !== ""
      ? true
      : false;

  const isGuessing =
    game.guessingPlayer == id &&
    game.status == "playing" &&
    game.finishedDrawing
      ? true
      : false;

  const isPicking =
    game.drawingPlayer == id &&
    !isDrawing &&
    !isGuessing &&
    !game.finishedDrawing;
  let page = "";
  switch (true) {
    case game.status == "waiting":
      page = "waiting";
      break;
    case !player.inGame:
      page = "welcome";
      break;
    case isPicking:
      page = "pickWord";
      break;
    default:
      page = "canvas";
      break;
  }
  const gameState = {
    gameId: game.id,
    pin: game.pin,
    page,
    isDrawing,
    isGuessing,
    word: isDrawing ? game.currentWord : "",
    canvas: game.canvas,
    score: game.score,
    team: { player1, player2 },
  };

  res.send({ gameState });
});

module.exports = router;

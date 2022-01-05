const axios = require("axios");
class ApiManager {
  constructor() {
    this.PATH = "http://localhost:3008/";
  }
  newPlayer = async (userName) => {
    const res = await axios.post(this.PATH + "newPlayer", { name: userName });
    return res.data;
  };

  signIn = async (id) => {
    const res = await axios.post(this.PATH + "signIn", {
      id,
    });
    return res.data;
  };
  newGame = async ({ id, isPublic }) => {
    const res = await axios.post(this.PATH + "newGame", { id, isPublic });
    return res.data;
  };
  joinGame = async ({ id, pin }) => {
    const res = await axios.put(this.PATH + "joinGame", { id, pin });
    return res.data;
  };
  pickWord = async ({ id, gameId, level }) => {
    const res = await axios.put(this.PATH + "pickWord", { id, gameId, level });
    return res.data;
  };
  sendDrawing = async ({ id, gameId, canvas }) => {
    const res = await axios.put(this.PATH + "sendDrawing", {
      id,
      gameId,
      canvas,
    });
    return res.data;
  };

  guessWord = async ({ id, gameId, word }) => {
    const res = await axios.put(this.PATH + "guessWord", { id, gameId, word });
    return res.data;
  };
  gameOver = async ({ id, gameId }) => {
    const res = await axios.put(this.PATH + "gameOver", { id, gameId });
    return res.data;
  };
  gameState = async ({ id, gameId }) => {
    const res = await axios.post(this.PATH + "gameState", { id, gameId });
    return res.data;
  };
}

export default ApiManager;

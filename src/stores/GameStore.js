import { observable, action, makeAutoObservable, runInAction } from "mobx";
import ApiManager from "../services/ApiManager";
const apiManager = new ApiManager();

class GameStore {
  constructor() {
    this.player = { _id: "", inGame: false, game: "" };
    this.gameState = { page: "newPlayer" };
    this.inputs = {
      newPlayerName: "",
      canvasInput: "",
      level: "",
      word: "",
      pin: "",
    };
    this.socket = apiManager.socket;
    makeAutoObservable(this, {
      player: observable,
      gameState: observable,
      inputs: observable,
      signIn: action,
      getGameState: action,
      handleInput: action,
      joinGame: action,
      pickWord: action,
      sendDrawing: action,
      guessWord: action,
      quitgame: action
    });
  }
  handleInput = (property, value) => {
    this.inputs[property] = value;
  };
  getPlayerFromLocalStorage = () => {
    const player = localStorage.getItem("player");
    return JSON.parse(player);
  };

  newPlayer = async () => {
    const { newPlayerName } = this.inputs;
    const player = await apiManager.newPlayer(newPlayerName);
    localStorage.setItem("player", JSON.stringify(player));
    this.signIn();
  };

  signIn = async () => {
    const storedPlayer = this.getPlayerFromLocalStorage();
    if (storedPlayer == null) {
      runInAction(() => {
        this.gameState.page = "newPlayer";
      });
      return;
    }
    const { _id } = storedPlayer;
    const player = await apiManager.signIn(_id);
    if (player.error) {
      alert(player.msg);
      return;
    }
    runInAction(() => {
      this.player = player;
    });

    await this.getGameState();
  };

  getGameState = async () => {
    const { _id, game, inGame } = this.player;
    const gameId = this.gameState.gameId || game;
    console.log(gameId);
    if (inGame) {
      const gameStateRes = await apiManager.gameState({ id: _id, gameId });
      const { gameState } = gameStateRes;
      runInAction(() => {
        console.log(gameState);
        this.gameState = gameState;
      });
    } else {
      runInAction(() => {
        const storedPlayer = this.getPlayerFromLocalStorage();
        this.gameState.page = storedPlayer !== null ? "welcome" : "newPlayer";
      });
    }
  };
  newGame = async () => {
    const { _id } = this.player;
    const gameStateRes = await apiManager.newGame({ id: _id, isPublic: true });
    const { gameState } = gameStateRes;

    const updatedPlayer = await apiManager.signIn(_id);
    if (gameState.error) {
      alert(gameState.msg);
      return;
    }
    runInAction(() => {
      this.player = updatedPlayer;
      this.gameState = gameState;
    });
  };
  joinGame = async () => {
    const { _id: id } = this.player;
    const { pin } = this.inputs;
    const gameStateRes = await apiManager.joinGame({ id, pin });
    const { error, msg, gameState } = gameStateRes;
    alert(msg);
    if (error) {
      return;
    }
    const updatedPlayer = await apiManager.signIn(id);
    runInAction(() => {
      this.gameState = gameState;
      this.player = updatedPlayer;
    });
  };
  pickWord = async (level) => {
    const { _id: id } = this.player;
    const { gameId } = this.gameState;
    const gameStateRes = await apiManager.pickWord({ id, gameId, level });
    const { error, msg, gameState } = gameStateRes;
    if (error) {
      alert(msg);
      return;
    }
    runInAction(() => {
      this.gameState = gameState;
    });
  };
  sendDrawing = async () => {
    const { canvasInput: canvas } = this.inputs;
    const { _id: id } = this.player;
    const { gameId } = this.gameState;

    const gameStateRes = await apiManager.sendDrawing({ id, gameId, canvas });
    const { error, msg, gameState } = gameStateRes;
    if (error) {
      alert(msg);
      return;
    }
    runInAction(() => {
      this.gameState = gameState;
    });
  };
  guessWord = async () => {
    const { word } = this.inputs;
    const { _id: id } = this.player;
    const { gameId } = this.gameState;

    const gameStateRes = await apiManager.guessWord({ id, gameId, word });
    const { error, msg, gameState } = gameStateRes;
    if (error) {
      alert(msg);
      return;
    }
    runInAction(() => {
      this.gameState = gameState;
    });
  };
  quitGame = async () => {
    const { _id: id } = this.player;
    const { gameId } = this.gameState;
    await apiManager.gameOver({ id, gameId });

  };
}
export default GameStore;

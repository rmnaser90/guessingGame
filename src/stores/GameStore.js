import { observable, action, makeAutoObservable, runInAction } from "mobx";
import ApiManager from "../services/ApiManager";
const apiManager = new ApiManager();

class GameStore {
  constructor() {
    this.player = { _id: "", inGame: false, game: "" };
    this.gameState = { page: "newPlayer" };
    this.inputs = { newPlayerName: "", canvas: "", level: "", word: "" };
    makeAutoObservable(this, {
      player: observable,
      gameState: observable,
      inputs: observable,
      signIn: action,
      getGameState: action,
      handleInput: action,
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
        console.log('im there');
      this.player = player;
    });

    await this.getGameState();
  };

  getGameState = async () => {
    const { _id, game, inGame } = this.player;
    const gameId = this.gameState.gameId || game;

    if (inGame) {
      const gameStateRes = await apiManager.gameState({ id:_id, gameId });
      const {gameState} = gameStateRes
      runInAction(() => {
        this.gameState = gameState;
      });
    } else {
      runInAction(() => {
        this.gameState.page = "welcome";
      });
    }
  };
  newGame = async () => {
    const { _id } = this.player;
    const {gameStateRes} = await apiManager.newGame({ id:_id, isPublic: true });
    const {gameState} = gameStateRes

    const updatedPlayer = await apiManager.signIn(_id)
    if (gameState.error) {
        alert(gameState.msg)
        return
    }
    runInAction(()=>{
        this.player = updatedPlayer
        this.gameState = gameState
    })
  };
}
export default GameStore;

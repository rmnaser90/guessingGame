import React, { useEffect } from "react";
import Navigator from "./Components/Navigator";
import { Provider } from "mobx-react";
import GameStore from "./stores/GameStore";

const gameStore = new GameStore();
const stores = { gameStore };
function App() {
const {signIn,socket,getGameState} = gameStore

  useEffect(() => {
    signIn()
    socket.on('update', function () {
      getGameState()
      })
  }, [])
  return (
    <Provider {...stores}>
      <button onClick={getGameState}>refresh</button>
      <Navigator />
    </Provider>
  );
}

export default App;
 
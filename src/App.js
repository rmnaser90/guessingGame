import React, { useEffect } from "react";
import Navigator from "./Components/Navigator";
import { Provider } from "mobx-react";
import GameStore from "./stores/GameStore";

const gameStore = new GameStore();
const stores = { gameStore };
function App() {
const {signIn} = gameStore
  useEffect(() => {
    signIn()
  }, [])
  return (
    <Provider {...stores}>
      <Navigator />
    </Provider>
  );
}

export default App;

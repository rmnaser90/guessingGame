import React, { useEffect } from "react";
import Navigator from "./Components/Navigator";
import { Provider } from "mobx-react";
import GameStore from "./stores/GameStore";
import './App.css'
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

  const logOut = ()=>{
    localStorage.clear()
    signIn()
  }
  return (
    <Provider {...stores}>
      <Navigator />
    </Provider>
  );
}

export default App;
 
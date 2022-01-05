import React from "react";
import { inject, observer } from "mobx-react";
import NewPlayer from "./Screens/NewPlayer";
import Welcome from "./Screens/Welcome";
import Waiting from "./Screens/Waiting";
import DrawingScreen from "./Screens/DrawingScreen";
import PickWord from "./Screens/PickWord";

const Navigator = inject("gameStore")(
  observer(({ gameStore }) => {
    const { page } = gameStore.gameState;

    switch (page) {
      case 'newPLayer':
          return <NewPlayer/>
      case 'welcome':
          return <Welcome/>
      case 'waiting':
          return <Waiting/>
      case 'canvas':
          return <DrawingScreen/>
      case 'pickWord':
          return <PickWord/>

      default:
        return <NewPlayer/>
    }
  })
);

export default Navigator;

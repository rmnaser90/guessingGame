import React from "react";
import CanvasDrawComponent from "../SubComponents/CanvasDrawComponent";
import { inject, observer } from "mobx-react";

const DrawingScreen = inject("gameStore")(
  observer(({ gameStore }) => {
    return (
      <div>
        <h1>drawing screen</h1>
        <CanvasDrawComponent />
      </div>
    );
  })
);

export default DrawingScreen;

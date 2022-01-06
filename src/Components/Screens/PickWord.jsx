import React from "react";
import { inject, observer } from "mobx-react";

const PickWord = inject("gameStore")(
  observer(({ gameStore }) => {
    const {pickWord} = gameStore
    return (
      <div>
        <h1>Choose level</h1>
        <button onClick={()=>pickWord('easy')}>Easy</button>
        <button onClick={()=>pickWord('medium')}>Medium</button>
        <button onClick={()=>pickWord('hard')}>Hard</button>
      </div>
    );
  })
);
export default PickWord;

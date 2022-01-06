import React from "react";
import { inject, observer } from "mobx-react";

const PickWord = inject("gameStore")(
  observer(({ gameStore }) => {
    const { pickWord } = gameStore;
    return (
      <div className="screen pickWordScreen">
        <div className="header">
          <h1 className="title larger yellow">
            Choose <br />
            <span className="sec crimson" id="crimson"> your Level</span>{" "}
          </h1>
        </div>
        <div className="subContainer">
        <div className="btn easy" onClick={() => pickWord("easy")}>Easy</div>
        <div className="btn medium" onClick={() => pickWord("medium")}>Medium</div>
        <div className="btn hard" onClick={() => pickWord("hard")}>Hard</div>
        </div>
      </div>
    );
  })
);
export default PickWord;

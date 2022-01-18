import React, { useRef } from "react";
import CanvasDraw from "react-canvas-draw";
import { inject, observer } from "mobx-react";

const DrawingScreen = inject("gameStore")(
  observer(({ gameStore }) => {
    let canvasRef = useRef(null);
    const { handleInput, inputs, gameState, sendDrawing, guessWord, quitGame } =
      gameStore;
    const { isDrawing, isGuessing, word, canvas, team, score } = gameState;
    const { word: wordInput } = inputs;
    const handleCanvasChange = () => {
      const value = canvasRef.current.getSaveData();
      handleInput("canvasInput", value);
    };
    const handleWordInput = ({ target }) => {
      const { value } = target;
      handleInput("word", value);
    };
    const guessBtn = async () => {
      await guessWord();
      handleInput("word", "");
    };
    const player1Name = team.player1.split(" ")[0];
    const player2Name = team.player2.split(" ")[0];

    return (
      <div className="screen drawingScreen">
        <div className="appBar">
          <div className="playerName">
            Player 1 <br />
            <span>{player1Name}</span>{" "}
          </div>
          <div className="score">
            Score <br />
            <span>{score}</span>
          </div>
          <div className="playerName">
            Player 2 <br />
            <span>{player2Name}</span>
          </div>
        </div>
        {isDrawing ? (
          <CanvasDraw
            ref={canvasRef}
            onChange={handleCanvasChange}
            canvasHeight={window.innerHeight * 0.7}
            canvasWidth={window.innerWidth}
            brushRadius={3}
            lazyRadius={2}
          />
        ) : (
          <CanvasDraw
            ref={canvasRef}
            disabled={true}
            saveData={canvas}
            loadTimeOffset={10}
            onChange={handleCanvasChange}
            canvasHeight={window.innerHeight * 0.7}
            canvasWidth={window.innerWidth}
          />
        )}
        {!isDrawing && !isGuessing ? (
          <div className="waitForPlayer"> Wait for your Turn!! </div>
        ) : null}

        {isDrawing ? (
          <div className="canvasSubContainer">
            <div className="currentWord">{word.word}</div>
            <div onClick={sendDrawing} className="checkBtn">
              ✔
            </div>
          </div>
        ) : null}

        {isGuessing ? (
          <div className="canvasSubContainer">
            <input
              type="text"
              placeholder={"What's your Guess"}
              className="guessInput"
              onChange={handleWordInput}
              value={wordInput}
            />
            <div className="checkBtn" onClick={guessBtn}>
              ✔
            </div>
          </div>
        ) : null}
        <div className="btn quitBtn" onClick={quitGame}>
          Quit
        </div>
      </div>
    );
  })
);
export default DrawingScreen;

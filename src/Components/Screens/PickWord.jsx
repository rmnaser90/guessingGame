import React from "react";
import { inject, observer } from "mobx-react";

const PickWord = inject("gameStore")(
  observer(({ gameStore }) => {
    return (
      <div>
        <h1>pick word</h1>
      </div>
    );
  })
);
export default PickWord;

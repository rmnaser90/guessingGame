import React from "react";
import { inject, observer } from "mobx-react";

const Waiting = inject("gameStore")(
  observer(({ gameStore }) => {
    return (
      <div>
        <h1>waiting</h1>
      </div>
    );
  })
);

export default Waiting;

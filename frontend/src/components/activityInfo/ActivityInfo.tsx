import React, { useState } from "react";
import SessionInfo from "./SessionInfo";
import { Button } from "@mui/material";

const ActivityInfo = () => {
  const [addSession, setAddNewSession] = useState([<SessionInfo key={1} />]);
  return (
    <div>
      {addSession.map((item) => {
        return (
          <div key={item.key}>
            Session {item.key}
            {item}
          </div>
        );
      })}

      <Button
        onClick={() => {
          setAddNewSession([
            ...addSession,
            <SessionInfo key={addSession.length + 1} />,
          ]);
        }}
      >
        Add Session
      </Button>
    </div>
  );
};

export default ActivityInfo;

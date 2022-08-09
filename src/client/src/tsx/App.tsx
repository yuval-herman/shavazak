import React, { useEffect, useRef, useState } from "react";

import style from "./App.module.scss";
import { PropsBasicWithKey } from "./components/baseComponentsTypes";
import List from "./components/List";
import { TimeTable } from "./interface";

function App() {
  const firstRender = useRef(true);
  const [state, setState] = useState<TimeTable[]>([]);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      fetch("/randomtable")
        .then((res) => res.json().then(setState))
        .catch(console.log);
    }
  }, []);

  function LI<T extends PropsBasicWithKey>(el: TimeTable) {
    return (
      <li key={el.person.id}>
        {" "}
        {new Date(el.date * 1000).toLocaleTimeString()}
      </li>
    );
  }

  return (
    <div className={style.app}>
      <List
        dataArray={state.map((el) => ({ key: `${el.person.id}`, ...el }))}
        LI={LI}
      ></List>
    </div>
  );
}

export default App;

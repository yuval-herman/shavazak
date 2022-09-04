import { ChangeEventHandler, useState, SyntheticEvent } from "react";
import style from "./MultiInput.module.scss";

function MultiInput(props: {
  name: string | string[];
  change: ChangeEventHandler<HTMLInputElement>;
  columns?: number;
  values: string[][];
}) {
  const [inputsNumber, setInputsNumber] = useState<number>(1);

  function addInput(event: SyntheticEvent) {
    event.preventDefault();
    setInputsNumber((num) => num + 1);
  }

  const inputs = [];
  for (let i = 0; i < inputsNumber; i++) {
    const row = [];
    for (let j = 0; j < (props.columns ?? 1); j++) {
      let name;
      if (Array.isArray(props.name)) {
        name = props.name[j];
      } else {
        name = props.name;
      }
      row.push(
        <input
          key={(j + 1) * (i + 1)}
          name={name}
          input-num={i}
          value={(props.values[i] ?? [])[j] ?? ""}
          onChange={props.change}
        />
      );
    }
    inputs.push(<div key={i}>{row}</div>);
  }

  return (
    <span className={style.main}>
      <span>{inputs}</span>
      <button onClick={addInput}>+</button>
    </span>
  );
}

export default MultiInput;

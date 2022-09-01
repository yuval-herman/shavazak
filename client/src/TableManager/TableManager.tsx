import {
  ChangeEvent,
  ChangeEventHandler,
  SyntheticEvent,
  useState,
} from "react";
import { savePerson, saveTask } from "../api";
import { formDataToObj } from "../helpers";
import { Person, Task } from "../types";
import uniqId from "uniqid";

function MultiInput(props: {
  name: string | string[];
  change: ChangeEventHandler<HTMLInputElement>;
  columns?: number;
}) {
  const [inputsNumber, setInputsNumber] = useState<number>(1);

  function addInput(event: SyntheticEvent) {
    event.preventDefault()
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
          input-num={(j + 1) * (i + 1) - 1}
          onChange={(event) => props.change(event)}
        />
      );
    }
    inputs.push(<div key={i}>{row}</div>);
  }

  return (
    <>
      <span>{inputs}</span>
      <button onClick={addInput}>+</button>
    </>
  );
}

function AddPerson() {
  const [inputs, setInputs] = useState({
    id: uniqId(),
    name: "",
    roles: [""],
    score: 0,
    status: "",
    avatar: ""
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const inputName = event.target.attributes[0].value;
    if (inputName === "roles") {
      const index = parseInt(event.target.getAttribute("input-num")!);
      const prevRoles = [...inputs.roles];
      prevRoles[index] = event.target.value;
      setInputs({ ...inputs, roles: prevRoles });
    } else if (inputName === "score"){
      setInputs({ ...inputs, score: parseInt(event.target.value) });
    } else {
      setInputs({ ...inputs, [inputName]: event.target.value });
    }
  }

  function submitHandler(event: SyntheticEvent) {
    event.preventDefault();
    savePerson(inputs);
  }

  return (
    <form onSubmit={submitHandler}>
      <label>
        id{" "}
        <input
          onChange={handleChange}
          name="id"
          value={inputs.id}
          disabled
        />
      </label>
      <label>
        name{" "}
        <input
          value={inputs.name}
          onChange={handleChange}
          name="name"
        />
      </label>
      <label>
        roles <MultiInput change={handleChange} name="roles" />
      </label>
      <label>
        score{" "}
        <input
          onChange={handleChange}
          name="score"
          type={"number"} //TODO: allow only numbers
        />
      </label>
      <label>
        status <input onChange={handleChange} name="status" />
      </label>
      <label>
        avatar <input onChange={handleChange} name="avatar" />
      </label>
      <input type="submit" value="add" />
    </form>
  );
}

function AddTask() {
  function submitHandler(event: SyntheticEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    saveTask(formDataToObj(formData) as unknown as Task);
  }

  return (
    <form onSubmit={submitHandler}>
      <label>
        id <input name="id" value={uniqId()} disabled />
      </label>
      <label>
        name <input name="name" />
      </label>
      <label>
        required people per shift{" "}
        {/* <MultiInput
					name={[
						"required_people_per_shift/amount",
						"required_people_per_shift/role",
					]}
					columns={2} change={(event)=>handleChange(event)}
				/> */}
      </label>
      <label>
        score <input name="score" type={"number"} />
      </label>
      <label>
        shift duration <input name="shift_duration" type={"number"} />
      </label>
      <label>
        shifts <input name="shifts" value={[]} disabled />
        {/* TODO: special component */}
      </label>
      <input type="submit" value="add" />
    </form>
  );
}

function TableManager() {
  return (
    <div>
      <AddPerson />
      <AddTask />
    </div>
  );
}

export default TableManager;

import { useState, ChangeEvent, SyntheticEvent } from "react";
import { savePerson } from "../../api";
import { Person } from "../../types";
import MultiInput from "../MultiInput/MultiInput";
import uniqId from "uniqid";
import style from "./AddPerson.module.scss";

export function AddPerson() {
  const [inputs, setInputs] = useState<Person>({
    id: uniqId(),
    name: "",
    roles: [""],
    score: 0,
    status: "",
    avatar: "",
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const inputName = event.target.getAttribute("name")!;
    if (inputName === "roles") {
      const index = parseInt(event.target.getAttribute("input-num")!);
      const prevRoles = [...inputs.roles];
      prevRoles[index] = event.target.value;
      setInputs({ ...inputs, roles: prevRoles });
    } else if (inputName === "score") {
      setInputs({ ...inputs, score: parseInt(event.target.value) });
    } else {
      setInputs({ ...inputs, [inputName]: event.target.value });
    }
  }

  function submitHandler(event: SyntheticEvent) {
    event.preventDefault();
    savePerson(inputs);
    setInputs({
      ...inputs,
      name: "",
      roles: [""],
      score: 0,
      status: "",
      avatar: "",
    });
  }

  return (
    <form onSubmit={submitHandler} className={style.main}>
      <div className={style.inputs}>
        <label>
          id <input onChange={handleChange} name="id" value={inputs.id} disabled />
        </label>
        <label>
          name <input value={inputs.name} onChange={handleChange} name="name" />
        </label>
        <label>
          roles{" "}
          <MultiInput
            values={inputs.roles.map((item) => [item])}
            change={handleChange}
            name="roles"
          />
        </label>
        <label>
          score <input onChange={handleChange} value={inputs.score} name="score" type={"number"} />
        </label>
        <label>
          status <input onChange={handleChange} value={inputs.status} name="status" />
        </label>
        <label>
          avatar <input onChange={handleChange} value={inputs.avatar} name="avatar" />
        </label>
      </div>
      <input type="submit" value="add" />
    </form>
  );
}

export default AddPerson;

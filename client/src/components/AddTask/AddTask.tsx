import { useState, SyntheticEvent, ChangeEvent } from "react";
import { saveTask } from "../../api";
import { Task } from "../../types";
import MultiInput from "../MultiInput/MultiInput";
import uniqId from "uniqid";

export function AddTask() {
  const [inputs, setInputs] = useState<Task>({
    id: uniqId(),
    name: "",
    required_people_per_shift: [{ amount: 0, role: "" }],
    score: 0,
    shift_duration: 0,
    shifts: [],
  });
  function submitHandler(event: SyntheticEvent) {
    event.preventDefault();
    saveTask(inputs);
    setInputs({
      ...inputs,
      name: "",
      required_people_per_shift: [{ amount: 0, role: "" }],
      score: 0,
      shift_duration: 0,
      shifts: [],
    });
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const inputName = event.target.getAttribute("name")!;
    if (inputName === "amount" || inputName === "role") {
      const index = parseInt(event.target.getAttribute("input-num")!);
      const prevArr = [...inputs.required_people_per_shift];
      prevArr[index] = {
        ...prevArr[index],
        [inputName]: inputName === "amount" ? parseInt(event.target.value) : event.target.value,
      };
      setInputs({ ...inputs, required_people_per_shift: prevArr });
    } else if (inputName === "shift_duration") {
      setInputs({ ...inputs, [inputName]: parseInt(event.target.value) });
    } else if (inputName === "score") {
      setInputs({ ...inputs, [inputName]: parseInt(event.target.value) });
    } else {
      setInputs({ ...inputs, [inputName]: event.target.value });
    }
  }

  return (
    <form onSubmit={submitHandler}>
      <label>
        id <input name="id" value={inputs.id} onChange={handleChange} disabled />
      </label>
      <label>
        name <input name="name" value={inputs.name} onChange={handleChange} />
      </label>
      <label>
        required people per shift{" "}
        <MultiInput
          name={["amount", "role"]}
          columns={2}
          change={handleChange}
          values={inputs.required_people_per_shift.map((item) => [
            item.amount.toString(),
            item.role,
          ])}
        />
      </label>
      <label>
        score <input name="score" value={inputs.score} onChange={handleChange} type={"number"} />
      </label>
      <label>
        shift duration{" "}
        <input
          name="shift_duration"
          value={inputs.shift_duration}
          onChange={handleChange}
          type={"number"}
        />
      </label>
      <input type="submit" value="add" />
    </form>
  );
}

export default AddTask;

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

	function addInput() {
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
		inputs.push(<div>{row}</div>);
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
		name: "",
		roles: [""],
		score: "",
		status: "",
	});

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const inputName = event.target.attributes[0].value;
		if (inputName === "name")
			setInputs({ ...inputs, name: event.target.value });
		if (inputName === "score")
			setInputs({ ...inputs, score: event.target.value });
		if (inputName === "status")
			setInputs({ ...inputs, status: event.target.value });
		if (inputName === "roles") {
			const prevRoles = [...inputs.roles];
			const index = parseInt(event.target.getAttribute("input-num")!);
			prevRoles[index] = event.target.value;
			setInputs({ ...inputs, roles: prevRoles });
		}
		console.log(inputs);
	}

	function submitHandler(event: SyntheticEvent) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		savePerson(formDataToObj(formData) as unknown as Person);
	}

	return (
		<form onSubmit={submitHandler}>
			<label>
				id{" "}
				<input
					onChange={(event) => handleChange(event)}
					name="id"
					value={uniqId()}
					disabled
				/>
			</label>
			<label>
				name{" "}
				<input
					value={inputs.name}
					onChange={(event) => handleChange(event)}
					name="name"
				/>
			</label>
			<label>
				roles <MultiInput change={handleChange} name="roles" />
			</label>
			<label>
				score{" "}
				<input
					onChange={(event) => handleChange(event)}
					name="score"
					type={"number"}
				/>
			</label>
			<label>
				status{" "}
				<input onChange={(event) => handleChange(event)} name="status" />
				{/* TODO: I don't know what to do... */}
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

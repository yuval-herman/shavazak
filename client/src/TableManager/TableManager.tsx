import { SyntheticEvent, useState } from "react";
import { savePerson, saveTask } from "../api";
import { formDataToObj } from "../helpers";
import { Person, Task } from "../types";

function MultiInput(props: { name: string }) {
	const [inputsNumber, setInputsNumber] = useState<number>(1);

	function addInput() {
		setInputsNumber((num) => num + 1);
	}

	const inputs = [];
	for (let i = 0; i < inputsNumber; i++) {
		inputs.push(<input key={i} name={props.name} />);
	}

	return (
		<>
			<span>{inputs}</span>
			<button onClick={addInput}>+</button>
		</>
	);
}

function AddPerson() {
	function submitHandler(event: SyntheticEvent) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		savePerson(formDataToObj(formData) as unknown as Person);
	}

	return (
		<form onSubmit={submitHandler}>
			<label>
				id <input name="id" />
			</label>
			<label>
				name <input name="name" />
			</label>
			<label>
				roles <MultiInput name="roles" />
			</label>
			<label>
				score <input name="score" />
			</label>
			<label>
				status <input name="status" />
			</label>
			<input type="submit" value="add" />
		</form>
	);
}

function AddTask() {
	function submitHandler(event: SyntheticEvent) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		saveTask(Object.fromEntries(formData) as unknown as Task);
	}

	return (
		<form onSubmit={submitHandler}>
			<label>
				id <input name="id" />
			</label>
			<label>
				name <input name="name" />
			</label>
			<label>
				required people per shift <input name="required_people_per_shift" />
			</label>
			<label>
				score <input name="score" />
			</label>
			<label>
				shift duration <input name="shift_duration" />
			</label>
			<label>
				shifts <input name="shifts" />
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

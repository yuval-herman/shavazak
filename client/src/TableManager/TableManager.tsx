import { SyntheticEvent } from "react";
import { savePerson, saveTask } from "../api";
import { Person, Task } from "../types";

function AddPerson() {
	function submitHandler(event: SyntheticEvent) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		savePerson(Object.fromEntries(formData) as unknown as Person);
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
				roles <input name="id" />
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

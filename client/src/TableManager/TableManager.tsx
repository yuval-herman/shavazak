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
import { Link, Outlet } from "react-router-dom";
import style from "./TableManager.module.scss";

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
		<>
			<span>{inputs}</span>
			<button onClick={addInput}>+</button>
		</>
	);
}

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
				<input value={inputs.name} onChange={handleChange} name="name" />
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
				score{" "}
				<input
					onChange={handleChange}
					value={inputs.score}
					name="score"
					type={"number"}
				/>
			</label>
			<label>
				status{" "}
				<input
					onChange={handleChange}
					value={inputs.status}
					name="status"
				/>
			</label>
			<label>
				avatar{" "}
				<input
					onChange={handleChange}
					value={inputs.avatar}
					name="avatar"
				/>
			</label>
			<input type="submit" value="add" />
		</form>
	);
}

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
		const formData = new FormData(event.target as HTMLFormElement);
		saveTask(formDataToObj(formData) as unknown as Task);
	}

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const inputName = event.target.getAttribute("name")!;
		if (inputName === "amount" || inputName === "role") {
			const index = parseInt(event.target.getAttribute("input-num")!);
			const prevArr = [...inputs.required_people_per_shift];
			prevArr[index] = {
				...prevArr[index],
				[inputName]: event.target.value,
			};
			setInputs({ ...inputs, required_people_per_shift: prevArr });
		} else {
			setInputs({ ...inputs, [inputName]: event.target.value });
		}
	}

	return (
		<form onSubmit={submitHandler}>
			<label>
				id{" "}
				<input
					name="id"
					value={inputs.id}
					onChange={handleChange}
					disabled
				/>
			</label>
			<label>
				name{" "}
				<input name="name" value={inputs.name} onChange={handleChange} />
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
				score{" "}
				<input
					name="score"
					value={inputs.score}
					onChange={handleChange}
					type={"number"}
				/>
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

function TableManager() {
	return (
		<div className={style.main}>
			<nav className={style.sidebar}>
				<Link to={"/"}>home</Link>
				<Link to={"addperson"}>add person</Link>{" "}
				<Link to={"addtask"}>add task</Link>
			</nav>
			<div>
				<Outlet />
			</div>
		</div>
	);
}

export default TableManager;

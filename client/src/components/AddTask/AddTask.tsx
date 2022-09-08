import {
	useState,
	SyntheticEvent,
	ChangeEvent,
	useEffect,
	useContext,
} from "react";
import { Task } from "../../types";
import MultiInput from "../MultiInput/MultiInput";
import uniqId from "uniqid";
import { useSearchParams } from "react-router-dom";
import style from "./AddTask.module.scss";
import { TasksContext } from "../../context/TasksContext";
import { getRolesFromData } from "../../api";
import Snackbar from "../Snackbar/Snackbar";

export function AddTask() {
	const initialInputs = {
		id: uniqId(),
		name: "",
		required_people_per_shift: [{ amount: 1, role: "any" }],
		score: 0,
		shift_duration: 30,
		shifts: [],
	};
	const [searchParamas] = useSearchParams();
	const tasksContext = useContext(TasksContext);
	const [error, setError] = useState<string>();
	const [inputs, setInputs] = useState<Task>(initialInputs);
	const [snackbar, setSnackbar] = useState("");

	useEffect(() => {
		if (searchParamas.has("id")) {
			const id = searchParamas.get("id");
			const task = tasksContext.tasks.find((task) => task.id === id);
			if (!task) {
				setError("Horrible error occurred😖\ncan't find a task with that id!");
				return;
			}
			setInputs(task);
		}
	}, [searchParamas, tasksContext.tasks]);

	function submitHandler(event: SyntheticEvent) {
		event.preventDefault();
		tasksContext.add(inputs);
		setInputs(initialInputs);
		setSnackbar("Task added");
	}

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const inputName = event.target.getAttribute("name")!;
		let value: string | number = event.target.value;

		if (inputName === "amount" || inputName === "role") {
			const index = parseInt(event.target.getAttribute("input-num")!);
			const prevArr = [...inputs.required_people_per_shift];
			if (inputName === "amount") {
				value = parseInt(event.target.value);
				if (isNaN(value)) {
					value = "";
				}
			}
			prevArr[index] = {
				...prevArr[index],
				[inputName]: value,
			};
			setInputs({ ...inputs, required_people_per_shift: prevArr });
		} else if (inputName === "shift_duration") {
			value = parseInt(value);
			if (isNaN(value) || value < 5) {
				value = 5;
			}
			setInputs({ ...inputs, [inputName]: value });
		} else if (inputName === "score") {
			value = parseInt(value);
			if (isNaN(value)) {
				value = 0;
			}
			setInputs({ ...inputs, [inputName]: value });
		} else {
			setInputs({ ...inputs, [inputName]: value });
		}
	}
	if (error) {
		return <div>{error}</div>;
	}
	return (
		<form onSubmit={submitHandler} className={style.main}>
			<label>
				id{" "}
				<input name="id" value={inputs.id} onChange={handleChange} disabled />
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
					options={getRolesFromData(undefined, tasksContext.tasks)}
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
			<Snackbar value={snackbar} />
		</form>
	);
}

export default AddTask;

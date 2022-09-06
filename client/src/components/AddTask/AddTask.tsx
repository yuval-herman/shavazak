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

export function AddTask() {
	const [searchParamas] = useSearchParams();
	const tasksContext = useContext(TasksContext);
	const [error, setError] = useState<string>();
	const [inputs, setInputs] = useState<Task>({
		id: uniqId(),
		name: "",
		required_people_per_shift: [{ amount: 0, role: "" }],
		score: 0,
		shift_duration: 0,
		shifts: [],
	});

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
				[inputName]:
					inputName === "amount"
						? parseInt(event.target.value)
						: event.target.value,
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
		</form>
	);
}

export default AddTask;

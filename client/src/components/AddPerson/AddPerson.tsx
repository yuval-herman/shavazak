import {
	useState,
	ChangeEvent,
	SyntheticEvent,
	useEffect,
	useContext,
} from "react";
import { Person } from "../../types";
import MultiInput from "../MultiInput/MultiInput";
import uniqId from "uniqid";
import style from "./AddPerson.module.scss";
import { useSearchParams } from "react-router-dom";
import { PeopleContext } from "../../context/PeopleContext";
import { getRolesFromData } from "../../api";
import Snackbar from "../Snackbar/Snackbar";

export function AddPerson() {
	const initialInputs = {
		id: uniqId(),
		name: "",
		roles: [""],
		score: 0,
		status: "",
	};
	const [searchParamas] = useSearchParams();
	const peopleContext = useContext(PeopleContext);
	const [error, setError] = useState<string>();
	const [inputs, setInputs] = useState<Person>(initialInputs);
	const [snackbar, setSnackbar] = useState("");

	useEffect(() => {
		if (searchParamas.has("id")) {
			const id = searchParamas.get("id");
			const person = peopleContext.people.find((person) => person.id === id);
			if (!person) {
				setError(
					"Horrible error occurred😖\ncan't find a person with that id!"
				);
				return;
			}
			setInputs(person);
		}
	}, [searchParamas, peopleContext.people]);

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const inputName = event.target.getAttribute("name")!;
		if (inputName === "roles") {
			const index = parseInt(event.target.getAttribute("input-num")!);
			const prevRoles = [...inputs.roles];
			prevRoles[index] = event.target.value;
			setInputs({ ...inputs, roles: prevRoles });
		} else if (inputName === "score (0-10)") {
			setInputs({ ...inputs, score: parseInt(event.target.value) / 10 });
		} else {
			setInputs({ ...inputs, [inputName]: event.target.value });
		}
	}

	function submitHandler(event: SyntheticEvent) {
		event.preventDefault();
		peopleContext.add(inputs);
		setInputs(initialInputs);
		setSnackbar("Person added");
	}
	if (error) {
		return <div>{error}</div>;
	}
	return (
		<form onSubmit={submitHandler} className={style.main}>
			<label>
				name <input value={inputs.name} onChange={handleChange} name="name" />
			</label>
			<label>
				roles{" "}
				<MultiInput
					values={inputs.roles.map((item) => [item])}
					change={handleChange}
					name="roles"
					options={getRolesFromData(peopleContext.people)}
				/>
			</label>
			<label>
				score{" "}
				<input
					onChange={handleChange}
					value={Math.floor(inputs.score * 10)}
					name="score"
					type={"number"}
					min={0}
					max={10}
				/>
			</label>
			<label>
				status{" "}
				<input onChange={handleChange} value={inputs.status} name="status" />
			</label>
			<input type="submit" value="add" />
			<Snackbar value={snackbar} />
		</form>
	);
}

export default AddPerson;

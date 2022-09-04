import { useState, ChangeEvent, SyntheticEvent, useEffect } from "react";
import { getPeople, savePerson } from "../../api";
import { Person } from "../../types";
import MultiInput from "../MultiInput/MultiInput";
import uniqId from "uniqid";
import style from "./AddPerson.module.scss";
import { useSearchParams } from "react-router-dom";

export function AddPerson() {
	const [searchParamas] = useSearchParams();
	const [error, setError] = useState<string>();
	const [inputs, setInputs] = useState<Person>({
		id: uniqId(),
		name: "",
		roles: [""],
		score: 0,
		status: "",
		avatar: "",
	});

	useEffect(() => {
		if (searchParamas.has("id")) {
			const id = searchParamas.get("id");
			const person = getPeople().find((person) => person.id === id);
			if (!person) {
				setError(
					"Horrible error occurred😖\ncan't find a person with that id!"
				);
				return;
			}
			setInputs(person);
		}
	}, []);

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
	if (error) {
		return <div>{error}</div>;
	}
	return (
		<form onSubmit={submitHandler} className={style.main}>
			<div className={style.inputs}>
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
			</div>
			<input type="submit" value="add" />
		</form>
	);
}

export default AddPerson;

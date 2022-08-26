import { Person, Task } from "../../interface";

interface PersonProps {
	person: Person;
}

interface TaskProps {
	task: Task;
}

type Props = PersonProps | TaskProps;

export function DataElement(props: Props) {
	if ("person" in props) {
		const person = props.person;
		return (
			<div>
				<h3>{person.name}</h3>
				<p>
					<strong>state</strong>: {person.status}
				</p>
				<p>
					<strong>score</strong>: {person.score}
				</p>
				<p>
					<strong>roles</strong>: {person.roles.join(", ")}
				</p>
			</div>
		);
	}
	const task = props.task;
	return (
		<div>
			<h3>{task.name}</h3>
			<p>
				<strong>score</strong>: {task.score}
			</p>
			<p>
				<strong>shift duration</strong>: {task.shift_duration}
			</p>
			<p>
				<strong>task people requirements</strong>:{" "}
				<table>
					<tr>
						<td>role</td>
						<td>amount</td>
					</tr>
					{task.required_people_per_shift.map(({ amount, role }) => (
						<tr>
							<td>{role}</td>
							<td>{amount}</td>
						</tr>
					))}
				</table>
			</p>
		</div>
	);
}

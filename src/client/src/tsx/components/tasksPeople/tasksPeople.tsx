import { ReactPropTypes, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Person, Task } from "../../interface";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { tasksState } from "../../state/slices/tasksSlice";
import { DataElement } from "../dataElement/dataElement";
import style from "./tasksPeople.module.scss";

interface Props {
	data: Person | Task;
}

function DataWithEdit(props: Props) {
	const [showEdit, setShowEdit] = useState<boolean>(false);
	return (
		<div>
			<DataElement data={props.data} showEdit={showEdit} />
			<button
				onClick={() => {
					setShowEdit((state) => !state);
				}}
			>
				edit
			</button>
		</div>
	);
}

export function TasksPeople() {
	const { people, tasks } = useAppSelector((state) => state.tasksAndPeople);
	const dispatch = useAppDispatch();

	return (
		<div className={style.main}>
			<h1>tasks</h1>
			<div className={style.tasks}>
				{tasks.map((task) => (
					<div key={task.id} className={style.container}>
						<DataWithEdit data={task} />
					</div>
				))}
			</div>
			<div className={style.people}>
				<h1>people</h1>
				{people.map((person) => (
					<div key={person.id} className={style.container}>
						<DataWithEdit data={person} />
					</div>
				))}
			</div>
		</div>
	);
}

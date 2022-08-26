import { ReactPropTypes } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Person } from "../../interface";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { tasksState } from "../../state/slices/tasksSlice";
import { DataElement } from "../dataElement/dataElement";
import style from "./tasksPeople.module.scss";

export function TasksPeople() {
	const { people, tasks } = useAppSelector((state) => state.tasksAndPeople);
	const dispatch = useAppDispatch();
	return (
		<div className={style.main}>
			<h1>tasks</h1>
			<div className={style.tasks}>
				{tasks.map((task) => (
					<DataElement task={task} />
				))}
			</div>
			<div className={style.people}>
				<h1>people</h1>
				{people.map((person) => (
					<DataElement person={person} />
				))}
			</div>
		</div>
	);
}

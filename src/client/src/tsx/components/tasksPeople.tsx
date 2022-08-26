import { ReactPropTypes } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Person } from "../interface";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { tasksState } from "../state/slices/tasksSlice";
import { DataElement } from "./dataElement/dataElement";

export function TasksPeople() {
	const { people, tasks } = useAppSelector((state) => state.tasksAndPeople);
	const dispatch = useAppDispatch();
	return (
		<div>
			<div>
				{people.map((person) => (
					<DataElement person={person} />
				))}
			</div>
			<div>
				{tasks.map((task) => (
					<DataElement task={task} />
				))}
			</div>
		</div>
	);
}

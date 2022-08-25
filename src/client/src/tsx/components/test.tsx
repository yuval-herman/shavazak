import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { tasksState } from "../state/slices/tasksSlice";

export function Test() {
	const { people, tasks } = useAppSelector((state) => state.tasksAndPeople);
	const dispatch = useAppDispatch();
	return (
		<div>
			<p>{JSON.stringify(people)}</p>
			<p>{JSON.stringify(tasks)}</p>
		</div>
	);
}

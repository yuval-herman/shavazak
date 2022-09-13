import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJSON } from "../../api";
import { PeopleContext } from "../../context/PeopleContext";
import { TasksContext } from "../../context/TasksContext";
import Loader from "../Loader/Loader";

function RandomData() {
	const tasksContext = useContext(TasksContext);
	const peopleContext = useContext(PeopleContext);
	const navigate = useNavigate();
	useEffect(() => {
		fetchJSON("/api/randomdata").then((res) => {
			tasksContext.set(res.tasks);
			peopleContext.set(res.people);
			navigate("/");
		});
	});

	return (
		<>
			fetching random data... this might take a few seconds
			<Loader />
		</>
	);
}

export default RandomData;

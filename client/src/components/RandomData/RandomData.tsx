import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJSON } from "../../api";
import { PeopleContext } from "../../context/PeopleContext";
import { TasksContext } from "../../context/TasksContext";

function RandomData() {
	const tasksContext = useContext(TasksContext);
	const peopleContext = useContext(PeopleContext);
	const navigate = useNavigate();
	useEffect(() => navigate(-1));
	fetchJSON("/randomdata").then((res) => {
		tasksContext.set(res.tasks);
		peopleContext.set(res.people);
	});
	return <></>;
}

export default RandomData;

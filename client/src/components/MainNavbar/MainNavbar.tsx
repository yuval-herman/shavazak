import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { fetchJSON } from "../../api";
import { PeopleContext } from "../../context/PeopleContext";
import { TasksContext } from "../../context/TasksContext";
import style from "./MainNavbar.module.scss";

export function MainNavbar() {
	const tasksContext = useContext(TasksContext);
	const peopleContext = useContext(PeopleContext);
	return (
		<nav className={style.navbar}>
			<span>
				<NavLink
					className={({ isActive }) => (isActive ? style.activeLink : "")}
					to="/"
				>
					table view
				</NavLink>
			</span>
			<span>
				<NavLink
					className={({ isActive }) => (isActive ? style.activeLink : "")}
					to="/tablemanager"
				>
					manager view
				</NavLink>
			</span>
			<span>
				<a
					onClick={(event) => {
						event.preventDefault();
						fetchJSON("/api/randomdata").then((res) => {
							tasksContext.set(res.tasks);
							peopleContext.set(res.people);
						});
					}}
				>
					get random data
				</a>
			</span>
			<img src="https://user-images.githubusercontent.com/47389924/188946200-d7b4465e-dfb2-44b2-832c-081cd09adae4.png"></img>
		</nav>
	);
}

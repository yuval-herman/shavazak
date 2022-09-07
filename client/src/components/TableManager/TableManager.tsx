import { Link, NavLink, Outlet } from "react-router-dom";
import { MainNavbar } from "../MainNavbar/MainNavbar";
import style from "./TableManager.module.scss";

function TableManager() {
	return (
		<>
			<MainNavbar />
			<div className={style.main}>
				<nav className={style.navbar}>
					<NavLink
						className={({ isActive }) => (isActive ? style.activeLink : "")}
						to={"addperson"}
					>
						add person
					</NavLink>
					<NavLink
						className={({ isActive }) => (isActive ? style.activeLink : "")}
						to={"addtask"}
					>
						add task
					</NavLink>
					<NavLink
						className={({ isActive }) => (isActive ? style.activeLink : "")}
						to={"viewtasks"}
					>
						show tasks
					</NavLink>
					<NavLink
						className={({ isActive }) => (isActive ? style.activeLink : "")}
						to={"viewpeople"}
					>
						show people
					</NavLink>
				</nav>
				<Outlet />
			</div>
		</>
	);
}

export default TableManager;

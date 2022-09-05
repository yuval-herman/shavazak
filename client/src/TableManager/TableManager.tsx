import { Link, Outlet } from "react-router-dom";
import { MainNavbar } from "../MainNavbar/MainNavbar";
import style from "./TableManager.module.scss";
import Button from "@mui/material/Button";

function TableManager() {
	return (
		<>
			<MainNavbar />
			<div className={style.main}>
				<nav className={style.sidebar}>
					<Link to={"addperson"}>add person</Link>
					<Link to={"addtask"}>add task</Link>
					<Link to={"viewtasks"}>show tasks</Link>
					<Link to={"viewpeople"}>show people</Link>
				</nav>
				<Outlet />
			</div>
		</>
	);
}

export default TableManager;

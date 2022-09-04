import { Link, Outlet } from "react-router-dom";
import { MainNavbar } from "../MainNavbar/MainNavbar";
import style from "./TableManager.module.scss";

function TableManager() {
	return (
		<>
			<MainNavbar />
			<div className={style.main}>
				<nav className={style.sidebar}>
					<span>
						<Link to={"/"}>home</Link>
					</span>
					<span>
						<Link to={"addperson"}>add person</Link>
					</span>
					<span>
						<Link to={"addtask"}>add task</Link>
					</span>
					<span>
						<Link to={"viewtasks"}>show tasks</Link>
					</span>
					<span>
						<Link to={"viewpeople"}>show people</Link>
					</span>
				</nav>
				<div>
					<Outlet />
				</div>
			</div>
		</>
	);
}

export default TableManager;

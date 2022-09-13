import { Link, NavLink } from "react-router-dom";
import style from "./MainNavbar.module.scss";
import helmet from "../../media/icons/helmet.svg";

export function MainNavbar() {
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
				<NavLink
					className={({ isActive }) => (isActive ? style.activeLink : "")}
					to="/randomdata"
				>
					get random data
				</NavLink>
			</span>
			<img src="https://user-images.githubusercontent.com/47389924/188946200-d7b4465e-dfb2-44b2-832c-081cd09adae4.png"></img>
		</nav>
	);
}

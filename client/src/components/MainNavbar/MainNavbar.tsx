import { Link, NavLink } from "react-router-dom";
import style from "./MainNavbar.module.scss";
import helmet from "../../media/icons/helmet.svg";

export function MainNavbar() {
	return (
		<nav className={style.navbar}>
			<img src={helmet} />
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
			<p>Shavzak</p>
		</nav>
	);
}

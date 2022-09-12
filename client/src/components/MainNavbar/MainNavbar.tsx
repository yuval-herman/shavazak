import { Link } from "react-router-dom";
import style from "./MainNavbar.module.scss";
import helmet from "../../media/icons/helmet.svg";

export function MainNavbar() {
	return (
		<nav className={style.navbar}>
			<img src={helmet} />
			<Link to="/">table view</Link>
			<Link to="/tablemanager">manager view</Link>
			<Link to="/randomdata">get random data</Link>
			<p>Shavzak</p>
		</nav>
	);
}

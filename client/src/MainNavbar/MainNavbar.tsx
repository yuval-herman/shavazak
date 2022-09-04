import { Link } from "react-router-dom";

export function MainNavbar() {
	return (
		<nav>
			<Link to="/">table view</Link>{" "}
			<Link to="/tablemanager">manager view</Link>
		</nav>
	);
}

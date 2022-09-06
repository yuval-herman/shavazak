import { Link } from "react-router-dom";
import style from "./MainNavbar.module.scss";

export function MainNavbar() {
  return (
    <nav className={style.navbar}>
      <Link to="/">table view</Link> <Link to="/tablemanager">manager view</Link>
      <p>Shavzak</p>
    </nav>
  );
}
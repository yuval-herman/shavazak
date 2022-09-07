import { useEffect, useState } from "react";
import style from "./Snackbar.module.scss";

function Snackbar(props: { value: string }) {
	const [visible, setVisible] = useState(true);
	useEffect(() => setVisible(true), [props.value]);
	if (!props.value.length) {
		return <></>;
	}
	setTimeout(() => {
		setVisible(false);
	}, 3000);
	return (
		<div className={style.main + " " + (visible ? style.visible : "")}>
			{props.value}
		</div>
	);
}

export default Snackbar;

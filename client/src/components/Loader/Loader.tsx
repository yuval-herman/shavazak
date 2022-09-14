import style from "./Loader.module.scss";

function Loader(props: { className?: string }) {
	return (
		<div className={style.main + " " + (props.className ?? "")}>
			<div className={style.one} />
			<div className={style.two} />
		</div>
	);
}

export default Loader;

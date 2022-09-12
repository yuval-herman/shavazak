import { useNavigate } from "react-router-dom";
import style from "./DetailsList.module.scss";

interface ObjWithId extends Record<string, string | number | object> {
	id: string;
}

interface PropsWithoutButtons {
	names: string[];
	data: ObjWithId[];
	className?: string;
}
interface PropsWithButtons extends PropsWithoutButtons {
	delete: (id: string) => void;
	edit: (id: string) => string;
}

type Props = PropsWithButtons | PropsWithoutButtons;

function DetailsList(props: Props) {
	const navigate = useNavigate();
	if (!props.data.length) {
		return <div>no data...</div>;
	}
	return (
		<div className={style.main}>
			{props.data.map((item, i) => (
				<details>
					<summary>{props.names[i]}</summary>
					<ul>
						{Object.entries(item).map((dataField, i) => (
							<li key={i}>
								<h5>{dataField[0]}</h5>
								{normalizeObj(dataField[1])}
							</li>
						))}
					</ul>
					{"delete" in props ? (
						<div className={style.buttons}>
							<button onClick={() => props.delete(item.id)}>delete</button>
							<button onClick={() => navigate("../" + props.edit(item.id))}>
								edit
							</button>
						</div>
					) : undefined}
				</details>
			))}
		</div>
	);

	function normalizeObj(obj: string | number | object): JSX.Element {
		const renderPair = (pair: object) =>
			Object.entries(pair).map(([key, value]) => (
				<p>
					{key}: {value}
				</p>
			));
		if (typeof obj !== "object") {
			return <>{obj}</>;
		} else if (Array.isArray(obj)) {
			return (
				<>
					{obj.map((pair) => (
						<div className={style.row}>{normalizeObj(pair)}</div>
					))}
				</>
			);
		}
		return <>{renderPair(obj)}</>;
	}
}

export default DetailsList;

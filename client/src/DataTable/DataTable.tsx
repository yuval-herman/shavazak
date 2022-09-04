import { useNavigate } from "react-router-dom";
import style from "./DataTable.module.scss";

export function DataTable(props: {
	data: Record<string, string | number | object>[];
	delete: (id: string) => void;
	edit: (id: string) => string;
}) {
	const navigate = useNavigate();
	if (!props.data.length) {
		return <div>no data...</div>;
	}
	return (
		<table className={style.main}>
			<thead>
				<tr>
					{Object.keys(props.data[0]).map((dataItem, i) => (
						<td key={i}>{dataItem}</td>
					))}
				</tr>
			</thead>
			<tbody>
				{props.data.map((dataItem, i) => (
					<tr key={i}>
						{Object.values(dataItem).map((dataField, i) => (
							<td key={i}>
								{typeof dataField === "object"
									? JSON.stringify(dataField)
									: dataField}
							</td>
						))}
						<td>
							<button onClick={() => props.delete(dataItem.id as string)}>
								delete
							</button>
							<button
								onClick={() =>
									navigate("../" + props.edit(dataItem.id as string))
								}
							>
								edit
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

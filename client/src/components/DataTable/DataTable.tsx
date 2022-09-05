import React from "react";
import { useNavigate } from "react-router-dom";
import style from "./DataTable.module.scss";

interface PropsWithoutButtons {
	data: Record<string, string | number | object>[];
	className?: string;
}
interface PropsWithButtons extends PropsWithoutButtons {
	delete: (id: string) => void;
	edit: (id: string) => string;
}

type Props = PropsWithButtons | PropsWithoutButtons;

export function DataTable(props: Props) {
	const navigate = useNavigate();
	if (!props.data.length) {
		return <div>no data...</div>;
	}
	return (
		<table className={props.className || style.main}>
			<thead>
				<tr>
					{Object.keys(props.data[0]).map((dataItem, i) => (
						<th key={i}>{dataItem}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{props.data.map((dataItem, i) => (
					<tr key={i}>
						{Object.values(dataItem).map((dataField, i) => (
							<td key={i}>{dataCell(dataField)}</td>
						))}
						{"delete" in props ? (
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
						) : undefined}
					</tr>
				))}
			</tbody>
		</table>
	);

	function dataCell(dataField: string | number | object): React.ReactNode {
		let cell;
		if (Array.isArray(dataField) && typeof dataField[0] !== "object") {
			cell = dataField.join(", ");
		} else if (typeof dataField === "object") {
			cell = <DataTable data={dataField as any} className={style.innerTable} />;
		} else {
			cell = <p>{dataField}</p>;
		}
		return cell;
	}
}

import style from "./DataTable.module.scss";

export function DataTable(props: { data: Record<string, string | number>[] }) {
	return (
		<table className={style.main}>
			<thead>
				<tr>
					{Object.keys(props.data[0]).map((item, i) => (
						<td key={i}>{item}</td>
					))}
				</tr>
			</thead>
			<tbody>
				{props.data.map((task, i) => (
					<tr key={i}>
						{Object.values(task).map((item, i) => (
							<td key={i}>{item}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}

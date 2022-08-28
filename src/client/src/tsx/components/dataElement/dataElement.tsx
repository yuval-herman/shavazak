import React, { useEffect, useState } from "react";
import { Person, Task } from "../../interface";
import style from "./dataElement.module.scss";

interface Props {
	data: Person | Task;
	showEdit: boolean;
}

export function DataElement(props: Props) {
	const data = props.data;

	return (
		<div className={style.main}>
			<h3>{data.name}</h3>
			{Object.entries(data).map(([key, value]) => {
				if (Array.isArray(value)) {
					if (typeof value[0] === "object") {
						value = (
							<table key={key}>
								<thead>
									<tr>
										<td>role</td>
										<td>amount</td>
									</tr>
								</thead>
								<tbody>
									{value.map(({ amount, role }, i) => (
										<tr key={i}>
											<td>
												{props.showEdit ? (
													<input placeholder={role} />
												) : (
													role
												)}
											</td>
											<td>
												{props.showEdit ? (
													<input placeholder={amount} />
												) : (
													amount
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						);
					} else {
						value = props.showEdit ? (
							<input placeholder={value.join(", ")} />
						) : (
							value.join(", ")
						);
					}
				} else if (props.showEdit) {
					value = <input placeholder={value} />;
				}

				return (
					<div key={key}>
						<strong>{key.replaceAll("_", " ")}</strong>: {value}
					</div>
				);
			})}
		</div>
	);
}

import { useContext } from "react";
import { PeopleContext } from "../../context/PeopleContext";
import { DataTable } from "../DataTable/DataTable";

function PeopleView() {
	const people = useContext(PeopleContext);
	return (
		<DataTable
			data={people.people}
			delete={people.delete}
			edit={(id: string) => "addperson?id=" + id}
		/>
	);
}

export default PeopleView;

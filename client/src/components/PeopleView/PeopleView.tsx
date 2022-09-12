import { useContext } from "react";
import { PeopleContext } from "../../context/PeopleContext";
import { DataTable } from "../DataTable/DataTable";
import DetailsList from "../DetailsList/DetailesList";

function PeopleView() {
	const people = useContext(PeopleContext);
	return (
		<DetailsList
			data={people.people.map((person) => {
				const { name, ...newObj } = person;
				return newObj;
			})}
			names={people.people.map((person) => person.name)}
			delete={people.delete}
			edit={(id: string) => "addperson?id=" + id}
		/>
	);
}

export default PeopleView;

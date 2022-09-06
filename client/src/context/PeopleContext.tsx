import React, { useState } from "react";
import { deletePerson, getPeople, savePerson } from "../api";
import { Person } from "../types";

const PeopleContextInitial = {
	people: getPeople(),
	add: savePerson,
	delete: (id: string) => {},
};

export const PeopleContext = React.createContext(PeopleContextInitial);

export function PeopleProvider(props: React.PropsWithChildren) {
	const [people, setPeople] = useState(PeopleContextInitial);
	people.add = (person: Person) => {
		savePerson(person);
		setPeople({ ...people, people: getPeople() });
	};
	people.delete = (id: string) => {
		deletePerson(id);
		setPeople({ ...people, people: getPeople() });
	};
	return (
		<PeopleContext.Provider value={people}>
			{props.children}
		</PeopleContext.Provider>
	);
}

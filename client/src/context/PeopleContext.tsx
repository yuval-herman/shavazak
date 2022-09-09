import React, { useState } from "react";
import {
	deletePerson,
	getPeople,
	savePerson,
	setPeople as setLocalPeople,
} from "../api";
import { Person } from "../types";

const PeopleContextInitial = {
	people: getPeople(),
	add: savePerson,
	delete: (id: string) => {},
	set: (people: Person[]) => {},
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
	people.set = (newPeople: Person[]) => {
		setLocalPeople(newPeople);
		setPeople({ ...people, people: newPeople });
	};
	return (
		<PeopleContext.Provider value={people}>
			{props.children}
		</PeopleContext.Provider>
	);
}

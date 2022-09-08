export interface RequiredPeoplePerShift {
	amount: number;
	role: string;
}

export interface Person {
	id: string;
	name: string;
	avatar: string;
	roles: string[];
	score: number;
	status: string;
	[key: string]: string | number | string[];
}

export interface Shift {
	date: number;
	people: Person[];
}

export interface Task {
	id: string;
	name: string;
	required_people_per_shift: RequiredPeoplePerShift[];
	score: number;
	shift_duration: number;
	shifts: Shift[];
	[key: string]: string | number | Shift[] | RequiredPeoplePerShift[];
}

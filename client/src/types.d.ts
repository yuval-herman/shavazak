export interface RequiredPeoplePerShift {
	amount: number;
	role: string;
}

export interface Person {
	id: number;
	name: string;
	avatar: string;
	roles: string[];
	score: number;
	status: number;
}

export interface Shift {
	date: number;
	people: Person[];
}

export interface Task {
	id: number;
	name: string;
	required_people_per_shift: RequiredPeoplePerShift[];
	score: number;
	shift_duration: number;
	shifts: Shift[];
}

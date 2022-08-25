export interface Person {
	id: number;
	name: string;
	roles: string[];
	score: number;
	status: number;
	team_id: number;
}

export interface Shift {
	date: number;
	people: Person[];
}

export interface Task {
	id: number;
	name: string;
	required_people_per_shift: {
		amount: number;
		role: string;
	}[];
	score: number;
	shift_duration: number;
	shifts?: Shift[];
	team_id: number;
}

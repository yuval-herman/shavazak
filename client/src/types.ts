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
}

export function isPerson(obj: any): obj is Person {
	return (
		typeof obj.id === "string" &&
		typeof obj.name === "string" &&
		Array.isArray(obj.roles) &&
		obj.roles.every((item: any) => typeof item === "string") &&
		typeof obj.score === "number" &&
		typeof obj.status === "string"
	);
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
}

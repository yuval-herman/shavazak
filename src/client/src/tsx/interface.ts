export interface Person {
  id: number;
  name: string;
  roles: string[];
  score: number;
  status: number;
  team_id: number;
}

export interface RequiredPeoplePerShift {
  num: number;
  role: string;
}

export interface Task {
  id: number;
  name: string;
  required_people_per_shift: RequiredPeoplePerShift[];
  score: number;
  shift_duration: number;
  team_id: number;
}

export interface TimeTable {
  date: number;
  person: Person;
  task: Task;
}

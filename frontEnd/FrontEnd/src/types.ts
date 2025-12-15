export type NewUser = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
export type Vacation = {
  id: number;
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  image_fileName: string;
  followers: number;
  isuserFollow: boolean;
}
export type VacationData = {
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  image_fileName: string | File;
}

export type VacationProps = {
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
}
export type Vacationpropstoedit = {
  id: number;
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  image_fileName: string;
  followers: number;

}

export type Login = {
  email: string;
  password: string;
}
export type FilterType = "all" | "my" | "future" | "active";

export type FollowVacation = {
  user_id: number;
  vacation_id: number;
}





import axios from "axios";
import { BASE_URL } from "../config";
import type { Login, NewUser } from "../types";

export function fetchRegister(newUser: NewUser): Promise<any> {
  const url = `${BASE_URL}user-register`;
  const res = axios.post(url, newUser);
  console.log(res);
  return res;
}

export async function fetchVacations(
  page?: number,
  followedVacations?: boolean,
  futureVacations?: boolean,
  activeVacations?: boolean
) {
  let url = `${BASE_URL}vacations-paged`;
  const params = [];

  if (page !== undefined) {
    params.push(`page=${page}`);
  }

  if (followedVacations !== undefined) {
    params.push(`followedVacations=${followedVacations}`);
  }

  if (futureVacations !== undefined) {
    params.push(`futureVacations=${futureVacations}`);
  }

  if (activeVacations !== undefined) {
    params.push(`activeVacations=${activeVacations}`);
  }

  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }

  const token = sessionStorage.getItem("authToken");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const res = axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res;
}


export function fetchLogin(userDetails: Login) {
  const url = `${BASE_URL}user-login`;
  const res = axios.post(url, userDetails, {
    headers: { "Content-Type": "application/json" }
  });

  return res;

}
export function fetchFollow(user_id: number, vacation_id: number) {
  const url = `${BASE_URL}follow-vacation`;
  const token = sessionStorage.getItem("authToken");
  console.log(token)
  const res = axios.post(url, { user_id, vacation_id },

    { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
  );
  console.log(res);

  return res;
}
export function fetchUnfollow(user_id: number, vacation_id: number) {
  const url = `${BASE_URL}unfollow-vacation`;
  const token = sessionStorage.getItem("authToken");

  return axios.delete(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    data: { user_id, vacation_id }
  });
}


export function fetchaddVacation(vacation: FormData) {
  const url = `${BASE_URL}add-vacation`
  const token = sessionStorage.getItem("authToken");

  const res = axios.post(url, vacation, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res;

}


export function fetchDeleteVacation(vacationId: number) {
  const url = `${BASE_URL}delete-vacation`;
  const token = sessionStorage.getItem("authToken");
  return axios.delete(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { vacationId }
  });
}

export async function fetchUpdateVacation(vacation: FormData) {
  const url = `${BASE_URL}update-vacation`;
  const token = sessionStorage.getItem("authToken");

  const res = axios.patch(url, vacation, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res;
}
export async function fetchVacationFollowers() {
  const url = `${BASE_URL}vacations-followers`;
  const token = sessionStorage.getItem("authToken");
  const res = axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res;
}



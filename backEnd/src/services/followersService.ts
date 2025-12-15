import { runQuery } from "../dal/dal";

export async function followVacation(userid: number, vacationid: number): Promise<number> {
  const q = `INSERT INTO followers (user_id, vacation_id) VALUES ($1, $2) RETURNING id`;
  const res = await runQuery(q, [userid, vacationid]);
  console.log("DB response:", res); 
  return res; 
}


export async function unfollowVacation(userid: number, vacationid: number): Promise<number> {
  const q = `
    DELETE FROM followers
    WHERE user_id=$1 AND vacation_id=$2
  `;
  const res = await runQuery(q, [userid, vacationid]) as any;
return res.rowCount;
}

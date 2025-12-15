import path from "path";
import { runQuery } from "../dal/dal";
import { VacationsModel } from "../models/VacationsModel";
import { appConfig, IMAGE_FILE } from "../utils/config";
import { UploadedFile } from "express-fileupload";
import { Readable } from "stream";
const uuid = require("uuid");
import { deleteFromS3, uploadToS3Readable } from "../helpers/s3Helper";

export async function getVacationsPaged(
  page: number = 1,
  limit: number = 10,
  userid?: number,
  futureVacations?: boolean,
  activeVacations?: boolean,
  followedVacations?: boolean // 🆕 הפרמטר החדש ששולט בסינון "החופשות שלי"
) {
  let q = `SELECT v.* FROM vacations v`;
  let countQ = `SELECT COUNT(v.id) AS count FROM vacations v`;
  let params: any[] = [];
  let conditions: string[] = [];
  let paramIndex = 1;

  if (!userid) {
    return { total: 0, page, limit, results: [], next: "" };
  }

  const useridForFollowFilter = userid;

  if (futureVacations) {
    conditions.push(`v.start_date > CURRENT_DATE`);
  }

  if (activeVacations) {
    conditions.push(`v.start_date <= CURRENT_DATE AND v.end_date >= CURRENT_DATE`);
  }

  if (followedVacations) {
    conditions.push(
      `EXISTS ( SELECT 1 FROM followers f WHERE f.vacation_id = v.id AND f.user_id = $${paramIndex++} )`
    );
    params.push(useridForFollowFilter);
  }

  if (conditions.length > 0) {
    const whereClause = ` WHERE ` + conditions.join(" AND ");
    q += whereClause;
    countQ += whereClause;
  }

  const countRes = await runQuery(countQ, params) as any;
  const total = countRes.length > 0 ? Number(countRes[0].count) : 0;

  const limitPlaceholder = paramIndex++;
  const offsetPlaceholder = paramIndex++;

  q += ` ORDER BY v.start_date LIMIT $${limitPlaceholder} OFFSET $${offsetPlaceholder}`;

  params.push(limit);
  params.push((page - 1) * limit);

  const res = await runQuery(q, params) as any[];

  const rows = Array.isArray(res) ? res : [];
  const vacations = await Promise.all(
    rows.map(async (row) => {
      const followers = await vacationFollowers(row.id);
      const isFollow = await isFollowing(useridForFollowFilter, row.id);

      return new VacationsModel(
        row.id,
        row.destination,
        row.description,
        row.start_date,
        row.end_date,
        row.price,
        row.image_filename,
        followers,
        isFollow
      );
    })
  );

  return {
    total,
    page,
    limit,
    results: vacations,
    next:
      page * limit < total
        ? `http://localhost:3030/vacations-paged?page=${page + 1}&limit=${limit}`
        : ""
  };
}
async function isFollowing(user_id: number, vacation_id: number): Promise<boolean> {
  const isUserFollow = `SELECT 1 AS is_following FROM followers WHERE user_id = $1 AND vacation_id = $2 LIMIT 1;`;
  const res = await runQuery(isUserFollow, [user_id, vacation_id]) as any[];
  if (res.length > 0) {
    return true;
  } else {
    return false;
  }
}
async function vacationFollowers(vacation_id: number): Promise<number> {
  const followersq = `SELECT COUNT(*) AS followers_count FROM followers WHERE vacation_id = $1;`;
  const res = await runQuery(followersq, [vacation_id]);
  return Number(res[0].followers_count);
}

export async function vacationsFollowersNumber(vacation_id: number) {
  const q = `SELECT COUNT(*) AS followers_count FROM followers WHERE vacation_id =$1;`
  const res = await runQuery(q, [vacation_id]);
  return res;
}

export async function getUserFollowedVacations(user_id: number) {
  const q = `SELECT v.* FROM vacations v JOIN followers f ON v.id = f.vacation_id WHERE f.user_id = $1;`
  const res = await runQuery(q, [user_id]);
  return res;
}

export async function addVacation(vacation: Partial<VacationsModel>): Promise<any> {
  const q = `
      INSERT INTO vacations (destination, description, start_date, end_date, price, image_filename)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
  const imageName = await saveImage(vacation.image_fileName);

  const params = [
    vacation.destination,
    vacation.description,
    vacation.start_date,
    vacation.end_date,
    vacation.price,
    imageName
  ];
  const res = await runQuery(q, params) as any[];
  return res;
}


async function saveImage(imagefile: UploadedFile) {
  if (!imagefile) return;

  const uuidString = uuid(); // שימוש נכון
  const lastDot = imagefile.name.lastIndexOf(".");
  const imageName = uuidString + imagefile.name.substring(lastDot);

  const fileStream = Readable.from(imagefile.data);
  await uploadToS3Readable(fileStream, imageName);

  return imageName;
}


async function deleteImage(id: number) {
  const q2 = `SELECT image_filename FROM vacations WHERE id=$1`;
  const res = await runQuery(q2, [id]) as any[];
  if (!res || res.length === 0) {
    throw new Error(`image from vacation with id ${id} not found`);
  }
  const oldImageFilename = res[0].image_filename;
  deleteFromS3(oldImageFilename)
}
export async function updateVacation(v: Partial<VacationsModel>): Promise<any> {
  if (!v.id) throw new Error("Vacation id is required");
  let newimagefilename: string;

  if (typeof v.image_fileName === "string") {
    newimagefilename = v.image_fileName;
  } else if (v.image_fileName) {
    newimagefilename = await saveImage(v.image_fileName as UploadedFile);
    await deleteImage(v.id);
  } else {
    throw new Error("image_fileName is required");
  }

  const q = `
    UPDATE vacations
    SET destination=$1,
        description=$2,
        start_date=$3,
        end_date=$4,
        price=$5,
        image_filename=$6
    WHERE id=$7
  `;

  const params = [
    v.destination,
    v.description,
    v.start_date,
    v.end_date,
    v.price,
    newimagefilename,
    v.id
  ];

  console.log("Update params:", params);
  await runQuery(q, params);
  return newimagefilename;
}


export async function deleteVacation(vid: number): Promise<number> {
  await deleteImage(vid);
  const q = `DELETE FROM vacations WHERE id=$1`;
  const res = await runQuery(q, [vid]) as any;
  return res.rowCount;
}

export async function getVacationFollowers() {
  const q = `SELECT v.destination, COUNT(f.user_id) AS followers_count FROM vacations v LEFT JOIN followers f 
    ON v.id = f.vacation_id GROUP BY v.destination ORDER BY v.destination;`
  const res = await runQuery(q);
  return res;
}







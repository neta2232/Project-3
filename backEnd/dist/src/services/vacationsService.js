"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVacationsPaged = getVacationsPaged;
exports.vacationsFollowersNumber = vacationsFollowersNumber;
exports.getUserFollowedVacations = getUserFollowedVacations;
exports.addVacation = addVacation;
exports.updateVacation = updateVacation;
exports.deleteVacation = deleteVacation;
exports.getVacationFollowers = getVacationFollowers;
const dal_1 = require("../dal/dal");
const VacationsModel_1 = require("../models/VacationsModel");
const stream_1 = require("stream");
const uuid = require("uuid");
const s3Helper_1 = require("../helpers/s3Helper");
function getVacationsPaged() {
    return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, userid, futureVacations, activeVacations, followedVacations // 🆕 הפרמטר החדש ששולט בסינון "החופשות שלי"
    ) {
        let q = `SELECT v.* FROM vacations v`;
        let countQ = `SELECT COUNT(v.id) AS count FROM vacations v`;
        let params = [];
        let conditions = [];
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
            conditions.push(`EXISTS ( SELECT 1 FROM followers f WHERE f.vacation_id = v.id AND f.user_id = $${paramIndex++} )`);
            params.push(useridForFollowFilter);
        }
        if (conditions.length > 0) {
            const whereClause = ` WHERE ` + conditions.join(" AND ");
            q += whereClause;
            countQ += whereClause;
        }
        const countRes = yield (0, dal_1.runQuery)(countQ, params);
        const total = countRes.length > 0 ? Number(countRes[0].count) : 0;
        const limitPlaceholder = paramIndex++;
        const offsetPlaceholder = paramIndex++;
        q += ` ORDER BY v.start_date LIMIT $${limitPlaceholder} OFFSET $${offsetPlaceholder}`;
        params.push(limit);
        params.push((page - 1) * limit);
        const res = yield (0, dal_1.runQuery)(q, params);
        const rows = Array.isArray(res) ? res : [];
        const vacations = yield Promise.all(rows.map((row) => __awaiter(this, void 0, void 0, function* () {
            const followers = yield vacationFollowers(row.id);
            const isFollow = yield isFollowing(useridForFollowFilter, row.id);
            return new VacationsModel_1.VacationsModel(row.id, row.destination, row.description, row.start_date, row.end_date, row.price, row.image_filename, followers, isFollow);
        })));
        return {
            total,
            page,
            limit,
            results: vacations,
            next: page * limit < total
                ? `http://localhost:3030/vacations-paged?page=${page + 1}&limit=${limit}`
                : ""
        };
    });
}
function isFollowing(user_id, vacation_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const isUserFollow = `SELECT 1 AS is_following FROM followers WHERE user_id = $1 AND vacation_id = $2 LIMIT 1;`;
        const res = yield (0, dal_1.runQuery)(isUserFollow, [user_id, vacation_id]);
        if (res.length > 0) {
            return true;
        }
        else {
            return false;
        }
    });
}
function vacationFollowers(vacation_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const followersq = `SELECT COUNT(*) AS followers_count FROM followers WHERE vacation_id = $1;`;
        const res = yield (0, dal_1.runQuery)(followersq, [vacation_id]);
        return Number(res[0].followers_count);
    });
}
function vacationsFollowersNumber(vacation_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = `SELECT COUNT(*) AS followers_count FROM followers WHERE vacation_id =$1;`;
        const res = yield (0, dal_1.runQuery)(q, [vacation_id]);
        return res;
    });
}
function getUserFollowedVacations(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = `SELECT v.* FROM vacations v JOIN followers f ON v.id = f.vacation_id WHERE f.user_id = $1;`;
        const res = yield (0, dal_1.runQuery)(q, [user_id]);
        return res;
    });
}
function addVacation(vacation) {
    return __awaiter(this, void 0, void 0, function* () {
        const q = `
      INSERT INTO vacations (destination, description, start_date, end_date, price, image_filename)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
        const imageName = yield saveImage(vacation.image_fileName);
        const params = [
            vacation.destination,
            vacation.description,
            vacation.start_date,
            vacation.end_date,
            vacation.price,
            imageName
        ];
        const res = yield (0, dal_1.runQuery)(q, params);
        return res;
    });
}
function saveImage(imagefile) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!imagefile)
            return;
        const uuidString = uuid(); // שימוש נכון
        const lastDot = imagefile.name.lastIndexOf(".");
        const imageName = uuidString + imagefile.name.substring(lastDot);
        const fileStream = stream_1.Readable.from(imagefile.data);
        yield (0, s3Helper_1.uploadToS3Readable)(fileStream, imageName);
        return imageName;
    });
}
function deleteImage(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const q2 = `SELECT image_filename FROM vacations WHERE id=$1`;
        const res = yield (0, dal_1.runQuery)(q2, [id]);
        if (!res || res.length === 0) {
            throw new Error(`image from vacation with id ${id} not found`);
        }
        const oldImageFilename = res[0].image_filename;
        (0, s3Helper_1.deleteFromS3)(oldImageFilename);
    });
}
function updateVacation(v) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!v.id)
            throw new Error("Vacation id is required");
        let newimagefilename;
        if (typeof v.image_fileName === "string") {
            newimagefilename = v.image_fileName;
        }
        else if (v.image_fileName) {
            newimagefilename = yield saveImage(v.image_fileName);
            yield deleteImage(v.id);
        }
        else {
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
        yield (0, dal_1.runQuery)(q, params);
        return newimagefilename;
    });
}
function deleteVacation(vid) {
    return __awaiter(this, void 0, void 0, function* () {
        yield deleteImage(vid);
        const q = `DELETE FROM vacations WHERE id=$1`;
        const res = yield (0, dal_1.runQuery)(q, [vid]);
        return res.rowCount;
    });
}
function getVacationFollowers() {
    return __awaiter(this, void 0, void 0, function* () {
        const q = `SELECT v.destination, COUNT(f.user_id) AS followers_count FROM vacations v LEFT JOIN followers f 
    ON v.id = f.vacation_id GROUP BY v.destination ORDER BY v.destination;`;
        const res = yield (0, dal_1.runQuery)(q);
        return res;
    });
}

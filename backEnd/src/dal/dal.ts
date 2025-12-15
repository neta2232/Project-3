import { appConfig } from "../utils/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: appConfig.DB_URL, ssl: { rejectUnauthorized: false } });

export async function getDbClient() {
    return pool.connect();
}

export async function runQuery(
  q: string,
  params: any[] = [],
  client: any = undefined
) {
  const executor = client || pool;
  const res = await executor.query(q, params);

  if (res.rows && res.rows.length > 0) {
    return res.rows;
  }

  return { changes: res.rowCount };
}



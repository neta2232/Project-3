export function getUserFromToken(): { isAdmin: boolean; userName: string; userId: number } | null {
  const token = sessionStorage.getItem("authToken");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    const isAdmin = payload.isadmin ?? false;
    const userName = `${payload.first_name} ${payload.last_name}`;
    const userId = payload.id;

    return { isAdmin, userName, userId };
  } catch {
    return null;
  }
}



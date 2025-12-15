import { useEffect, useState } from "react";
import { fetchDeleteVacation, fetchFollow, fetchUnfollow, fetchVacations } from "../../Api/ClientApi";
import type { Vacation } from "../../types";
import { IMG_URL } from "../../config";
import "./Vacations.css";
import "../Errors/Errors.css"
import { getUserFromToken } from "../../Auth/Auth";
import EditVacation from "../EditVacation/EditVacation";

function Vacations() {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [user, setUser] = useState<{ userName: String, userId: number } | null>(null);
  limit
  total

  const [errors, setErrors] = useState<{ global?: string; vacations?: { [id: number]: string } }>({});

  const [filter, setFilter] = useState<"all" | "active" | "future" | "mine">("all");
  const [editVacation, setEditVacation] = useState<Vacation | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [vacationToDelete, setVacationToDelete] = useState<number | null>(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem("authToken");
    if (savedToken) setToken(savedToken);
    const user = getUserFromToken();
    if (user) {
      setIsAdmin(user.isAdmin);
      setUser({ userName: user.userName, userId: user.userId });
    } else {
      setErrors(prev => ({ ...prev, global: "Error in your credentials. Please check them" }));
    }

    setLoading(true);

    let futureParam: boolean | undefined;
    let activeParam: boolean | undefined;
    let followedParam: boolean | undefined;

    if (filter === "mine") followedParam = true;
    if (filter === "future") futureParam = true;
    if (filter === "active") activeParam = true;

    fetchVacations(page, followedParam, futureParam, activeParam)
      .then((vacation) => {
        const vd = vacation.data;
        setVacations(vd.results);
        setTotalPages(Math.ceil(vd.total / vd.limit));
        setLimit(vd.limit);
        setTotal(vd.total);
        setErrors(prev => ({ ...prev, global: "" }));
      })
      .catch(() => setErrors(prev => ({ ...prev, global: "Error while loading vacations. Please try again" })))
      .finally(() => {
        setLoading(false)


      });
  }, [page, filter]);

  function formatDate(dateString: string) {
    const d = new Date(dateString);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
  }

  async function handleFollowToggle(vacationId: number, isFollowed: boolean) {
    const userId = user?.userId;
    if (!userId) return;
    try {
      if (isFollowed) {
        await fetchUnfollow(userId, vacationId);
        setVacations(prev =>
          prev.map(v =>
            v.id === vacationId ? { ...v, isuserFollow: false, followers: v.followers - 1 } : v
          )
        );
      } else {
        await fetchFollow(userId, vacationId);
        setVacations(prev =>
          prev.map(v =>
            v.id === vacationId ? { ...v, isuserFollow: true, followers: v.followers + 1 } : v
          )
        );
      }
      setErrors(prev => ({
        ...prev,
        vacations: { ...prev.vacations, [vacationId]: "" }
      }));
    } catch {
      setErrors(prev => ({
        ...prev,
        vacations: { ...prev.vacations, [vacationId]: "Error while following this vacation" }
      }));
    }
  }

  async function handleDelete(vid: number) {
    try {
      const res = await fetchDeleteVacation(vid);
      if (res) {
        setVacations(prev => prev.filter(v => v.id !== vid));
        setErrors(prev => ({
          ...prev,
          vacations: { ...prev.vacations, [vid]: "" }
        }));
      }
    } catch {
      setErrors(prev => ({
        ...prev,
        vacations: { ...prev.vacations, [vid]: "Error deleting this vacation" }
      }));
    }
  }

  function handlePrevious() {
    if (page > 1) setPage(page - 1);
  }

  function handleNext() {
    if (page < totalPages) setPage(page + 1);
  }

  return (
    <>
      <h1 id='vacation-title'>Vacations</h1>
      {!isAdmin && (
        <div className="filters">
          <label><input className="filter-input" type="radio" name="filter" checked={filter === "all"} onChange={() => setFilter("all")} />All vacations</label>
          <label><input className="filter-input" type="radio" name="filter" checked={filter === "active"} onChange={() => { setFilter("active"); setPage(1) }} />Active vacations</label>
          <label><input className="filter-input" type="radio" name="filter" checked={filter === "future"} onChange={() => { setFilter("future"); setPage(1) }} />Future vacations</label>
          <label><input className="filter-input" type="radio" name="filter" checked={filter === "mine"} onChange={() => { setFilter("mine"); setPage(1) }} />My vacations</label>
        </div>
      )}

      <div className="vacations">
        {loading ? (
          <div className=" my-progress progress">
            <div className="progress-bar progress-bar-striped progress-bar-animated bg-info" >
              loading...
            </div>
          </div>

        ) : vacations.length === 0 ? (
          <p className="vacation-message">Your new vacations will be here </p>
        ) : errors.global ? (
          <p className="error-message">{errors.global}</p>
        ) : (
          <>
            {vacations.map((v) => (
              <div key={v.id} className="card w-25">
                <img src={IMG_URL + v.image_fileName} width={155} alt={v.destination} className="card-img-top" />
                {!isAdmin && (
                  <>
                    <button
                      onClick={() => handleFollowToggle(v.id, v.isuserFollow)}
                      className={v.isuserFollow ? "unfollow-btn" : "follow-btn"}
                    >
                      {v.isuserFollow ? "unfollow" : "follow"}
                    </button>
                    {errors.vacations?.[v.id] && (
                      <p className="error-message">{errors.vacations[v.id]}</p>
                    )}
                  </>
                )}
                {isAdmin && (
                  <>
                    <button onClick={() => setEditVacation(v)} className="edit-btn">Edit</button>
                    <button
                      onClick={() => {
                        setVacationToDelete(v.id);
                        setShowConfirm(true);
                      }}
                      className="delete-btn"
                    >
                    </button>
                    {errors.vacations?.[v.id] && (
                      <p className="error-message">{errors.vacations[v.id]}</p>
                    )}
                  </>
                )}
                <div className="card-content">
                  <h5>{v.destination}</h5>
                  <p>{v.description}</p>
                  <p>{formatDate(v.start_date)} - {formatDate(v.end_date)}</p>
                  <p>{v.price + "$"}</p>
                  <p>followers: {Number(v.followers)}</p>
                </div>
              </div>
            ))}

          </>
        )}
      </div>
      {token && (
        <div id="arrowsdiv">
          <button
            className="page-buttons"
            onClick={handlePrevious}
            disabled={page === 1}
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/forma-regular/24/left.png"
              alt="left"
            />
          </button>
          <p id="pages">{page} from {totalPages === 0 ? 1 : totalPages}</p>
          <button
            className="page-buttons"
            onClick={handleNext}
            disabled={page === totalPages}
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/forma-regular/24/right.png"
              alt="right"
            />
          </button>
        </div>
      )}

      {editVacation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EditVacation
              vacation={editVacation}
              onClose={(updatedVacation) => {
                if (updatedVacation) {
                  setVacations(prev =>
                    prev.map(v =>
                      v.id === updatedVacation.id ? { ...v, ...updatedVacation } : v
                    )
                  );
                }
                setEditVacation(null);
              }}
            />
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p id="sure">Are you sure you want to delete this vacation?</p>
            <div className="modal-buttons">
              <button
                onClick={async () => {
                  if (vacationToDelete !== null) await handleDelete(vacationToDelete);
                  setShowConfirm(false);
                  setVacationToDelete(null);
                }}
                className="confirm-btn"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setVacationToDelete(null);
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default Vacations;












import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import '../Components/Errors/Errors.css'
import Login from '../Components/Login/Login'
import Register from '../Components/Regiter/Register'
import Vacations from '../Components/Vacations/Vacations'
import AddVacation from '../Components/AddVacation/AddVacation'
import { useEffect, useState } from 'react'
import { getUserFromToken } from '../Auth/Auth'
import VacationsReport from '../Components/VacationsReport/VacationsReport'

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ isAdmin: boolean; userName?: string } | null>(null)
  
  useEffect(() => {
    setUser(getUserFromToken())
  }, [])

  function handleUserChange() {
    setUser(getUserFromToken())
  }
  function logout() {
    sessionStorage.clear();
    setUser(null);
    navigate("/login")

  }

  return (<>
    <nav className="menu">
      <div className="submenu">
        <ul>
          {!user?.userName && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}

          {user?.isAdmin && (
            <>
              <li><Link to="/vacations">Vacations</Link></li>
              <li><Link to="/add-vacation">Add Vacations</Link></li>
              <li><Link to="/vacations-followers">Vacations Reports</Link></li>
              <li className="hello-admin">Hello {user.userName}!</li>
              <button className="logout-btn-admin" onClick={logout}>log out</button>
            </>
          )}

          {user?.userName && !user.isAdmin && (
            <>
              <li className="hello-user">Hello {user.userName}!</li>
              <button className="logout-btn" onClick={logout}>log out</button>
            </>
          )}
        </ul>
      </div>
    </nav>


    <Routes>
      <Route path="/" element={user?.userName ? <Vacations /> : <Login onUserChange={handleUserChange} />} />
      <Route path="/login" element={<Login onUserChange={handleUserChange} />} />
      <Route path="/register" element={<Register onUserChange={handleUserChange} />} />
      <Route path="/vacations" element={<Vacations />} />
      <Route path="/add-vacation" element={<AddVacation />} />
      <Route path="/vacations-followers" element={<VacationsReport />} />
    </Routes>
  </>)
}

export default App


import { useEffect, useState } from "react";
import { fetchLogin } from "../../Api/ClientApi";
import { useNavigate } from "react-router-dom";
import './Login.css'
import '../Errors/Errors.css'
import { getUserFromToken } from "../../Auth/Auth";

interface LoginProps {
  onUserChange: () => void;
}

function Login({ onUserChange }: LoginProps) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [user, setUser] = useState<{ token: string; userName: string | undefined } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isloading, setIsloading] = useState<boolean>(false)

  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = sessionStorage.getItem("authToken");
    if (savedToken) {
      const user = getUserFromToken()
      setUser({ token: savedToken, userName: user?.userName });
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsloading(true)
    try {
      const res = await fetchLogin(formData);
      const token = res.data;

      sessionStorage.setItem("authToken", token);
      const user = getUserFromToken();
      const userName = user?.userName
      
      setUser({ token, userName });
      onUserChange(); 
      navigate("/vacations");
    } catch (err: any) {
  if (err.response) {
    if (err.response.status === 401) {
      setError("invalid email or password. please try again");
    } else {
      setError("network error. please try again");
    }
  }
}

finally{
  setIsloading(false)
}}


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  function navigateRegister(){
    navigate("/register")
  }

  return (
    <>
      {user ? (
        <div className="welcome-card">
          <h1>Welcome {user.userName}!</h1>
          <p>you are already loged in</p>
        </div>
      ) : (
        <>
          <h1 className="login-title">Login</h1>
          <form className="login-container" onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
            />
            <label>Password</label>
            <input
              name="password"
              minLength={4}
              value={formData.password}
              onChange={handleChange}
              type="password"
              required
            />
            {isloading ? <button disabled >Logging in...</button> : <button type="submit">Submit</button>}
            <div className="n-register">
            <p id="p-id">Don't have account yet?</p>
            <p className="n-register-button" onClick={navigateRegister}>Regiser Now</p>
            </div>
            {error && <p className="error-message">{error}</p>}
          </form>
        </>
      )}
    </>
  );
}

export default Login;



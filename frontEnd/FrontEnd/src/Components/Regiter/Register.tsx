import { useState } from 'react'
import './Register.css'
import { fetchRegister } from '../../Api/ClientApi';
import { useNavigate } from 'react-router-dom';
import './Register.css'
interface RegisterProps {
  onUserChange: () => void;
}
function Register({onUserChange}: RegisterProps) {
  {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  })
  const [isloading, setIsloading] = useState<boolean>(false)

 function handleChange(e: React.ChangeEvent<HTMLInputElement>){
    setFormData({ ...formData, [e.target.name]: e.target.value });
 }   
async function handleSubmit(e: React.FormEvent){
e.preventDefault();
setIsloading(true)
const res = await fetchRegister(formData);
if(res){
  console.log(res);
  sessionStorage.setItem("authToken", res.data.token);
  onUserChange(); 
  navigate("/vacations")
}
}
  return <>
  <h1 id='register-title'>Register</h1>
  <form id="register-container" onSubmit={handleSubmit}>
<label>First name</label>
<input name='first_name' value={formData.first_name} onChange={handleChange} required></input>
<label>Last name</label>
<input name='last_name' value= {formData.last_name} onChange={handleChange} required></input>
<label>Email</label>
<input name='email' value = {formData.email} onChange={handleChange} type='email' required></input>
<label>Password</label>
<input name='password' minLength={4} value={formData.password} onChange={handleChange} type='password' required></input>
{isloading ? <button disabled >Logging in...</button> : <button type="submit">Submit</button>}
  </form>
  
  </>
}
}

export default Register
import React, { useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import { login } from "../../services/users";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from '../../providers/AuthProvider';

function Login() {
  // state members to get input from user
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // get the user details from AuthContext
  const { setUser } = useAuthContext();

  //get reference of the navigate object
  const navigate = useNavigate();

  const onLogin = async () => {
    if (email.length == 0) {
      toast.warn("Please enter Email.");
    } else if (password.length == 0) {
      toast.warn("Please enter Password");
    } else {
      const result = await login(email, password);

      // check if user can login successfully
      if (result["status"] == 200) {
        // read the user's data
        const data = result["data"];

        // cache the user data using either SessionStorage and LocalStorage
        sessionStorage["token"] = data["token"];
        //cache the required data
        sessionStorage.setItem("name", `${data["firstName"]} ${data["lastName"]}`);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("user", JSON.stringify({
          firstName: data['firstName'],
          lastName: data['lastName'],
        }))

        toast.success("Welcome to the food ordering application");
        // update the AuthContext
        setUser({
          firstName: data['firstName'],
          lastName: data['lastName'],
        })
        //go to home page
        navigate("/app/products");
      } else {
        toast.error(result["error"]);
      }
    }
  };

  return (
    <>
    <div className="container">
      <h2 className="page-header">Login</h2>
      <div className="login-form">
        <div className="mb-3">
          <label htmlFor="">Email</label>
          <input
            type="email"
            className="form-control"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="">Password</label>
          <input
            type="password"
            className="form-control"
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <div className="mb-3">
            Don't have account yet? <Link to='/register'>Register here</Link>
          </div>
          <button className="btn btn-success" onClick={onLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;

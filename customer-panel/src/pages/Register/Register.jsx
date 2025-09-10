import React, { useState } from "react";
import "./Register.css";
import { toast } from "react-toastify";
import { registerUser } from "../../services/users";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  //get reference of the navigate object
  const navigate = useNavigate();

  // state members to get input from user
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onRegister = async () => {
    if (firstName.length == 0) {
      toast.warn("Please enter First Name.");
    } else if (lastName.length == 0) {
      toast.warn("Please enter Last Name.");
    } else if (email.length == 0) {
      toast.warn("Please enter Email.");
    } else if (password.length == 0) {
      toast.warn("Please enter Password.");
    } else if (confirmPassword.length == 0) {
      toast.warn("Please enter Confirm Password.");
    } else if (confirmPassword != password) {
      toast.warn("Password does not match.");
    } else {
      const result = await registerUser(firstName, lastName, email, password);
      if (result["status"] == "200") {
        toast.success("Successfully registered a new user.");
        //go to login page
        navigate("/");

        //going back to the previous page - work same as navigate("/");
        //navigate(-1);
      } else {
        toast.error(result["error"]);
      }
    }
  };

  return (
    <div className="container">
      <h2 className="page-header">Register</h2>
      <div className="register-form">
        <div className="mb-3">
          <label htmlFor="">First Name</label>
          <input
            type="text"
            className="form-control"
            onChange={(event) => setFirstName(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="">Last Name</label>
          <input
            type="text"
            className="form-control"
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>
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
          <label htmlFor="">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <div className="mb-3">Already have an account? <Link to="/"> Login here</Link></div>
          <button className="btn btn-success" onClick={onRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;

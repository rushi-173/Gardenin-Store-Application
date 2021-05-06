import "./Login.css";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { useToast } from "../../contexts/toast-context";
import Loader from "react-loader-spinner";
import axios from "axios";
import {   useNavigate } from "react-router-dom";

export function Login() {
  const { auth, showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuth();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const params = useLocation();

  async function handleSignIn(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.post(
        "https://gardenin-store-backend-v030.rushi173.repl.co/auth/login",
        {
          email: email,
          password: password
        }
      );
      console.log(res);
      setIsLoading(false);
      if (!res.data.token) {
        setError(res.data);
      } else {
        showToast("Login Successful","Let's Explore the Shop!", "success");
        setAuth(res.data);
        setAuth((prev) => {
          localStorage.setItem("auth", JSON.stringify(prev));
          return prev;
        });
        setEmail("");
        setPassword("");
		if (params.state) {
            navigate(params.state.from);
        }else{
			navigate("/")
		}
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  return (
    <div className="Login container-center">
      <div className="container-center container-column login-form-container">
        <h2>Login</h2>
        <form className="basic-form-container container-column">
          <div className="basic-input-group">
            <label for="email">
              Email: <span style={{ color: "red" }}>*</span>
            </label>
            <input
              id="email"
              type="text"
              className="input-area"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="basic-input-group">
            <label for="password">
              Password: <span style={{ color: "red" }}>*</span>
            </label>
            <input
              id="password"
              type="password"
              className="input-area"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <small className="err-msg"></small>
          </div>
          <button className="btn btn-primary btn-login" onClick={handleSignIn}>
            {isLoading ? (
              <Loader type="TailSpin" color="#fff" height={20} width={20} />
            ) : (
              "Login"
            )}
          </button>
          <small className="err-msg">{error}</small>
          <div className="container-space-between btn-login">
            <Link to="/signup">
              <p>Register Now 🚀</p>
            </Link>
            <p>🤔 Forgot Password?</p>
          </div>
          <hr color="white" width="100%" className="btn-login" />
          <br />
          <p>
            <u>Or Login With</u>
          </p>
          <div className="container-space-between social-login btn-login">
            <button class="btn btn-facebook" disabled>
              Facebook
              <i class="fa fa-facebook icon-right" aria-hidden="true"></i>
            </button>
            <button class="btn btn-twitter" disabled>
              Twitter<i class="fa fa-twitter icon-right" aria-hidden="true"></i>
            </button>
            <button class="btn btn-google" disabled>
              Google
              <i class="fa fa-google-plus icon-right" aria-hidden="true"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
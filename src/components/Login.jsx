import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import guestUserData from "../guestUserData";
import NavBar from "./NavBar";

function Login() {
  const [usercontext, setUserContext] = useContext(UserContext);
  const navigate = useNavigate();

  function handleGuestUser() {
    setUserContext(guestUserData);
    navigate("/dashboard");
  }

  console.log(guestUserData);

  return (
    <>
      <NavBar />
      <div className="login">
        <div className="login-left">
          <img src="https://picsum.photos/500" />
        </div>
        <div className="login-right">
          <div>
            <h2>Hello again!</h2>
            <p>Welcome back,</p>
            <p>you were missed</p>
          </div>
          <button>Log in with Google</button>
          <div className="separator"></div>
          <div>
            <input type="email" placeholder="email"></input>
            <input type="password" placeholder="password"></input>
            <button>Log in</button>
            <div className="separator"></div>
            <span className="signup-link">
              New here? <Link to="/signup">Sign up</Link>
            </span>
          </div>
          <button onClick={handleGuestUser}>Login as a guest</button>
        </div>
      </div>
    </>
  );
}

export default Login;

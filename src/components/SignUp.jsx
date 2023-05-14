import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import guestUserData from "../guestUserData";
import NavBar from "./NavBar";

function SignUp() {
  const [usercontext, setUserContext] = useContext(UserContext);

  function handleGuestUser() {
    setUserContext(guestUserData);
    console.log("potato");
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
            <h2>Hello!</h2>
            <p>Welcome to habital,</p>
            <p>it's great to have you here</p>
          </div>
          <button>Sign in with Google</button>
          <div className="separator"></div>
          <div>
            <input type="email" placeholder="email"></input>
            <input type="password" placeholder="password"></input>
            <button>Sign in</button>
            <div className="separator"></div>
            <span className="signup-link">
              Already have an account? <Link to="/login">Log in</Link>
            </span>
          </div>
          <button onClick={handleGuestUser}>Login as a guest</button>
        </div>
      </div>
    </>
  );
}

export default SignUp;

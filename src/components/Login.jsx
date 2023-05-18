import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import guestUserData from "../guestUserData";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { db } from "../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";

function Login() {
  const [userContext, setUserContext] = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const usersCollectionRef = collection(db, "users");

  onAuthStateChanged(auth, (currentUser) => {
    setUserContext(currentUser);
  });

  function handleGuestUser() {
    setUserContext(guestUserData);
    navigate("/dashboard");
  }

  const handleLoginWithEmail = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const data = await getDocs(
        query(
          usersCollectionRef,
          where("user.id", "==", userCredential.user.uid)
        )
      );
      if (!data.empty) {
        const userDoc = data.docs[0].data();
        setUserContext(userDoc);
      } else {
        console.log("No matching documents found.");
      }
    } catch (error) {
      console.log(error.message);
    }
    navigate("/home");
  };

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const data = await getDocs(
        query(
          usersCollectionRef,
          where("user.id", "==", userCredential.user.uid)
        )
      );
      if (!data.empty) {
        const userDoc = data.docs[0].data();
        setUserContext(userDoc);
      } else {
        console.log("No matching documents found.");
      }
    } catch (error) {
      console.log(error.message);
    }
    navigate("/home");
  };

  return (
    <>
      <div className="login">
        <div className="login-left">
          <img src="https://picsum.photos/500" />
        </div>
        <div className="login-right">
          <div>
            <h2>{`Hello again ${userContext?.email}!`}</h2>
            <p>Welcome back,</p>
            <p>you were missed</p>
          </div>
          <button onClick={handleLoginWithGoogle}>Log in with Google</button>
          <div className="separator"></div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button onClick={handleLoginWithEmail}>Log in</button>
            {error && <p className="error-message">{error}</p>}
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

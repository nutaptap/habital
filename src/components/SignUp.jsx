import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import guestUserData from "../guestUserData";
import newUserData from "../newUserData";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { db } from "../firebase-config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

function SignUp() {
  const [userContext, setUserContext] = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const usersCollectionRef = collection(db, "users");

  function handleGuestUser() {
    setUserContext(guestUserData);
    navigate("/dashboard");
  }

  const handleSignUpWithEmail = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const newUser = {
        id: userCredential.user.uid,
        name: email,
        picture: "https://picsum.photos/200",
        email: email,
      };

      await addDoc(usersCollectionRef, { ...newUserData, user: newUser });

      const data = await getDocs(
        query(usersCollectionRef, where("user.id", "==", newUser.id))
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

  const handleSignUpWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);

      const newUser = {
        id: userCredential.user.uid,
        name: userCredential.user.displayName,
        picture: userCredential.user.photoURL,
        email: userCredential.user.email,
      };

      const querySnapshot = await getDocs(
        query(usersCollectionRef, where("user.id", "==", newUser.id))
      );

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        setUserContext(userDoc);
      } else {
        await addDoc(usersCollectionRef, { ...newUserData, user: newUser });
        setUserContext(newUser);
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
            <h2>Hello!</h2>
            <p>Welcome to habital,</p>
            <p>it's great to have you here</p>
          </div>
          <button onClick={handleSignUpWithGoogle}>Sign up with Google</button>
          <div className="separator"></div>
          <div>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            ></input>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            ></input>
            <button onClick={handleSignUpWithEmail}>Sign up</button>
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

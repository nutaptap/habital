import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";

function Home() {
  const user = useContext(UserContext);

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Sign up</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/habits">Habits</Link>
          </li>
          <li>
            <Link to="/habit/1234">Habit</Link>
          </li>
        </ul>
      </nav>
      <h1>Home</h1>
      <p>{user.user.name}</p>
    </>
  );
}

export default Home;

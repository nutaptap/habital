import { useContext } from "react";
import { UserContext } from "../App";
import { Link } from "react-router-dom";

function NavBar() {
  const [context, setContext] = useContext(UserContext);
  const user = context;

  return (
    <div className="nav-container">
      <nav>
        <div className="nav-left">
          <Link to="/">
            <div>
              <img src="https://picsum.photos/200" />
              <h4>habital</h4>
            </div>
          </Link>
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/habits">Habits</Link>
            </li>
          </ul>
        </div>
        {user.user.name === undefined && (
          <div className="nav-right">
            <Link to="/login">Login</Link>
            <div className="nav-divider" />
            <Link to="/signup">Sign up</Link>
          </div>
        )}
        {user.user.name !== undefined && (
          <div className="nav-right">
            <img src={user.user.picture} />
            <a>{user.user.name}</a>
          </div>
        )}
      </nav>
    </div>
  );
}

export default NavBar;

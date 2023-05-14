import { useContext, useRef, useState, useEffect } from "react";
import { UserContext } from "../App";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const [usercontext, setUserContext] = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && menuRef.current.contains(event.target) === false) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
  }, []);

  function handleUser() {
    setShowMenu(true);
  }

  function handleLogout() {
    setUserContext(undefined);
    setShowMenu(false);
    navigate("/home");
  }

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
              {usercontext !== undefined && (
                <Link to="/dashboard">Dashboard</Link>
              )}
              {usercontext === undefined && <Link to="/login">Dashboard</Link>}
            </li>
            <li>
              {usercontext !== undefined && <Link to="/habits">Habits</Link>}
              {usercontext === undefined && <Link to="/login">Habts</Link>}
            </li>
          </ul>
        </div>
        {usercontext === undefined && (
          <div className="nav-right">
            <Link to="/login">Login</Link>
            <div className="nav-divider" />
            <Link to="/signup">Sign up</Link>
          </div>
        )}
        {usercontext !== undefined && (
          <div className="nav-right">
            <img src={usercontext.user.picture} />
            <button onClick={handleUser}>{usercontext.user.name}</button>
            {showMenu && (
              <div className="menu" ref={menuRef}>
                <button onClick={handleLogout}>Log out</button>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}

export default NavBar;

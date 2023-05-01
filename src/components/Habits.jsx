import { useContext } from "react";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";

function Habits() {
  const [context, setContext] = useContext(UserContext);
  const user = context;

  return (
    <>
      <NavBar />
      <div className="habits">
        <div className="habits-container">
          {user.habits.map((habit) => {
            return (
              <Link key={habit.id} to={`/habit/${habit.id}`}>
                <figure>
                  <img alt={habit.name} src={habit.icon} />
                  <figcaption>{habit.name}</figcaption>
                </figure>
              </Link>
            );
          })}
          <Link to={`/habit/new`}>
            <figure>
              <img alt="Add a new habit" src="https://picsum.photos/250" />
              <figcaption>New habit</figcaption>
            </figure>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Habits;

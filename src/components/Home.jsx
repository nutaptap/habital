import { useContext } from "react";
import { UserContext } from "../App";
import NavBar from "./NavBar";

function Home() {
  const user = useContext(UserContext);

  return (
    <div className="home">
      <NavBar />
      <div className="home-container">
        <div className="home-left">
          <h2>Discover your full potential with Habital</h2>
          <p>
            With customizable habits and detailed insights, Habital provides you
            with the tools you need to stay motivated and achieve your goals.
            Take control of your habits with Habital, the habit tracker app that
            empowers you to create new habits and break bad ones.
          </p>
          <button type="button">Get started</button>
        </div>
        <img src="https://picsum.photos/400" />
      </div>
    </div>
  );
}

export default Home;

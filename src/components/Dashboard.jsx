import { useContext } from "react";
import { UserContext } from "../App";

function Dashboard() {
  const user = useContext(UserContext);

  return (
    <>
      <h1>Dashboard</h1>
      <p>{user.user.name}</p>
    </>
  );
}

export default Dashboard;

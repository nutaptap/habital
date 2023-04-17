import { useParams } from "react-router-dom";

function Habit() {
  let { habitId } = useParams();

  return (
    <>
      <h1>Habit</h1>
      <p>{habitId}</p>
    </>
  );
}

export default Habit;

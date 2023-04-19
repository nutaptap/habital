import { useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../App";
import { LineChart } from "react-chartkick";
import "chartkick/chart.js";
import NavBar from "./NavBar";

function Habit() {
  const { habitId } = useParams();
  const user = useContext(UserContext);
  const [habit, setHabit] = useState(null);
  const [time, setTime] = useState(null);
  const [name, setName] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const habit = user.habits.find((habit) => habit.id === habitId);
    setHabit(habit);
    setTime(habit.time);
    setName(habit.name);
    setSchedule(habit.shedule);

    const weeklyData = {};

    habit.completed.forEach((date) => {
      const d = new Date(date * 1000);
      const weekStart = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate() - d.getDay() + 1
      );
      const key = `${weekStart.getFullYear()}-${
        weekStart.getMonth() + 1
      }-${weekStart.getDate()}`;
      if (key in weeklyData) {
        weeklyData[key] += 1;
      } else {
        weeklyData[key] = 1;
      }
    });

    setChartData(weeklyData);
  }, [user]);

  function handleName(event) {
    setName(event.target.value);
  }

  function handleIncrease() {
    time < 481 && setTime(time + 1);
  }

  function handleDecrease() {
    time >= 1 && setTime(time - 1);
  }

  const handleSchedule = (event) => {
    if (event.target.innerText === "M") {
      if (schedule.indexOf(1) !== -1) {
        const updatedSchedule = [...schedule];
        const index = schedule.indexOf(1);
        updatedSchedule.splice([index], 1);
        setSchedule(updatedSchedule);
      } else {
        const updatedSchedule = [...schedule, 1];
        setSchedule(updatedSchedule);
      }
    }
  };

  function handleSave() {
    const updatedUser = { ...user };
    const habitIndex = updatedUser.habits.findIndex(
      (habit) => habit.id === habitId
    );
    updatedUser.habits[habitIndex].time = time;
    updatedUser.habits[habitIndex].name = name;
    setUser(updatedUser);
  }

  if (!habit) {
    return <div></div>;
  }

  return (
    <>
      <NavBar />
      <div className="habit">
        <div className="habit-container">
          <input type="text" defaultValue={habit.name} onChange={handleName} />
          <div className="habit-content">
            <div className="habit-left">
              <div>
                <img alt={habit.name} src={habit.icon} />
              </div>
              <div>
                <h3>Repeats every:</h3>
                <div>
                  <button
                    type="button"
                    className={
                      schedule && schedule.find((day) => day === 1)
                        ? "active"
                        : ""
                    }
                    onClick={handleSchedule}
                  >
                    M
                  </button>
                  <button
                    type="button"
                    className={
                      schedule && schedule.find((day) => day === 2)
                        ? "active"
                        : ""
                    }
                    onClick={handleSchedule}
                  >
                    T
                  </button>
                  <button
                    type="button"
                    className={
                      schedule && schedule.find((day) => day === 3)
                        ? "active"
                        : ""
                    }
                    onClick={handleSchedule}
                  >
                    W
                  </button>
                  <button
                    type="button"
                    className={
                      schedule && schedule.find((day) => day === 4)
                        ? "active"
                        : ""
                    }
                    onClick={handleSchedule}
                  >
                    T
                  </button>
                  <button
                    type="button"
                    className={
                      schedule && schedule.find((day) => day === 5)
                        ? "active"
                        : ""
                    }
                    onClick={handleSchedule}
                  >
                    F
                  </button>
                  <button
                    type="button"
                    className={
                      schedule && schedule.find((day) => day === 6)
                        ? "active"
                        : ""
                    }
                    onClick={handleSchedule}
                  >
                    S
                  </button>
                  <button
                    type="button"
                    className={
                      schedule && schedule.find((day) => day === 7)
                        ? "active"
                        : ""
                    }
                    onClick={handleSchedule}
                  >
                    S
                  </button>
                </div>
              </div>
              <div>
                <h3>Time to complete:</h3>
                <div>
                  <p className="time">{time}</p>
                  <div className="button-container">
                    <button type="button" onClick={handleIncrease}>
                      +
                    </button>
                    <button type="button" onClick={handleDecrease}>
                      -
                    </button>
                  </div>
                  <p>minutes</p>
                </div>
              </div>
            </div>
            <div className="habit-right">
              <LineChart data={chartData} />
              <button type="button" onClick={handleSave}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Habit;

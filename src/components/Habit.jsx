import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../App";
import { LineChart } from "react-chartkick";
import "chartkick/chart.js";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

function Habit() {
  const { habitId } = useParams();
  const [context, setContext] = useContext(UserContext);
  const user = context;
  const [habit, setHabit] = useState(null);
  const [time, setTime] = useState(null);
  const [name, setName] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [chartData, setChartData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (habitId === "new") {
      const uuid = uuidv4();
      const newHabit = {
        id: uuid,
        icon: "https://picsum.photos/250",
        name: "New habit",
        time: 0,
        schedule: [],
        completed: [],
      };
      const today = new Date().toISOString().slice(0, 10);
      setChartData({ [today]: 0 });
      newHabit.completed = today;
      setHabit(newHabit);
      setTime(newHabit.time);
      setName(newHabit.name);
      setSchedule(newHabit.schedule);
    } else {
      const habit = user.habits.find((habit) => habit.id === habitId);
      setHabit(habit);
      setTime(habit.time);
      setName(habit.name);
      setSchedule(habit.schedule);
      const weeklyData = {};

      if (habit.completed.length === 0) {
        const today = new Date().toISOString().slice(0, 10);
        setChartData({ [today]: 0 });
      } else {
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
      }
    }
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
    const day = parseInt(event.target.dataset.value);

    if (schedule.indexOf(day) !== -1) {
      const updatedSchedule = [...schedule];
      const index = schedule.indexOf(day);
      updatedSchedule.splice([index], 1);
      setSchedule(updatedSchedule);
    } else {
      const updatedSchedule = [...schedule, day];
      setSchedule(updatedSchedule);
    }
  };

  function handleSave(event) {
    const updatedUser = { ...user };
    const habitIndex = updatedUser.habits.findIndex(
      (habit) => habit.id === habitId
    );

    if (habitIndex === -1) {
      const newHabit = {
        id: habit.id,
        icon: habit.icon,
        name: name,
        schedule: schedule,
        completed: [],
        time: time,
      };
      updatedUser.habits.push(newHabit);
    } else {
      updatedUser.habits[habitIndex].name = name;
      updatedUser.habits[habitIndex].time = time;
      updatedUser.habits[habitIndex].schedule = schedule;
    }

    setContext(updatedUser);
    navigate(`/habit/${habit.id}`);
  }

  function renderButtons() {
    const buttons = ["M", "T", "W", "T", "F", "S", "S"];
    const buttonElements = [];
    for (let i = 0; i < buttons.length; i++) {
      const buttonValue = i + 1;
      const isActive = schedule && schedule.find((day) => day === buttonValue);
      buttonElements.push(
        <button
          key={buttonValue}
          type="button"
          data-value={buttonValue}
          className={isActive ? "active" : ""}
          onClick={handleSchedule}
        >
          {buttons[i]}
        </button>
      );
    }
    return buttonElements;
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
                <div>{renderButtons()}</div>
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

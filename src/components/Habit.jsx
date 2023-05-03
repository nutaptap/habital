import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../App";
import { LineChart } from "react-chartkick";
import "chartkick/chart.js";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

function Habit() {
  const { habitURL } = useParams();
  const [userContext, setUserContext] = useContext(UserContext);
  const [habit, setHabit] = useState(null);
  const [chartData, setChartData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (habitURL === "new") {
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
    } else {
      const currentHabit = userContext.habits.find(
        (habit) => habit.id === habitURL
      );
      setHabit(currentHabit);
    }
  }, [userContext]);

  useEffect(() => {
    if (habit && habitURL !== "new") {
      const dates = habit.completed
        .sort((a, b) => a - b)
        .map((date) => {
          return new Date(date * 1000);
        });

      const weekSet = new Set();
      const startDate = moment(dates[0]);
      const currentDate = moment();

      while (startDate.isSameOrBefore(currentDate)) {
        weekSet.add(startDate.isoWeek());
        startDate.add(1, "days");
      }
      const weeks = Array.from(weekSet).reduce((acc, curr) => {
        acc[curr] = 0;
        return acc;
      }, {});

      dates.forEach((date) => {
        const weekNumber = moment(date).isoWeek();
        weeks.hasOwnProperty(weekNumber) && weeks[weekNumber]++;
      });

      const formattedWeeks = {};

      for (const week in weeks) {
        const value = weeks[week];
        const monday = moment()
          .isoWeek(Number(week))
          .startOf("isoWeek")
          .format("YYYY-MM-DD");
        formattedWeeks[monday] = value;
      }

      setChartData(formattedWeeks);
    }
  }, [habit]);

  function handleName(event) {
    setHabit({ ...habit, name: event.target.value });
  }

  function handleIncrease() {
    habit.time < 481 && setHabit({ ...habit, time: habit.time + 1 });
  }

  function handleDecrease() {
    habit.time >= 1 && setHabit({ ...habit, time: habit.time - 1 });
  }

  const handleSchedule = (event) => {
    const day = parseInt(event.target.dataset.value);

    if (habit.schedule.indexOf(day) !== -1) {
      const updatedSchedule = [...habit.schedule];
      const index = habit.schedule.indexOf(day);
      updatedSchedule.splice([index], 1);
      setHabit({ ...habit, schedule: updatedSchedule });
    } else {
      const updatedSchedule = [...habit.schedule, day];
      setHabit({ ...habit, schedule: updatedSchedule });
    }
  };

  function handleSave() {
    const updatedUser = { ...userContext };
    const habitIndex = updatedUser.habits.findIndex(
      (habit) => habit.id === habitURL
    );

    if (habitIndex === -1) {
      const newHabit = {
        id: habit.id,
        icon: habit.icon,
        name: habit.name,
        schedule: habit.schedule,
        completed: [],
        time: habit.time,
      };
      updatedUser.habits.push(newHabit);
    } else {
      updatedUser.habits[habitIndex].name = habit.name;
      updatedUser.habits[habitIndex].icon = habit.icon;
      updatedUser.habits[habitIndex].schedule = habit.schedule;
      updatedUser.habits[habitIndex].time = habit.time;
    }

    setUserContext(updatedUser);
    navigate(`/habit/${habit.id}`);
  }

  function renderButtons() {
    const buttons = ["M", "T", "W", "T", "F", "S", "S"];
    const buttonElements = [];
    for (let i = 0; i < buttons.length; i++) {
      const buttonValue = i + 1;
      const isActive =
        habit.schedule && habit.schedule.find((day) => day === buttonValue);
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
                  <p className="time">{habit.time}</p>
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

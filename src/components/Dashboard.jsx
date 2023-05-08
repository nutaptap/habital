import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import NavBar from "./NavBar";
import { LineChart } from "react-chartkick";
import "chartkick/chart.js";
import moment from "moment";

function Dashboard() {
  const [userContext, setUserContext] = useContext(UserContext);
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(
    Number(moment(today).format("DD"))
  );
  const [chartData, setChartData] = useState({});
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    let dates = [];
    userContext.habits.forEach((habit) => {
      dates = dates.concat(habit.completed);
    });
    dates = dates
      .sort((a, b) => a - b)
      .map((date) => {
        return new Date(date * 1000);
      });
    const weekSet = new Set();
    const iDate = moment(dates[0]);
    const currentDate = moment();

    while (iDate.isSameOrBefore(currentDate.endOf("day"))) {
      weekSet.add(iDate.isoWeek());
      iDate.add(1, "days");
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
    setCurrentStreak(0);

    let streak = 0;
    let lastDate = null;

    for (let i = dates.length - 1; i >= 0; i--) {
      if (moment().diff(moment(dates[i]), "days") > 1) {
        break;
      } else if (lastDate !== moment(dates[i]).format("YYYY-MM-DD")) {
        lastDate = moment(dates[i]).format("YYYY-MM-DD");
        streak++;
      }
    }

    setCurrentStreak(streak);
  }, [userContext]);

  function handleSelect(event) {
    const selected = Number(event.target.closest("[data-value]").dataset.value);
    setSelectedDay(selected);
  }

  function renderButtons() {
    const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
    const mondayDate = Number(moment(today).startOf("isoWeek").format("DD"));
    const buttonElements = [];
    for (let i = 0; i < weekDays.length; i++) {
      const buttonValue =
        mondayDate + i < 10 ? `0${mondayDate + i}` : `${mondayDate + i}`;
      const isSelected = selectedDay === Number(buttonValue);
      buttonElements.push(
        <button
          key={buttonValue}
          data-value={buttonValue}
          className={isSelected ? "selected" : ""}
          onClick={handleSelect}
        >
          <div>{buttonValue}</div>
          <div>{weekDays[i]}</div>
        </button>
      );
    }
    return buttonElements;
  }

  function handleCheckbox(event) {
    const updatedUser = { ...userContext };
    const habit = userContext.habits.filter(
      (element) => element.id === event.target.id
    );
    const habitIndex = userContext.habits.findIndex(
      (element) => element.id === event.target.id
    );
    const completed = habit[0].completed;
    const lastCompleted = moment(
      new Date(completed[completed.length - 1] * 1000)
    ).format("YYYY-MM-DD");
    const isCompletedToday = lastCompleted === moment().format("YYYY-MM-DD");
    if (isCompletedToday) {
      updatedUser.habits[habitIndex] = {
        ...habit[0],
        completed: completed.slice(0, completed.length - 1),
      };
    } else {
      updatedUser.habits[habitIndex] = {
        ...habit[0],
        completed: [...completed, Math.floor(new Date() / 1000)],
      };
    }
    setUserContext(updatedUser);
  }

  function renderView() {
    const selectedWeekDay = moment(today).date(selectedDay).isoWeekday();
    const isCurrentDay = selectedDay === Number(moment(today).format("DD"));
    const habits = userContext.habits.filter((habit) =>
      habit.schedule.includes(selectedWeekDay)
    );
    const selectedFullDay = moment(today)
      .date(selectedDay)
      .format("YYYY-MM-DD");
    const habitsList = habits.map((habit) => {
      return (
        <div className="habit-check" key={habit.name}>
          <input
            type="checkbox"
            checked={habit.completed
              .map((date) => moment(new Date(date * 1000)).format("YYYY-MM-DD"))
              .includes(selectedFullDay)}
            disabled={isCurrentDay ? false : true}
            id={habit.id}
            name={habit.id}
            onChange={handleCheckbox}
          ></input>
          <label htmlFor={habit.id} className={isCurrentDay ? "" : "disabled"}>
            {habit.name}
          </label>
        </div>
      );
    });
    return habitsList;
  }

  return (
    <>
      <NavBar />
      <p>{currentStreak}</p>
      <div className="dashboard">
        <div className="dashboard-left">
          <h2>
            {today.toLocaleString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </h2>
          <div className="dashboard-week">{renderButtons()}</div>
          <div className="dashboard-view">{renderView()}</div>
        </div>
        <div className="dashboard-right">
          <LineChart data={chartData} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;

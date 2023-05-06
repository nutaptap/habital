import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import NavBar from "./NavBar";
import { LineChart } from "react-chartkick";
import "chartkick/chart.js";
import moment from "moment";

function Dashboard() {
  const [userContext, setUserContext] = useContext(UserContext);
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDay());
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const dates = userContext.stats.completed
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

  function renderView() {
    const habits = userContext.habits.filter((habit) =>
      habit.schedule.includes(selectedDay)
    );
    const habitsList = habits.map((habit) => {
      return (
        <div className="habit-check" key={habit.name}>
          <input type="checkbox" id={habit.name} name={habit.name}></input>
          <label for={habit.name}>{habit.name}</label>
        </div>
      );
    });
    return habitsList;
  }

  return (
    <>
      <NavBar />
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

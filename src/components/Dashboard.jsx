import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import NavBar from "./NavBar";
import { LineChart } from "react-chartkick";
import "chartkick/chart.js";
import moment from "moment";

function Dashboard() {
  const [userContext, setUserContext] = useContext(UserContext);
  const today = new Date();
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
    console.log(weekSet);
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
          <div className="dashboard-week">buttons</div>
          <div>View</div>
        </div>
        <div className="dashboard-right">
          <LineChart data={chartData} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;

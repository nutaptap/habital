import { v4 as uuidv4 } from "uuid";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import moment from "moment";
import { LineChart } from "react-chartkick";
import "chartkick/chart.js";
import { UserContext } from "../App";
import NavBar from "./NavBar";
import { db } from "../firebase-config";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import boo from "../icons/boo.avif";
import fries from "../icons/fries.avif";
import hair from "../icons/hair.avif";
import sheep from "../icons/sheep.avif";

const iconImages = {
  boo,
  fries,
  hair,
  sheep,
};

function Habit() {
  const [habit, setHabit] = useState(null);
  const [chartData, setChartData] = useState({});
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [userContext, setUserContext] = useContext(UserContext);
  const { habitURL } = useParams();
  const navigate = useNavigate();
  const usersCollectionRef = collection(db, "users");

  function createNewHabit() {
    const uuid = uuidv4();
    const newHabit = {
      id: uuid,
      icon: "fries",
      name: "New habit",
      time: 0,
      schedule: [],
      completed: [],
    };
    const today = new Date().toISOString().slice(0, 10);
    setChartData({ [today]: 0 });
    newHabit.completed = today;
    setHabit(newHabit);
  }

  function setCurrentHabit() {
    const currentHabit = userContext.habits.find(
      (element) => element.id === habitURL
    );
    setHabit(currentHabit);
  }

  useEffect(() => {
    if (habitURL === "new") {
      createNewHabit();
    } else {
      setCurrentHabit();
    }
  }, [userContext]);

  function createChart() {
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
  }

  function createStreakCounters() {
    if (habit && Array.isArray(habit.completed)) {
      setCurrentStreak(0);
      setBestStreak(habit.best ? habit.best : 0);

      const dates = habit.completed.sort((a, b) => a - b);
      let streak = 0;
      let lastDate = null;

      for (let i = dates.length - 1; i >= 0; i--) {
        if (moment().diff(moment(new Date(dates[i] * 1000)), "days") >= 1) {
          break;
        } else if (lastDate !== moment(dates[i]).format("YYYY-MM-DD")) {
          lastDate = moment(new Date(dates[i] * 1000)).format("YYYY-MM-DD");
          streak++;
        }
      }

      setCurrentStreak(streak);

      if (streak > bestStreak) {
        setBestStreak(streak);
      }
    }
  }

  useEffect(() => {
    createChart();
    createStreakCounters();
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

  const handleSetSchedule = (event) => {
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

    if (updatedUser.user.id === 1) {
      navigate(`/habit/${habit.id}`);
      return;
    }

    async function updateUserData() {
      const querySnapshot = await getDocs(
        query(usersCollectionRef, where("user.id", "==", updatedUser.user.id))
      );
      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        await setDoc(userDocRef, updatedUser);
      }
    }

    updateUserData();

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
          onClick={handleSetSchedule}
        >
          {buttons[i]}
        </button>
      );
    }
    return buttonElements;
  }

  function handleRemove() {
    const updatedUser = { ...userContext };
    const habitIndex = updatedUser.habits.findIndex(
      (habit) => habit.id === habitURL
    );

    if (habitIndex !== -1) {
      updatedUser.habits.splice(habitIndex, 1);
      setUserContext(updatedUser);
    }

    async function deleteHabitFromDatabase() {
      const querySnapshot = await getDocs(
        query(usersCollectionRef, where("user.id", "==", updatedUser.user.id))
      );
      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        await deleteDoc(collection(userDocRef, "habits", habitURL));
      }
    }

    deleteHabitFromDatabase();

    navigate("/habits");
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
                <img alt={habit.name} src={iconImages[habit.icon]} />
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
              <button type="button" onClick={handleSave}>
                Save changes
              </button>
            </div>
            <div className="habit-right">
              <div className="streak-counters">
                <div>
                  <p>{currentStreak}</p>
                  <p>Current</p>
                </div>
                <div>
                  <p>{bestStreak}</p>
                  <p>Best</p>
                </div>
              </div>
              <LineChart data={chartData} />
              <button type="button" onClick={handleRemove}>
                Remove habit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Habit;

import React, { useEffect, useState } from "react";
import { IconButton, Paper, Typography, Container, Box, Fab, colors } from "@mui/material";
import { Link, useAsyncValue, useParams } from "react-router-dom";
import { getUserFromLocalStorage, logout } from "../store/store";
import CalendarService from "../API/CalendarsService";
import { DateCalendar } from '@mui/x-date-pickers';
import dayjs from "dayjs";
import "./Calendar.css";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Directions, TodayRounded } from "@mui/icons-material";
import DayMenu from "../components/Calendars/DayMenu";
import EditIcon from '@mui/icons-material/Edit';
import { useContextProvider } from "../components/ContextProvider";
import CalendarEditMenu from "../components/Calendars/CalendarEditmenu";
import EventsService from "../API/EventsService";


const Calendar = () => {
    const arrangementColor = "orange";
    const reminderColor = "red";
    const taskColor = "blue";
    const holidayColor = "green";
    const otherColor = "purple";
    // Array to hold the days of the week
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const daysInMonthF = (year, month) => new Date(year, month + 1, 0).getDate();

    // const [calendarData, setCalendarData] = useState([]);
    const [day, setday] = useState(new Date());
    const [showType, setType] = useState("month");
    const { id } = useParams();
    const { setCalendarId } = useContextProvider();
    const { calendarData, setCalendarData } = useContextProvider();

    const year = day.getFullYear();
    const month = day.getMonth();

    const [chosenDate, setChosenDate] = useState(new Date());
    const [showForm, setShowForm] = useState(false);
    const [showCalendarEditForm, setShowCalendarEditForm] = useState(false);

    const cellClick = (e) => {
        setChosenDate(new Date(year, month, e.target.innerHTML.split('<')[0]));
        setShowForm(true);
    }

    const getCalendarData = () => {
        const year = day.getFullYear();
        const month = String(day.getMonth() + 1).padStart(2, '0');
        const day_ = String(day.getDate()).padStart(2, '0');
        CalendarService.getcalendarData(id, `${year}-${month}-${day_}`, showType).then(async (res) => {
            setCalendarData(res);
            renderDots(res);
        });
    }

    useEffect(() => {
        if (id != 0) {
            getCalendarData();
            setCalendarId(id);
        }
    }, [day, id, showType])



    const onMoveClicked = (direction) => {
        const newDate = new Date(day);
        if (direction == "prev") {
            newDate.setMonth(newDate.getMonth() - 1);
        }
        else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setday(newDate);
    }

    const onEditClicked = () => {
        setShowCalendarEditForm(true);
    }

    const [events, setEvents] = useState([]);

    const getEvents = async (calendarData) => {
        if (!calendarData.Events) {
            return;
        }
        let events_ = [...calendarData.Events];
        if (!events_ || events_.length === 0) {
            return;
        }
        for (let i = 0; i < events_.length; i++) {
            let res = await EventsService.getEvent(events_[i].id);
            events_[i].day = res.day;
            events_[i].startTime = res.startTime;
            events_[i].duration = res.duration;
            events_[i].description = res.description;
            events_[i].eventCategory = res.eventCategory;
        }
        return events_;
    }

    const renderDots = async (calendarData) => {
        let boxes = document.getElementsByClassName("eventsdots");
        for (let i = 0; i < boxes.length; i++) {
            boxes[i].innerHTML = "";
        }
        let events = await getEvents(calendarData);
        if (!events || events.length === 0) {
            return;
        }
        for (let i = 0; i < boxes.length; i++) {
            let day = boxes[i].parentElement.innerHTML.split('<')[0];
            for (let j = 0; j < events.length; j++) {
                if (day == dayjs(events[j].day).date()) {
                    let dot = document.createElement("div");
                    dot.className = "eventdot";
                    switch (events[j].eventCategory) {
                        case "arrangement":
                            dot.style.backgroundColor = arrangementColor;
                            break;
                        case "reminder":
                            dot.style.backgroundColor = reminderColor;
                            break;
                        case "task":
                            dot.style.backgroundColor = taskColor;
                            break;
                        case "holiday":
                            dot.style.backgroundColor = holidayColor;
                            break;
                        default:
                            dot.style.backgroundColor = otherColor;
                    }
                    let thereIs = false;
                    for (let k = 0; k < boxes[i].childNodes.length; k++) {
                        if (boxes[i].childNodes[k].style.backgroundColor == dot.style.backgroundColor) {
                            thereIs = true;
                        }
                    }
                    if (!thereIs) {
                    boxes[i].appendChild(dot);
                    }
                }
            }
        }

    }

    const generateCalendarGrid = () => {
        const rows = [];
        const today = new Date();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInPreviousMonth = new Date(year, month, 0).getDate();

        for (let i = 0; i < 6; i++) {
            const cells = [];
            for (let j = 0; j < 7; j++) {
                const dayNumber = (i * 7) + j + 1 - firstDayOfMonth.getDay();
                const isCurrentMonth = dayNumber >= 1 && dayNumber <= lastDayOfMonth.getDate();
                const cellClass = isCurrentMonth ? "cell" : "graycell";
                const textColor = isCurrentMonth ? "white" : "gray";
                const handleClick = isCurrentMonth ? cellClick : null;

                let displayDay = '';
                if (dayNumber <= 0) {
                    displayDay = daysInPreviousMonth + dayNumber;
                } else if (dayNumber > lastDayOfMonth.getDate()) {
                    displayDay = dayNumber - lastDayOfMonth.getDate();
                } else {
                    displayDay = dayNumber;
                }

                cells.push(
                    <div
                        className={(dayNumber === today.getDate() && today.getMonth() === month && today.getFullYear() === year) ? "todaycell" : cellClass}
                        key={`${i}-${j}`}
                        style={{ color: textColor }}
                        onClick={handleClick}
                    >
                        {displayDay}
                        {isCurrentMonth ? 
                        <div 
                            className="eventsdots"
                            key={displayDay}
                        ></div>
                        : null}
                    </div>
                );
            }
            rows.push(<div className="row" key={i}>{cells}</div>);
        }
        return rows;
    };

    return (
        <div>
            {calendarData.type !== 'error' ?
                <div className="calendarControll">
                    <div className="calendarControllPanel">
                        <div className="name-edit">
                            <Typography variant="h4" color="textPrimary" textAlign="center" marginLeft="20px">{calendarData.calendarName}</Typography>
                            {(getUserFromLocalStorage() 
                              && (calendarData.author_id == getUserFromLocalStorage().id 
                                  || calendarData.access == "write")) && 
                                (<IconButton sx={{marginTop: "-5px"}} onClick={() => onEditClicked("prev")}>
                                    <EditIcon/>
                                </IconButton>)
                            }
                        </div>
                        <div className="month-weekselect">
                            <IconButton sx={{marginTop: "-5px"}} className="arrow" onClick={() => onMoveClicked("prev")} aria-label="Example">
                                <NavigateBeforeIcon />
                            </IconButton>
                            <Typography variant="h5" color="textPrimary" textAlign="center">{(day.toDateString()).split(' ')[1]}</Typography>
                            <IconButton sx={{marginTop: "-5px"}} className="arrow" onClick={() => onMoveClicked("next")} aria-label="Example">
                                <NavigateNextIcon />
                            </IconButton>
                        </div>
                    </div>
                    <div className="calendar">
                        <div className="header">
                            {daysOfWeek.map(day => (
                                <div className="cellhead" key={day}>{day}</div>
                            ))}
                        </div>
                        {generateCalendarGrid()}
                        <DayMenu chosenDate={chosenDate}
                            showForm={showForm}
                            setShowForm={setShowForm}
                            calendarid={id}
                            calendarData={calendarData}
                            year={year}
                            month={month} 
                            getCalendarData={getCalendarData}
                            />
                        <CalendarEditMenu showForm={showCalendarEditForm} setShowForm={setShowCalendarEditForm} getCalendarData={getCalendarData}/>
                    </div>
                </div>
                :
                <div>
                    <Typography varant="h5" color="textPrimary" textAlign="center" marginTop="100px">{calendarData.message == "No token provided" ? "Access denied" : calendarData.message}</Typography>
                </div>
            }
        </div>
    );
};

export default Calendar;
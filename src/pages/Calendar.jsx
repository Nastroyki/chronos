import React, { useEffect, useState } from "react";
import { IconButton, Paper, Typography, Container, Box, Fab, colors } from "@mui/material";
import { Link, useParams } from "react-router-dom";
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


const Calendar = () => {
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
        setChosenDate(new Date(year, month, e.target.innerHTML));
        setShowForm(true);
    }

    const getCalendarData = () => {
        const year = day.getFullYear();
        const month = String(day.getMonth() + 1).padStart(2, '0');
        const day_ = String(day.getDate()).padStart(2, '0');
        CalendarService.getcalendarData(id, `${year}-${month}-${day_}`, showType).then(async (res) => {
            setCalendarData(res);
            console.log(res);
        });
    }

    useEffect(() => {
        getCalendarData();
        setCalendarId(id);
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
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
import { Directions } from "@mui/icons-material";

const Calendar = () => {
    // Array to hold the days of the week
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const daysInMonthF = (year, month) => new Date(year, month + 1, 0).getDate();
    const year = new Date().getFullYear(); // to delete
    const month = new Date().getMonth(); // to delete

    const [calendarData, setCalendarData] = useState([]);
    const [day, setday] = useState(new Date());
    const [showType, setType] = useState("month");
    const { id } = useParams();

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



    // Function to generate calendar grid
    const generateCalendarGrid = () => {
        let rows = [];
        let today = new Date().getDate();
        let dayofWeek = new Date(year, month, 1).getDay() - 1;
        let daysInMonth = daysInMonthF(year, month);
        let daysInPreviousMonth = daysInMonthF(year, month - 1);
        console.log(dayofWeek);
        console.log(daysInMonth);
        console.log(daysInPreviousMonth);
        let prewiousMonth = true;
        // Loop through each row
        for (let i = 0; i < 6; i++) {
            let cells = [];
            // Loop through each day of the week (7 days)
            for (let j = 0; j < 7; j++) {
                if (dayofWeek === j) {
                    prewiousMonth = false;
                }

                if (prewiousMonth) {
                    const dayNumber = daysInPreviousMonth - dayofWeek + j + 1;
                    cells.push(<div className="cell" key={dayNumber} style={{color: "gray"}}>{dayNumber}</div>);
                    continue;
                }
                // Calculate day number
                let dayNumber = (i * 7) + j - dayofWeek + 1;

                if (dayNumber > daysInMonth) {
                    dayNumber = dayNumber - daysInMonth;
                    cells.push(<div className="cell" key={dayNumber} style={{color: "gray"}}>{dayNumber}</div>);
                    continue;
                }
                if (dayNumber === today) {
                    cells.push(<div className="cell" key={dayNumber} style={{backgroundColor: "gray"}}>{dayNumber}</div>);
                    continue;
                }
                cells.push(<div className="cell" key={dayNumber}>{dayNumber}</div>);
            }
            // Push each row into the rows array
            rows.push(<div className="row" key={i}>{cells}</div>);
        }
        return rows;
    };

    return (
        <div className="calendarControll">
            <div className="calendarControllPanel">
                <IconButton onClick={() => onMoveClicked("prev")} aria-label="Example">
                    <NavigateBeforeIcon/>
                </IconButton>
                <Typography variant="h5" color="textPrimary" textAlign="center">{calendarData.calendarName}</Typography>
                <IconButton onClick={() => onMoveClicked("next")} aria-label="Example">
                    <NavigateNextIcon/>
                </IconButton>
            </div>
            <div className="calendar">
                <div className="header">
                    {/* Render day names */}
                    {daysOfWeek.map(day => (
                        <div className="cell" key={day}>{day}</div>
                    ))}
                </div>
                {/* Render calendar grid */}
                {generateCalendarGrid()}
            </div>
        </div>
    );
};

export default Calendar;





// const Calendar = () => {
//     const { id } = useParams();
//     const [day , setDay] = useState(dayjs());

//     // useEffect(() => {
//     //     CalendarService.getAllCalendars().then((calendars_) => {
//     //         setCalendars(calendars_);
//     //     });
//     // }, []);

//     return (
//         <div style={{ marginTop: "50px" }}>
//             <Typography variant="h3" align="center" color="colorSecondary" marginTop={"100px"} width={"100%"} marginBottom={"20px"}>calendar_name</Typography>
//             <div style={{ display: "flex" }}>
//                 <div style={{ display: "flex", flexDirection: "column" }}>
//                     <DateCalendar defaultValue={day} onChange={(newValue) => setDay(newValue)}/>
//                 </div>
//                 <div style={{ display: "flex", flexDirection: "column", marginLeft:"20px"}}>
//                     <Typography variant="h4" align="left" color="colorSecondary" marginTop={"10px"} width={"100%"} marginBottom={"20px"}>{day.format('MMMM D [events:]')}</Typography>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Calendar;


// const Calendars = () => {
//     const [calendars, setCalendars] = useState([]);

//     useEffect(() => {
//         CalendarService.getAllCalendars().then((calendars_) => {
//             setCalendars(calendars_);
//         });
//     }, []);

//     return (
//         <div style={{ marginTop: "50px" }}>
//             {calendars ? <CalendarsList calendars={calendars} /> : <Box>There is no calendars</Box>}
//             <AddCalendar />
//         </div>
//     )
// }

// export default Calendars;
import React, { useEffect, useState } from "react";
import { Paper, Typography, Container, Box, Fab } from "@mui/material";
import { Link } from "react-router-dom";
import CalendarService from "../../API/CalendarsService";
import CalendarsList from "./CalendarsList";
import AddIcon from '@mui/icons-material/Add';
import AddCalendar from "./AddCalendar";
import "./Calendars.css";

const CalendarsSideMenu = ({isOpen}) => {
    const [calendars, setCalendars] = useState([]);
    console.log("a: " + isOpen);
    useEffect(() => {
        CalendarService.getAllCalendars().then((calendars_) => {
            setCalendars(calendars_);
        });
    }, []);

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`} style={{ marginTop: "0px"}}>
            {calendars ? <CalendarsList calendars={calendars} /> : <Box>There is no calendars</Box>}
            <AddCalendar />
        </div>
    )
}
export default CalendarsSideMenu;
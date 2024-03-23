import React, { useEffect, useState } from "react";
import { Paper, Typography, Container, Box, Fab } from "@mui/material";
import { Link } from "react-router-dom";
import { getUserFromLocalStorage, logout } from "../store/store";
import CalendarService from "../API/CalendarsService";
import CalendarsList from "../components/Calendars/CalendarsList";
import AddIcon from '@mui/icons-material/Add';
import AddCalendar from "../components/Calendars/AddCalendar";

const Calendars = () => {
    const [calendars, setCalendars] = useState([]);

    useEffect(() => {
        CalendarService.getAllCalendars().then((calendars_) => {
            setCalendars(calendars_);
        });
    }, []);

    return (
        <div style={{ marginTop: "50px" }}>
            {calendars ? <CalendarsList calendars={calendars} /> : <Box>There is no calendars</Box>}
            <AddCalendar />
        </div>
    )
}

export default Calendars;
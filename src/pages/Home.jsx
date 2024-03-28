import React, { useEffect, useState } from "react";
import { Paper, Typography, Container, Box } from "@mui/material";
import { getUserFromLocalStorage } from "../store/store";
import CalendarService from "../API/CalendarsService";
import { Link, useNavigate } from "react-router-dom";
import { useContextProvider } from "../components/ContextProvider"; 

const Home = () => {
    const navigate = useNavigate();
    const { calendarData, calendarsList, setCalendarsList, sideMenuNeedRedraw} = useContextProvider();

    useEffect(() => {
        const fetchData = async () => {
            const user = getUserFromLocalStorage();
            if (user) {
                console.log(user);
                const calendars = await CalendarService.getAllCalendars();
                setCalendarsList(calendars);
                if (calendars.calendars.length !== 0) {
                    navigate(`/calendars/${calendars.calendars[0].id}`);
                    return;
                }
                else {
                    navigate(`/calendars/0`);
                    return;
                }
            }
            navigate(`/register`);
        }

        fetchData();
    }, []);

    return (
        <div>
        </div>
    )
}

export default Home;
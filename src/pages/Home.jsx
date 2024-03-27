import React, { useEffect, useState } from "react";
import { Paper, Typography, Container, Box } from "@mui/material";
import { getUserFromLocalStorage } from "../store/store";
import CalendarService from "../API/CalendarsService";

const Home = () => {
    useEffect(() => {
        const fetchData = async () => {
            const user = getUserFromLocalStorage();
            if (user) {
                console.log(user);
                const calendars = await CalendarService.getAllCalendars();
                if (calendars.calendars.length !== 0) {
                    window.location.href = `/calendars/${calendars.calendars[0].id}`;
                    return;
                }
            }
            window.location.href = `/calendars/1`;
        }

        fetchData();
    }, []);

    return (
        <div style={{marginTop: "50px"}}>
            <Typography variant="h3" align="center" color="colorSecondary" marginTop={"90px"}>Login to see calendars</Typography>
        </div>
    )
}

export default Home;
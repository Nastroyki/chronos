import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Box } from "@mui/material";
import CalendarItem from "./CalendarItem";

const CalendarsList = (props) => {
    console.log(props.calendars);
    return (
        <Container sx={{ mt: 3, marginTop: "90px"}}>
            {((props.calendars.calendars) && (props.calendars.calendars.length)) ? (
                props.calendars.calendars.map((calendar) => (
                    <CalendarItem
                        key={`${calendar.id}`}
                        calendar={calendar}
                    />
                ))
            ) : (
                <Typography variant="h3" align="center" color="colorSecondary" marginTop={"90px"}>There are no calendars</Typography>
            )}
        </Container>
    );
}

export default CalendarsList;
import { Paper, Box, Typography, Icon, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Calendars.css";

const CalendarItem = (props) => {
    return (
        <Paper elevation={4} sx={{ mb: 3, borderRadius: 3, border: "solid", borderColor: "white", borderWidth:1 }}>
            <div className="calendar-item-container">
                <Box sx={{ display: "flex", width: "100%" }}>
                    <div className="calendar-info">
                        <Link style={{ textDecoration: 'none', padding: 1, marginTop: 10, marginBottom: 10, width: "1000%"}} to={`/calendar/${props.calendar.id}`}>
                            <Typography variant="h4" color="textPrimary">{props.calendar.name}</Typography>
                        </Link>
                    </div>
                </Box>
            </div>
        </Paper>
    )
}

export default CalendarItem;
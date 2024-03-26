import { Paper, Box, Typography, Icon, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Calendars.css";

const CalendarItem = (props) => {
    return (
        <Paper elevation={2} sx={{ mb: 0.5, borderRadius: 2, border: "hidden" }}>
            <div className="calendar-item-container">
                <Link to={`/calendars/${props.calendar.id}`} style={{textDecoration: 'none'}}>
                    <Box sx={{ display: "flex", width: "100%" }}>
                        <div className="calendar-info">
                            <Typography variant="h6" color="textPrimary" style={{ textDecoration: 'none', padding: 1, marginTop: 5, marginBottom: 5, width: "100%", marginLeft: 10 }}>{props.calendar.name}</Typography>
                        </div>
                    </Box>
                </Link>
            </div>
        </Paper>
    )
}

export default CalendarItem;
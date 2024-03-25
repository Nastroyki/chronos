import { Paper, Box, Typography, Icon, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Calendars.css";

const CalendarItem = (props) => {
    return (
        <Paper elevation={4} sx={{ mb: 3, borderRadius: 3, border: "solid", borderColor: "white", borderWidth: 1 }}>
            <div className="calendar-item-container">
                <Link to={`/calendars/${props.calendar.id}`} style={{textDecoration: 'none'}}>
                    <Box sx={{ display: "flex", width: "100%" }}>
                        <div className="calendar-info">
                            <Typography variant="h4" color="textPrimary" style={{ textDecoration: 'none', padding: 1, marginTop: 15, marginBottom: 15, width: "100%", marginLeft: 15 }}>{props.calendar.name}</Typography>
                        </div>
                    </Box>
                </Link>
            </div>
        </Paper>
    )
}

export default CalendarItem;
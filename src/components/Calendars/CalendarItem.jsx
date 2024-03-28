import { Paper, Box, Typography, Icon, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useContextProvider } from "../ContextProvider";
import { Link } from "react-router-dom";
import "./Calendars.css";

const CalendarItem = (props) => {
    const { calendarId } = useContextProvider();
    const [isHighlighted, setIsHighlighted] = useState(calendarId !== props.calendar.id);

    useEffect(() => {
        setIsHighlighted(calendarId == props.calendar.id);
    }, [calendarId, props.calendar.id]);

    return (
        <Paper elevation={2} sx={{ mb: 0.5, borderRadius: 2, border: "hidden", backgroundColor: isHighlighted ? '#b0b0b0' : 'inherit' }}>
            <div className="calendar-item-container">
                <Link to={`/calendars/${props.calendar.id}`} style={{textDecoration: 'none'}}>
                    <Box sx={{ display: "flex", width: "100%" }}>
                        <div className="calendar-info">
                            <Typography variant="h6" color={isHighlighted ? 'black' : 'textPrimary'} style={{ textDecoration: 'none', padding: 1, marginTop: 5, marginBottom: 5, width: "100%", marginLeft: 10 }}>{props.calendar.name}</Typography>
                        </div>
                    </Box>
                </Link>
            </div>
        </Paper>
    )
}

export default CalendarItem;
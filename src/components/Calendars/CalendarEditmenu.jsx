import React, { useEffect, useState } from "react";
import { Paper, Typography, Container, Box, Fab, Alert, ButtonBase, TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarService from "../../API/CalendarsService";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import "./CalendarEditMenu.css";
import EventsService from "../../API/EventsService";
import { useContextProvider } from "../ContextProvider";


const CalendarEditMenu = ({showForm, setShowForm, getCalendarData}) => {
    const { calendarData } = useContextProvider();
    const [calendarName_, setCalendarName] = useState("");
    const [public_, setPublic] = useState(false);
    const [error, setError] = useState();
    const { calendarId } = useContextProvider();

    useEffect(() => {
        setCalendarName(calendarData.calendarName);
        setPublic(!calendarData.public);
    }, [showForm, calendarData]);

    const handleSubmit = async () => {
        try {
            await CalendarService.updateCalendar(calendarId, {name: calendarName_, public: !public_});
            getCalendarData();
            setShowForm(false);
        }
        catch (error) {
            setError(error.response.data.message);
        }
    }


    return (
        <div>
            <Container
                component="main"
                maxWidth="sm"
                sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: showForm ? 'block' : 'none'  // Conditional display
                }}
            >
                {showForm && (<Paper elevation={4} sx={{ p: 4, mt: 15 }} style={{ textAlign: "center" }}>
                    <Typography variant="h2">Edit calendar</Typography>

                    <form method="patch"
                        className="calendar_form"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            width: "100%",
                            justify: "center",
                            marginTop: "40px",
                        }}
                        onSubmit={(e) => {handleSubmit(e)}}>

                        <TextField
                            value={calendarName_}
                            onChange={(e) => {
                                setCalendarName(e.target.value);
                            }}
                            label="Name"
                            variant="outlined"
                            required
                        />

                        <FormControlLabel control={<Checkbox checked={public_} onChange={(e) => setPublic(e.target.checked)} />} label="Private" />


                        {error && <Alert severity="error">{error}</Alert>}

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" onClick={() => {handleSubmit()}} style={{width: "49%"}}>
                                Save changes
                            </Button>
                            <Button variant="contained" onClick={() => {setShowForm(false)}} style={{width: "49%"}}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Paper>)}
            </Container>
        </div>
    );
};

export default CalendarEditMenu;
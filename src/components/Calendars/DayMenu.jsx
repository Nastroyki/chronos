import React, { useEffect, useState } from "react";
import { Paper, Typography, Container, Box, Fab, Alert, ButtonBase, TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarService from "../../API/CalendarsService";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import "./DayMenu.css";

const DayMenu = (props) => {
    const oneHourHeight = 96;
    const timeoffset = 50;

    const [menuEvents, setMenuEvents] = useState(false);

    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventStartTime, setEventStartTime] = useState();
    const [eventEndTime, setEventEndTime] = useState();
    const [eventType, setEventType] = useState("");
    const [error, setError] = useState("");

    const renderTable = () => {
        for (let i = 0; i < 24; i += 0.5) {
            let row = document.createElement("tr");
            let time = document.createElement("td");
            let event = document.createElement("td");
            row.className = "eventrow";
            time.className = "eventtime";
            event.className = "eventcell";
            let timeString = document.createElement("p");
            timeString.className = "timeString";
            let hour = Math.floor(i);
            timeString.innerHTML = i % 1 === 0 ? (i + ':00') : '';
            time.appendChild(timeString);
            row.appendChild(time);
            row.appendChild(event);
            document.getElementById("timetable").appendChild(row);
        }
    }
    const dayjsHour = (day) => {
        return day.hour() + day.minute() / 60;
    }

    const recursionEventsFit = (i) => {
        for (let j = i - 1; j >= 0; j--) {
            if (events[j].eventStartTime.isBefore(events[i].eventEndTime) && events[j].eventEndTime.isAfter(events[i].eventStartTime)) {
                if (events[j].neighbors < events[i].neighbors) {
                    events[j].neighbors = events[i].neighbors;
                    recursionEventsFit(j);
                }
            }
        }
    }

    const renderEvents = () => {
        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            let eventCell = document.createElement("div");
            eventCell.className = "event";
            let eventduration = dayjs(event.duration, 'HH:mm:ss')
            let eventStartTime = dayjs(event.startTime, 'HH:mm:ss')
            let eventHeight = dayjsHour(eventduration) * oneHourHeight;
            eventCell.style.height = eventHeight + "px";
            eventCell.style.top = dayjsHour(eventStartTime) * oneHourHeight + "px";
            eventCell.key = event.id;

            let box = document.createElement("div");
            box.className = "eventbox";

            let title = document.createElement("span");
            title.innerHTML = event.name;
            box.appendChild(title);
            box.appendChild(document.createElement("br"));
            let time = document.createElement("span");
            let endTime = dayjs(event.startTime, 'HH:mm:ss').add(eventduration.hour(), 'hour').add(eventduration.minute(), 'minute');
            time.innerHTML = eventStartTime.format('HH:mm') + " - " + endTime.format('HH:mm');
            box.appendChild(time);

            eventCell.appendChild(box);
            event.eventStartTime = eventStartTime;
            event.eventEndTime = endTime;
            event.neighbors = 1;

            let minfree = 1;
            let changed = true;
            while (changed) {
                changed = false;
                for (let j = 0; j < i; j++) {
                    if (events[j].eventStartTime.isBefore(event.eventEndTime) && events[j].eventEndTime.isAfter(event.eventStartTime)) {
                        if (events[j].iam === minfree) {
                            minfree++;
                            changed = true;
                        }
                    }
                }
            }
            event.iam = minfree;
            event.neighbors = minfree;
            for (let j = 0; j < i; j++) {
                if (events[j].eventStartTime.isBefore(event.eventEndTime) && events[j].eventEndTime.isAfter(event.eventStartTime)) {
                    if (events[j].neighbors > event.neighbors) {
                        event.neighbors = events[j].neighbors;
                    }
                }
            }

            recursionEventsFit(i);

            document.getElementsByClassName("eventscontainer")[0].appendChild(eventCell);
        }
        for (let i = 0; i < events.length; i++) {
            console.log(events[i].neighbors);
            let event = events[i];
            event.iam = event.iam - 1;
            let eventCell = document.getElementsByClassName("event")[i];
            let width = "calc(" + (100 / event.neighbors) + "% - " + (timeoffset / event.neighbors) + "px)"
            eventCell.style.width = width;
            eventCell.style.left = "calc(" + (100 / event.neighbors * event.iam) + "% - " + (timeoffset / event.neighbors * event.iam) + "px)";
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    }


    const [events, setEvents] = useState([
        {
            id: 1,
            name: "test1",
            day: "2024-03-26T00:00:00.000Z",
            startTime: "11:00:00",
            duration: "02:05:00",
            eventCategory: "task"
        },
        {
            id: 2,
            name: "test2",
            day: "2024-03-26T00:00:00.000Z",
            startTime: "11:25:00",
            duration: "00:35:00",
            eventCategory: "task"
        },
        {
            id: 3,
            name: "test3",
            day: "2024-03-26T00:00:00.000Z",
            startTime: "13:25:00",
            duration: "00:35:00",
            eventCategory: "task"
        },
        {
            id: 4,
            name: "test4",
            day: "2024-03-26T00:00:00.000Z",
            startTime: "11:00:00",
            duration: "02:00:00",
            eventCategory: "task"
        },
        {
            id: 5,
            name: "test5",
            day: "2024-03-26T00:00:00.000Z",
            startTime: "13:25:00",
            duration: "00:45:00",
            eventCategory: "task"
        },
        {
            id: 6,
            name: "test6",
            day: "2024-03-26T00:00:00.000Z",
            startTime: "10:35:00",
            duration: "00:35:00",
            eventCategory: "task"
        }
    ]);

    useEffect(() => {
        renderTable();
        renderEvents();
    }, []);

    return (
        <div>
            <Container
                component="main"
                className="daymenu"
                sx={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: props.showForm ? 'block' : 'none'  // Conditional display
                }}
            >
                <Paper elevation={4} sx={{ p: 4, mt: 10 }} style={{ textAlign: "center" }} className={"eventPaper"}>
                    <Typography variant="h4">{dayjs(props.chosenDate).format('MMMM D [events]')}</Typography>
                    <div className="eventscontainer"
                        style={{
                            display: menuEvents ? 'none' : 'block'
                        }}>
                        <table id="timetable" onClick={() => setMenuEvents(true)}>
                        </table>
                    </div>
                    <div className="eventedit"
                        style={{
                            display: menuEvents ? 'block' : 'none'
                        }}>
                        <form method="post"
                            className="login_form"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                width: "100%",
                                justify: "center",
                                marginTop: "40px",
                            }}
                            onSubmit={(e) => handleSubmit(e)}>

                            <TextField
                                label="Event Name"
                                variant="outlined"
                                required
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                            />
                            <TextField
                                label="Event Description"
                                variant="outlined"
                                required
                                value={eventDescription}
                                onChange={(e) => setEventDescription(e.target.value)}
                            />
                            <TimePicker
                                label="Start Time"
                                format="HH:mm"
                                ampm={false}
                                required
                                onChange={(e) => setEventStartTime(e.target.value)}
                            />
                            <TimePicker
                                label="End Time"
                                format="HH:mm"
                                ampm={false}
                                required
                                onChange={(e) => setEventEndTime(e.target.value)}
                            />
                            <TextField
                                label="Event Type"
                                variant="outlined"
                                required
                                value={eventType}
                                onChange={(e) => setEventType(e.target.value)}
                            />

                            {error && <Alert severity="error">{error}</Alert>}

                            <Button variant="contained" type="submit">
                                Add event
                            </Button>
                        </form>
                    </div>
                    <Fab color="error" aria-label="edit" sx={{ position: 'absolute', top: 26, right: 26, height: 44, width: 44 }} onClick={() => props.setShowForm(false)}>
                        <CloseIcon />
                    </Fab>
                    <Fab color="success" aria-label="edit" sx={{ position: 'absolute', top: 26, left: 26, height: 44, width: 44, display: menuEvents ? '' : 'none' }} onClick={() => setMenuEvents(false)}>
                        <ArrowBackIcon />
                    </Fab>
                </Paper>

            </Container>
        </div>
    )

}

export default DayMenu;
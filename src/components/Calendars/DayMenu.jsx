import React, { useEffect, useState } from "react";
import { Paper, Typography, Container, Box, Fab, Alert, ButtonBase, TextField, Button, Checkbox, FormControlLabel, Select, MenuItem, InputLabel } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarService from "../../API/CalendarsService";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import "./DayMenu.css";
import EventsService from "../../API/EventsService";
import SwitchType from "./SwitchType";
import { getUserFromLocalStorage, logout } from "../../store/store";

const DayMenu = (props) => {
    const oneHourHeight = 96;
    const timeoffset = 50;
    const arrangementColor = "orange";
    const reminderColor = "red";
    const taskColor = "blue";
    const holidayColor = "green";
    const otherColor = "purple";

    const [menuEvents, setMenuEvents] = useState(true);
    const [editEvent, setEditEvent] = useState(false);
    const [seeEvent, setSeeEvent] = useState(false);

    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventStartTime, setEventStartTime] = useState(dayjs("00:00:00", 'HH:mm:ss'));
    const [eventEndTime, setEventEndTime] = useState(dayjs("00:00:00", 'HH:mm:ss'));
    const [eventType, setEventType] = useState("");
    const [error, setError] = useState("");

    const [seeEventName, setSeeEventName] = useState("");
    const [seeEventDescription, setSeeEventDescription] = useState("");
    const [seeEventStartTime, setSeeEventStartTime] = useState(dayjs("00:00:00", 'HH:mm:ss'));
    const [seeEventEndTime, setSeeEventEndTime] = useState(dayjs("00:00:00", 'HH:mm:ss'));
    const [seeEventType, setSeeEventType] = useState("");

    const [eventtoedit, setEventToEdit] = useState(null);
    const [mode, setMode] = useState("Add Event");

    let events = [];

    const renderTable = () => {
        let rows = document.getElementsByClassName("eventrow");
        while (rows.length > 0) {
            rows[0].remove();
        }
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
            if (events[j].day !== events[i].day) {
                continue;
            }
            if (events[j].eventStartTime.isBefore(events[i].eventEndTime) && events[j].eventEndTime.isAfter(events[i].eventStartTime)) {
                if (events[j].neighbors < events[i].neighbors) {
                    events[j].neighbors = events[i].neighbors;
                    recursionEventsFit(j);
                }
            }
        }
    }

    const getEvents = async () => {
        if (!props.calendarData.Events) {
            return;
        }
        let events_ = [...props.calendarData.Events];
        if (!events_ || events_.length === 0) {
            return;
        }
        for (let i = 0; i < events_.length; i++) {
            let res = await EventsService.getEvent(events_[i].id);
            events_[i].day = res.day;
            events_[i].startTime = res.startTime;
            events_[i].duration = res.duration;
            events_[i].description = res.description;
            events_[i].eventCategory = res.eventCategory;
        }
        events = events_;
    }

    const renderEvents = async () => {

        let oldEvents = document.getElementsByClassName("event");
        while (oldEvents.length > 0) {
            oldEvents[0].remove();
        }
        await getEvents();

        if (!events || events.length === 0) {
            return;
        }

        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            if (dayjs(event.day).format('D') !== dayjs(props.chosenDate).format('D')) {
                continue;
            }
            if (!event.startTime) continue;
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
            switch (event.eventCategory) {
                case "arrangement":
                    box.style.backgroundColor = "orange";
                    break;
                case "reminder":
                    box.style.backgroundColor = "red";
                    break;
                case "task":
                    box.style.backgroundColor = "blue";
                    break;
                case "holiday":
                    box.style.backgroundColor = "green";
                    break;
                case "other":
                    box.style.backgroundColor = "purple";
                    break;
                default:
                    box.style.backgroundColor = "grey";
                    break;
            }
            box.key = event.id;
            box.addEventListener("click", (e) => openEvent(e));

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
                    if (events[j].day !== event.day) {
                        continue;
                    }
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
                if (events[j].day !== event.day) {
                    continue;
                }
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
            let event = events[i];
            if (dayjs(event.day).format('D') !== dayjs(props.chosenDate).format('D')) {
                continue;
            }
            event.iam = event.iam - 1;
            let eventCells = document.getElementsByClassName("event");
            let eventCell;
            for (let j = 0; j < eventCells.length; j++) {
                if (eventCells[j].key === events[i].id) {
                    eventCell = eventCells[j];
                    break;
                }
            }
            if (!eventCell) {
                continue;
            }
            let width = "calc(" + (100 / event.neighbors) + "% - " + (timeoffset / event.neighbors) + "px)"
            eventCell.style.width = width;
            eventCell.style.left = "calc(" + (100 / event.neighbors * event.iam) + "% - " + (timeoffset / event.neighbors * event.iam) + "px)";
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (eventEndTime.isBefore(eventStartTime)) {
            setError("End time must be after start time");
            return;
        }
        if (eventEndTime.isSame(eventStartTime)) {
            setError("End time can't be the same as start time");
            return;
        }
        let event = {
            name: eventName,
            description: eventDescription,
            day: dayjs(props.chosenDate).format('YYYY-MM-DD'),
            startTime: eventStartTime.format('HH:mm'),
            duration: eventEndTime.subtract(eventStartTime.hour(), 'hour').subtract(eventStartTime.minute(), 'minute').format('HH:mm'),
            event_category: eventType
        };
        if (mode === "Add Event") {

            try {
                let response = await EventsService.createEvent(props.calendarid, event);
                props.getCalendarData();
                props.setShowForm(false);
                setMenuEvents(true);
                props.setShowForm(true);
                setEditEvent(false);

            } catch (error) {
                setError(error.response.data.message);
            }
        }
        else {
            try {
                let response = await EventsService.updateEvent(eventtoedit.id, event);
                props.getCalendarData();
                props.setShowForm(false);
                setMenuEvents(true);
                props.setShowForm(true);
                setEditEvent(false);

            } catch (error) {
                setError(error.response.data.message);
            }
        }
    }

    const openCreateEvent = () => {
        if ((getUserFromLocalStorage()
            && (props.calendarData.author_id == getUserFromLocalStorage().id
                || props.calendarData.access == "write"))) {
            setMode("Add Event");
            setMenuEvents(false);
            setSeeEvent(false);
            setEditEvent(true);
            setEventName("");
            setEventDescription("");
            setEventStartTime(dayjs("00:00:00", 'HH:mm:ss'));
            setEventEndTime(dayjs("00:00:00", 'HH:mm:ss'));
            setEventType("");
            setError("");
        }
    }

    const openEditEvent = () => {

        if (!eventtoedit) {
            return;
        }
        setMode("Edit Event");
        setMenuEvents(false);
        setSeeEvent(false);
        setEditEvent(true);
        setEventName(eventtoedit.name);
        setEventDescription(eventtoedit.description);
        setEventStartTime(dayjs(eventtoedit.startTime, 'HH:mm:ss'));
        let endTime = dayjs(eventtoedit.startTime, 'HH:mm:ss').add(dayjs(eventtoedit.duration, 'HH:mm:ss').hour(), 'hour').add(dayjs(eventtoedit.duration, 'HH:mm:ss').minute(), 'minute');
        setEventEndTime(endTime);
        setEventType(eventtoedit.eventCategory);
        setError("");
    }



    const openEvent = (e) => {
        for (let i = 0; i < events.length; i++) {
            if (events[i].id === e.target.key) {
                setSeeEventName(events[i].name);
                setSeeEventDescription(events[i].description);
                setSeeEventStartTime(events[i].eventStartTime);
                setSeeEventEndTime(events[i].eventEndTime);
                setSeeEventType(events[i].eventCategory);
                setSeeEvent(true);
                setMenuEvents(false);
                setEventToEdit(events[i]);
                break;
            }
        }
    }

    const deleteEvent = async () => {
        if (!eventtoedit) {
            return;
        }
        try {
            let response = await EventsService.deleteEvent(eventtoedit.id);
            props.getCalendarData();
            props.setShowForm(false);
            setSeeEvent(false);
            setMenuEvents(true);
            props.setShowForm(true);
            setEditEvent(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    }


    useEffect(() => {
        renderEvents();
        renderTable();
    }, [props.showForm, props.calendarData]);

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
                    width: menuEvents ? "912px" : "550px",
                    display: props.showForm ? 'block' : 'none'  // Conditional display
                }}

            >
                <Paper 
                    elevation={4} sx={
                        { 
                            p: 4, 
                            pb: menuEvents ? 2 : 4, 
                            pl: menuEvents ? 0 : 4, 
                            mt: 10, 
                            height: menuEvents ? "auto" : "480px", 
                        }
                    }
                    style={{ textAlign: "center" }} 
                    className={"eventPaper"}
                >
                    <Typography variant="h4" marginLeft={menuEvents ? "32px" : "0px"}>{dayjs(props.chosenDate).format('MMMM D')}</Typography>
                    <div className="eventscontainer"
                        style={{
                            display: menuEvents ? 'block' : 'none'
                        }}>
                        <table id="timetable" onClick={() => openCreateEvent()}>
                        </table>
                    </div>
                    <div className="eventedit"
                        style={{
                            display: editEvent ? 'block' : 'none'
                        }}>
                        <form method="post"
                            className="login_form"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px",
                                width: "100%",
                                justify: "center",
                                marginTop: "40px",
                            }}
                            onSubmit={(e) => handleSubmit(e)}>

                            <TextField
                                sx={{
                                    "& .MuiInputLabel-root": {
                                        marginTop: "-0px",
                                        "&:not([data-shrink='true'])": {
                                            marginTop: "-7px"
                                        }
                                    },
                                    "& .MuiInputBase-root": {
                                        minHeight: "36.5px",
                                        maxHeight: "36.5px",
                                        "& .MuiInputBase-input": {
                                            marginTop: "4px"
                                        }
                                    }
                                }}
                                label="Event Name"
                                variant="outlined"
                                required
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                            />
                            <TextField
                                sx={{
                                    "& .MuiInputLabel-root": {
                                        marginTop: "-0px",
                                        "&:not([data-shrink='true'])": {
                                            marginTop: "-7px"
                                        }
                                    },
                                    "& .MuiInputBase-root": {
                                        minHeight: "36.5px",
                                        maxHeight: "36.5px",
                                        "& .MuiInputBase-input": {
                                            marginTop: "4px"
                                        }
                                    }
                                }}
                                label="Event Description"
                                variant="outlined"
                                required
                                value={eventDescription}
                                onChange={(e) => setEventDescription(e.target.value)}
                            />
                            <TimePicker
                                sx={{
                                    "& .MuiInputLabel-root": {
                                        marginTop: "-0px",
                                        "&:not([data-shrink='true'])": {
                                            marginTop: "-7px"
                                        }
                                    },
                                    "& .MuiInputBase-root": {
                                        minHeight: "36.5px",
                                        maxHeight: "36.5px",
                                        "& .MuiInputBase-input": {
                                            marginTop: "4px"
                                        }
                                    }
                                }}
                                label="Start Time"
                                format="HH:mm"
                                ampm={false}
                                required
                                value={dayjs(eventStartTime)}
                                onChange={(e) => setEventStartTime(e)}
                            />
                            <TimePicker
                                sx={{
                                    "& .MuiInputLabel-root": {
                                        marginTop: "-0px",
                                        "&:not([data-shrink='true'])": {
                                            marginTop: "-7px"
                                        }
                                    },
                                    "& .MuiInputBase-root": {
                                        minHeight: "36.5px",
                                        maxHeight: "36.5px",
                                        "& .MuiInputBase-input": {
                                            marginTop: "4px"
                                        }
                                    }
                                }}
                                label="End Time"
                                format="HH:mm"
                                ampm={false}
                                required
                                value={dayjs(eventEndTime)}
                                onChange={(e) => setEventEndTime(e)}
                            />
                            <InputLabel htmlFor="demo-simple-select" sx={{ textAlign: "left" }}>Event Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                sx={{
                                    textAlign: "left",
                                    "& .MuiSelect-select": {
                                        paddingTop: "7px",
                                        paddingBottom: "10px"
                                    }
                                }}
                                value={eventType}
                                id="demo-simple-select"
                                onChange={(e) => setEventType(e.target.value)}
                            >
                                <MenuItem value={"arrangement"}><div className="typecircle" style={{ backgroundColor: arrangementColor }}>Arrangement</div></MenuItem>
                                <MenuItem value={"reminder"}><div className="typecircle" style={{ backgroundColor: reminderColor }}>Reminder</div></MenuItem>
                                <MenuItem value={"task"}><div className="typecircle" style={{ backgroundColor: taskColor }}>Task</div></MenuItem>
                                <MenuItem value={"holiday"}><div className="typecircle" style={{ backgroundColor: holidayColor }}>Holiday</div></MenuItem>
                                <MenuItem value={"other"}><div className="typecircle" style={{ backgroundColor: otherColor }}>Other</div></MenuItem>
                            </Select>

                            {error && <Alert severity="error">{error}</Alert>}

                            <Button variant="contained" type="submit">
                                {mode}
                            </Button>
                        </form>
                    </div>
                    <div className="eventsee"
                        style={{
                            display: seeEvent ? 'block' : 'none',
                            width: "100%",
                            textAlign: "left"
                        }}>
                        <Typography variant="h4" textAlign={"center"} marginRight={"32px"}>Event name: {seeEventName}</Typography>
                        <Typography variant="h5" textAlign={"center"} marginRight={"32px"}>{seeEventStartTime.format('HH:mm')} - {seeEventEndTime.format('HH:mm')}</Typography>
                        <SwitchType type={seeEventType}/>
                        <br />
                        <Typography variant="h4">Event description:</Typography>
                        <Typography variant="h5">{seeEventDescription}</Typography>
                        <br />
                        {(getUserFromLocalStorage()
                            && (props.calendarData.author_id == getUserFromLocalStorage().id
                                || props.calendarData.access == "write")) &&
                            (<div>
                                <Button variant="contained" className="eventbutton" onClick={() => openEditEvent()}>Edit Event</Button>
                                <Button variant="contained" className="eventbutton" style={{float: "right", marginRight: "32px"}} onClick={() => deleteEvent()} color="error">Delete Event</Button>
                            </div>
                            )}
                    </div>
                    <Fab color="error" aria-label="edit" sx={{ position: 'absolute', top: 26, right: 26, height: 44, width: 44 }} onClick={() => {
                        props.setShowForm(false)
                        setMenuEvents(true)
                        setEditEvent(false)
                        setSeeEvent(false)
                    }}>
                        <CloseIcon />
                    </Fab>
                    <Fab color="success" aria-label="edit" sx={{ position: 'absolute', top: 26, left: 26, height: 44, width: 44, display: menuEvents ? 'none' : '' }} onClick={() => {
                        setEditEvent(false)
                        setSeeEvent(false)
                        setMenuEvents(true)

                    }}>
                        <ArrowBackIcon />
                    </Fab>
                </Paper>

            </Container>
        </div>
    )

}

export default DayMenu;
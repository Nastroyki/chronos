import React, { useEffect, useState } from "react";
import { Paper, Typography, Container, Box, Fab, Alert, ButtonBase, TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import CalendarService from "../../API/CalendarsService";
import dayjs from "dayjs";
import "./DayMenu.css";

const DayMenu = (props) => {
    const oneHourHeight = 96;
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
                events[j].neighbors++;
                events[i].neighbors = events[j].neighbors;
                if (!events[j].iamset) {
                    events[i].iam = events[j].iam + 1;
                    events[j].iamset = true;
                }
                recursionEventsFit(j);
                break;
            }
        }
    }

    const renderEvents = () => {
        for(let i = 0; i < events.length; i++) {
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
            event.iam = 0;
            event.iamset = false;

            recursionEventsFit(i);

            document.getElementsByClassName("eventscontainer")[0].appendChild(eventCell);
        }
        for(let i = 0; i < events.length; i++) {
            console.log(events[i].neighbors);
            let event = events[i];
            let eventCell = document.getElementsByClassName("event")[i];
            let width = "calc(" + (100 / event.neighbors) + "% - " + (100 / event.neighbors) + "px)"
            eventCell.style.width = width;
            eventCell.style.left = "calc(" + (100 / event.neighbors * event.iam) + "% - " + (100 / event.neighbors * event.iam) + "px)";
        }
    }


    //     {
    //         "id": 2,
    //         "name": "wake up, bitches!",
    //         "day": "2024-03-26T00:00:00.000Z",
    //         "startTime": "10:25:00",
    //         "duration": "00:35:00",
    //         "eventCategory": "task"
    //     }


    const [events, setEvents] = useState([
        {
            id: 1,
            name: "wake up, bitches!",
            day: "2024-03-26T00:00:00.000Z",
            startTime: "10:25:00",
            duration: "04:35:00",
            eventCategory: "task"
        },
        {
            id: 2,
            name: "test",
            day: "2024-03-26T00:00:00.000Z",
            startTime: "11:25:00",
            duration: "00:35:00",
            eventCategory: "task"
        },
        {
            id: 3,
            name: "test",
            day: "2024-03-26T00:00:00.000Z",
            startTime: "12:25:00",
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
                <Paper elevation={4} sx={{ p: 4, mt: 10 }} style={{ textAlign: "center" }}>
                    <Typography variant="h2">{dayjs(props.chosenDate).format('MMMM D [events]')}</Typography>
                    <div className="eventscontainer">
                        <table id="timetable">
                        </table>
                        
                    </div>
                    <Button variant="contained" onClick={() => props.setShowForm(false)} style={{ width: "49%" }}>
                        Cancel
                    </Button>
                </Paper>

            </Container>
        </div>
    )

}

export default DayMenu;
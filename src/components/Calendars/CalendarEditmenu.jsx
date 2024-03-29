import React, { useEffect, useState } from "react";
import { Paper, Typography, Autocomplete, MenuItem, Container, Box, Fab, Alert, ButtonBase, TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
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
    const { calendarData, calendarsList } = useContextProvider();
    const [calendarName_, setCalendarName] = useState("");
    const [public_, setPublic] = useState(false);
    const [error, setError] = useState();
    const [users, setUsers] = useState([]);
    
    const [usersLogins, setUsersLogins] = useState([]);
    const [findedUsersList, setFindedUsersList] = useState([]);
    const [targetUser, setTargetUser] = useState("");
    const { calendarId } = useContextProvider();
    const navigate = useNavigate();

    useEffect(() => {
        if (showForm) {
            setCalendarName(calendarData.calendarName);
            setPublic(!calendarData.public);
            CalendarService.getCalendarUsers(calendarId).then((users_) => {
                setUsers(users_);
            });
        }
    }, [showForm, calendarData]);

    const onAccesChangeClicked = async (user_id, access) => {
        const new_access = access == "write" ? "read" : "write";
        await CalendarService.changeUserAccess(calendarId, {user_id: user_id, access: new_access});
        CalendarService.getCalendarUsers(calendarId).then((users_) => {
            setUsers(users_);
        });
    }

    const handleSelectOption = async (event, value) => {
        setTargetUser(value);
    }

    const handleSearch = async (value) => {
        if (value.length >= 4) {
            CalendarService.getUserByName(value).then((users_) => {
                setFindedUsersList(users_);
                setUsersLogins(users_.map(user => user.login));
            });
        }
    }

    const onAddUserClicked = async () => {
        if (findedUsersList.length != 0) {
            const targetUserId = findedUsersList.find(user => user.login == targetUser).id;
            await CalendarService.addUserToCalindar(calendarId, targetUserId);
            CalendarService.getCalendarUsers(calendarId).then((users_) => {
                setUsers(users_);
            });
        }
    }

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

    const handleDelete = async () => {
        try {
            await CalendarService.deleteCalendar(calendarId);
            const fCalendars = calendarsList.calendars.filter(calendar => calendar.id != calendarId);
            if (fCalendars.length == 0) {
                navigate(`/`);
            }
            else {
                navigate(`/calendars/${fCalendars[fCalendars.length - 1].id}`);
            }
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
                    width: "550px",
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: showForm ? 'block' : 'none'
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
                            <Button variant="contained" color="error" onClick={() => {handleDelete()}} style={{width: "49%"}}>
                                Delete
                            </Button>
                            <Fab color="error" aria-label="edit" sx={{ position: 'absolute', top: 26, right: 26, height: 44, width: 44, mt: 15, mr: 2 }} onClick={() => {setShowForm(false)}}>
                                <CloseIcon />
                            </Fab>
                        </div>
                    </form>
                    <div className="users-info">
                        <div className="find-user">
                            <Autocomplete sx={{width: "285%", 
                                "& .MuiInputLabel-root": {
                                    marginTop: "-0px",
                                    "&:not([data-shrink='true'])": {
                                        marginTop: "-7px"
                                    }
                                },
                                "& .MuiAutocomplete-inputRoot": { minHeight: "36.5px", width: "98%" ,
                                    "& .MuiAutocomplete-input": { paddingTop: "0px"}
                                }
                            }}
                                options={usersLogins} 
                                onChange={handleSelectOption}
                                autoSelect={false}
                                onInputChange={(event, value) => handleSearch(value)}
                                renderInput={(params) => <TextField sx={{height: "10px"}} {...params} label="Add User" />}
                            />
                            <Button sx={{width: "5%"}} variant="contained" color="success" onClick={() => {onAddUserClicked()}} style={{width: "49%"}}>
                                Add
                            </Button>
                        </div>
                        <Typography variant="h6" color='textPrimary' style={{ textDecoration: 'none', padding: 1, marginTop: 5, marginBottom: 5, width: "100%", marginLeft: 10 }}>User List:</Typography>
                        <div className="users-list">
                            {((users) && (users.length)) && (
                                users.map((user) => (
                                    <div key={`${user.id}`} className="user-info">
                                        <Typography variant="h6" color='textPrimary' style={{ textDecoration: 'none' }}>{user.login}</Typography>
                                        {user.id != calendarData.author_id ? 
                                        (<Typography variant="h6" color='textPrimary' style={{ textDecoration: 'none', cursor: "pointer" }} onClick={() => {onAccesChangeClicked(user.id, user.access)}}>{user.access}</Typography>) 
                                        : 
                                        (<Typography variant="h6" color='textPrimary' style={{ textDecoration: 'none', cursor: "default" }}>author</Typography>)}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </Paper>)}
            </Container>
        </div>
    );
};

export default CalendarEditMenu;
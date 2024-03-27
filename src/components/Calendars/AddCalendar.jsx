import React, { useEffect, useState } from "react";
import { Paper, Typography, Container, Box, Fab, Alert, ButtonBase, TextField, Button, Checkbox, FormControlLabel } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import CalendarService from "../../API/CalendarsService";

const AddCalendar = () => {
    const [name, setName] = useState("");
    const [public_, setPublic] = useState(true);
    const [error, setError] = useState();
    const [showForm, setShowForm] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await CalendarService.createCalendar(name, !public_);
            window.location.reload();
        }
        catch (error) {
            setError(error.response.data.message);
        }
    }
    return (
        <div>
            <Fab color="secondary" aria-label="edit" sx={{ position: 'fixed', bottom: 26, right: 26 }} onClick={() => setShowForm(true)}>
                <AddIcon />
            </Fab>
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
                <Paper elevation={4} sx={{ p: 4, mt: 15 }} style={{ textAlign: "center" }}>
                    <Typography variant="h2">Add calendar</Typography>

                    <form method="post"
                        className="calendar_form"
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
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            label="Name"
                            variant="outlined"
                            required
                        />

                        <FormControlLabel control={<Checkbox checked={public_} onChange={(e) => setPublic(e.target.checked)} />} label="Private" />


                        {error && <Alert severity="error">{error}</Alert>}

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="contained" type="submit" style={{width: "49%"}}>
                                Create
                            </Button>
                            <Button variant="contained" onClick={() => setShowForm(false)} style={{width: "49%"}}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Paper>
            </Container>
        </div>
    )
}

export default AddCalendar;
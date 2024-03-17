import { Alert, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import AuthService from "../API/AuthService";
import React from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { login } from "../store/store";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [user_login, setUserLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await AuthService.login(user_login, password)
            const data = jwtDecode(response.data.data.token);
            login({
                id: data.id,
                username: data.username,
                role: data.username,
                rating: data.rating,
                token: response.data.data.token
            });
            navigate("/");
            window.location.reload();
        }
        catch (error) {
            setError(error.response.data.message);
        }
    }

    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={4} sx={{ p: 4, mt: 15}} style={{ textAlign: "center" }}>
                <Typography variant="h2">Log In</Typography>

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
                        value={user_login}
                        onChange={(e) => {
                            setUserLogin(e.target.value);
                        }}
                        label="Login"
                        variant="outlined"
                        required
                    />

                    <TextField
                        value={password}
                        onChange={(e) => {
                        setPassword(e.target.value);
                        }}
                        type="password"
                        label="Password"
                        variant="outlined"
                        autoComplete="current-password"
                        required
                    />

                    {error && <Alert severity="error">{error}</Alert>}

                    <Button variant="contained" type="submit">
                        Log In
                    </Button>
                </form>

                <div>
                    <Link to="/register" style={{ textDecoration: 'none', padding: 2}}>
                        <Typography variant="body1" color="textSecondary">
                            Don't have an account? Register here!
                        </Typography>
                    </Link>
                </div>
            </Paper>
        </Container>
    )
}

export default Login;
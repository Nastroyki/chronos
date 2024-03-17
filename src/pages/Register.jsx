import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthService from "../API/AuthService";
import { Container, Paper, Typography, TextField, Button, Alert } from "@mui/material";


const Register = () => {
    const [userLogin, setUserLogin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState();

    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        try {
            await AuthService.register(userLogin, password, email);
            navigate("/login");
        } catch (error) {
            setError(error.response.data.message + ' : ' + error.response.data.data.errors[0]);
        }
    };

    return (
        <Container component="main" maxWidth="sm" sx={{ mb: 6 }}>
            <Paper elevation={4} sx={{ p: 4, mt: 15 }} style={{ textAlign: "center" }}>
                <Typography variant="h2">Register</Typography>
        
                <form
                    action=""
                    method="post"
                    className="register_form"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        width: "100%",
                        justify: "center",
                        marginTop: "40px",
                    }}
                    onSubmit={(e) => {
                    handleSubmit(e);
                    }}
                >
                    <TextField
                        value={userLogin}
                        onChange={(e) => {
                            setUserLogin(e.target.value);
                        }}
                        label="Login"
                        variant="outlined"
                        required
                    />
  
                    <TextField
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        label="Email"
                        type="email"
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
            
                    <TextField
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                        }}
                        type="password"
                        label="Confirm password"
                        variant="outlined"
                        autoComplete="current-password"
                        required
                     />
  
                    {error && <Alert severity="error">{error}</Alert>}
  
                    <Button variant="contained" type="submit">
                        Register
                    </Button>
                </form>
  
                <Link to="/login" style={{ textDecoration: 'none'}}>
                    <Typography variant="body1" color="textSecondary" sx={{ mt: "20px" }}>
                        Already have an account? Sign in
                    </Typography>
                </Link>
            </Paper>
      </Container>
    );
}

export default Register;
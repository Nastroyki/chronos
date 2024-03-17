import React from "react";
import { Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Login_Register = () => {
    return (
        <React.Fragment>
            <Paper sx={{
                p: 1,
                marginBottom: 0.2,
                marginLeft: 2,
                marginRight: 2,
                typography: 'body1',
                borderRadius: 3,
                width: "fit-content",
                display: 'flex',
                border: "solid",
                borderWidth: "1px",
                borderColor: "lightgray",
                backgroundColor: "#282828",
                '& > :not(style) ~ :not(style)': {
                    ml: 1,
                },
                '& > :not(style)': {
                    borderRight: '1px solid #ddd',
                    ':last-child': {
                        borderRight: 'none',
                    },
                },
            }}>
                <Link style={{ textDecoration: 'none', padding: 2, paddingRight: 10}} to="/login">
                    <Typography variant="body1" color="textPrimary">Log In</Typography>
                </Link>
                <Link style={{ textDecoration: 'none', padding: 2}} to="/register">
                    <Typography variant="body1" color="textPrimary">Sign In</Typography>
                </Link>
            </Paper>
        </React.Fragment>
    )
}

export default Login_Register;

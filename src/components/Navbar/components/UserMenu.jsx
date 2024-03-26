import React from "react";
import { Paper, Typography, Container} from "@mui/material";
import { Link } from "react-router-dom";
import AuthService from "../../../API/AuthService";
import { logout } from "../../../store/store";
import { getUserFromLocalStorage } from "../../../store/store"; 

const UserMenu = () => {
    const user = getUserFromLocalStorage();
    console.log(user);

    const handleClick_log_out = async () => {
        // await AuthService.logout();
        logout();
        window.location.reload();
    };


    return (
        <React.Fragment>
            <Paper sx={{
                p: 1,
                marginLeft: 0,
                marginRight: 0,
                typography: 'body1',
                borderRadius: 3,
                width: "fit-content",
                display: 'flex',
                border: "solid",
                borderWidth: "1px",
                borderColor: "lightgray",
                backgroundColor: "#282828",
                padding: "3px",
                '& > :not(style) ~ :not(style)': {
                    ml: 1,
                },
                '& > :not(style)': {
                    mr: 2,
                    borderRight: '1px solid #ddd',
                    padding: '0 8px',
                    ':last-child': {
                        borderRight: 'none',
                    },
                },
            }}>
                <Container>
                    <Typography variant="body1" textAlign="center" color="textPrimary">{user.login}</Typography>
                </Container>
                <Link onClick={handleClick_log_out} style={{ textDecoration: 'none'}} to="/">
                    <Typography variant="body1" color="textPrimary">Log Out</Typography>
                </Link>
            </Paper>
        </React.Fragment>
    )
}

export default UserMenu;
import React from "react";
import { Paper, Typography, Container} from "@mui/material";
import { Link } from "react-router-dom";
import AuthService from "../../../API/AuthService";
import { logout } from "../../../store/store";
import { getUserFromLocalStorage } from "../../../store/store"; 

const UserMenu = () => {
    const user = getUserFromLocalStorage();

    const handleClick_log_out = async () => {
        await AuthService.logout();
        logout();
        window.location.reload();
    };


    return (
        <React.Fragment>
            <Paper sx={{
                p: 1,
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
                    <Link style={{ textDecoration: 'none'}} to={`/user/${user.id}`}>   
                        <Typography variant="body1" color="textPrimary">{user.username}</Typography>
                    </Link>
                    <Typography variant="body1" color="textSecondary">{"rating: " + user.rating}</Typography>
                </Container>
                <Link onClick={handleClick_log_out} style={{ textDecoration: 'none', display: 'flex'}} to="/">
                    <Typography variant="body1" color="textPrimary">Log Out</Typography>
                </Link>
            </Paper>
        </React.Fragment>
    )
}

export default UserMenu;
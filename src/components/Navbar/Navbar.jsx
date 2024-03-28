import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import StatusMenu from "./components/StatusMenu";
import { Link } from "react-router-dom";
import CalendarsSideMenu from "../Calendars/CalendarsSideMenu";
import { getUserFromLocalStorage } from "../../store/store";

const Navbar = ({ toggleSideMenu }) => {
    const [user, setUser] = useState(getUserFromLocalStorage());
    useEffect(() => {
        setUser(getUserFromLocalStorage());
    }, []);

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            mb: "30px",
            position: "fixed",
            zIndex: "1000",
            bgcolor: "#282828",
            top: "0",
            left: "0",
            right: "0",
            boxShadow: "0px 2px 8px rgba(255,255,255,0.12)",
            p: "10px",
          }}
          className="nav_bar">
            {user ?
                <Link style={{ textDecoration: 'none', marginLeft: "15px"}} onClick={toggleSideMenu}>
                    <Typography variant="h5" color="textPrimary">Menu</Typography>
                </Link>
            :
                <div></div>
            }
            <StatusMenu sx={{ flexGrow: 1, marginLeft: "auto" }}/>
        </Box>
    )
}

export default Navbar;
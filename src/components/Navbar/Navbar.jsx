import React from "react";
import { Box, Typography } from "@mui/material";
import StatusMenu from "./components/StatusMenu";
import { Link } from "react-router-dom";

const Navbar = () => {
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
            <Link style={{ textDecoration: 'none'}} to="/">
                <Typography variant="h5" color="textPrimary">WTCD?</Typography>
            </Link>
            <StatusMenu sx={{ flexGrow: 1, marginLeft: "auto" }}/>
        </Box>
    )
}

export default Navbar;
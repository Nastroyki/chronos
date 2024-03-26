import React, { useEffect, useState } from "react";
import { Paper, Typography, Container, Box } from "@mui/material";
import { getUserFromLocalStorage } from "../store/store";

const Home = () => {
    if (getUserFromLocalStorage()) {
        window.location.href = "/calendars/1";
    }

    return (
        <div style={{marginTop: "50px"}}>
            <Typography variant="h3" align="center" color="colorSecondary" marginTop={"90px"}>Login to see calendars</Typography>
        </div>
    )
}

export default Home;
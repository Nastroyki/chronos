import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Box } from "@mui/material";

const SwitchType = (props) => {
    const arrangementColor = "orange";
    const reminderColor = "red";
    const taskColor = "blue";
    const holidayColor = "green";
    const otherColor = "purple";
    // <div className="typecircle" style={{ backgroundColor: arrangementColor }}>Arrangement</div>
    switch (props.type) {
        case "arrangement":
            return <Typography variant="h6" textAlign={"center"} marginRight={"32px"}><div className="typecircle" style={{ backgroundColor: arrangementColor }}>Arrangement</div></Typography>;
        case "reminder":
            return <Typography variant="h6" textAlign={"center"} marginRight={"32px"}><div className="typecircle" style={{ backgroundColor: reminderColor }}>Reminder</div></Typography>;
        case "task":
            return <Typography variant="h6" textAlign={"center"} marginRight={"32px"}><div className="typecircle" style={{ backgroundColor: taskColor }}>Task</div></Typography>;
        case "holiday":
            return <Typography variant="h6" textAlign={"center"} marginRight={"32px"}><div className="typecircle" style={{ backgroundColor: holidayColor }}>Holiday</div></Typography>;
        default:
            return <Typography variant="h6" textAlign={"center"} marginRight={"32px"}><div className="typecircle" style={{ backgroundColor: otherColor }}>Other</div></Typography>;
    }
}

export default SwitchType;
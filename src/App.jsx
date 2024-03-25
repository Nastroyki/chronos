import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, createTheme } from "@mui/material";
import Navbar from "./components/Navbar/Navbar";
import AppRouter from "./components/AppRouter";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const App = () => {
    const theme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="content-container">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <BrowserRouter>
                            <Navbar />
                            <AppRouter />
                        </BrowserRouter>
                    </LocalizationProvider>
                </div>
            </ThemeProvider>
        </div>
    )
}

export default App;
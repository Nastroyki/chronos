import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, createTheme } from "@mui/material";
import Navbar from "./components/Navbar/Navbar";
import AppRouter from "./components/AppRouter";
import CalendarsSideMenu from "./components/Calendars/CalendarsSideMenu";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ContextProvider } from "./components/ContextProvider"; 
import "./App.css"

const App = () => {
    const theme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

    const toggleSideMenu = () => {
      setIsSideMenuOpen(!isSideMenuOpen);
    };

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="content-container">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <BrowserRouter>
                            <ContextProvider>
                                <Navbar toggleSideMenu={toggleSideMenu} />
                                <div className={`main-content ${isSideMenuOpen ? 'open' : ''}`}>
                                    <CalendarsSideMenu isOpen={isSideMenuOpen}/>
                                    <AppRouter />
                                </div>
                            </ContextProvider>
                        </BrowserRouter>
                    </LocalizationProvider>
                </div>
            </ThemeProvider>
        </div>
    )
}

export default App;
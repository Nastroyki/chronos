import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, createTheme } from "@mui/material";
import Navbar from "./components/Navbar/Navbar";
import AppRouter from "./components/AppRouter";

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
                    <BrowserRouter>
                        <Navbar />
                        <AppRouter />
                    </BrowserRouter>
                </div>
            </ThemeProvider>
        </div>
    )
}

export default App;
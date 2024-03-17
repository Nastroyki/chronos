import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, createTheme } from "@mui/material";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Login from './pages/Login';
import Register from "./pages/Register";
import UserPage from "./pages/User";
import PostPage from "./pages/Post";

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
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/user/:id" element={<UserPage />} />
                            <Route path="/post/:id" element={<PostPage />} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </ThemeProvider>
        </div>
    )
}

export default App;
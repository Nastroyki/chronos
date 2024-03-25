import Calendar from "../pages/Calendar"
import Calendars from "../pages/Calendars"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"

export const publicRoutes = [
    {
        path: "/login",
        Component: Login
    },
    {
        path: "/register",
        Component: Register
    },
    {
        path: "/",
        Component: Home
    }
]

export const privateRoutes = [
    {
        path: "/calendars",
        Component: Calendars
    },
    {
        path: "/calendars/:id",
        Component: Calendar
    }
]

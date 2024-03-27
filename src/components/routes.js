import Calendar from "../pages/Calendar"
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
    },
    {
        path: "/calendars/:id",
        Component: Calendar
    }
]

export const privateRoutes = [
    {
        path: "/calendars/:id",
        Component: Calendar
    }
]

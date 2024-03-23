import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getUserFromLocalStorage } from "../store/store";
import { privateRoutes, publicRoutes } from "./routes";

const AppRouter = () => {
    const user = getUserFromLocalStorage();
    return (
        <Routes>
            {user && privateRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} exact />
            )}
            {publicRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} exact />
            )}
            <Route path={'*'} element={<Navigate to={"/"} />} />
        </Routes>
    )
}

export default AppRouter;
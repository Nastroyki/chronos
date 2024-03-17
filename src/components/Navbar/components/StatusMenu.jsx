import React from "react";
import Login_Register from "./Login_Register";
import UserMenu from "./UserMenu";
import { getUserFromLocalStorage } from "../../../store/store"; 

const StatusMenu = () => {
    const user = getUserFromLocalStorage();
    return (<React.Fragment>
            {(!user) ? <Login_Register/> : <UserMenu/>}
        </React.Fragment>
    );
}

export default StatusMenu;
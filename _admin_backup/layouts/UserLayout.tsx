import {Outlet} from "react-router-dom";


export default function UserLayout() {
    return(
        <div className={"flex"}>
            USER LAYOUTS...
            <Outlet/>
        </div>
    )
}
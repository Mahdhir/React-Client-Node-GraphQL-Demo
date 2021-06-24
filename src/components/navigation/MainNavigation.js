import React from 'react'
import { NavLink } from 'react-router-dom'
import './MainNavigation.css'
const MainNavigation = (props) => {
    const token = props.token;
    const logout = props.logout;
    return (
        <header className="main-navigation">

            <div className="main-navigation__logo">
                <NavLink to={token?'/events':'auth'}>
                    <h1>EasyEvent</h1>
                </NavLink>
            </div>

            <nav className="main-navigation__items">
                <ul>
                    {!token && <li><NavLink to="/auth">Authenticate</NavLink></li>}
                    <li><NavLink to="/events">Events</NavLink></li>
                    {token &&
                    <>
                        <li><NavLink to="/bookings">Bookings</NavLink></li>
                        <li><button onClick={logout}>Logout</button></li>
                    </>
                    }
                </ul>
            </nav>
        </header>
    )
}

export default MainNavigation


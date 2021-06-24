import './App.css';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';
import { useState } from 'react';

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (token, userId) => {
    setToken(token);
    setUserId(userId);
  }

  const logout = () => {
    setToken(null);
    setUserId(null);
  }
  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ token: token, userId: userId, login: login, logout: logout }}>
        <MainNavigation token={token} logout={logout}/>
        <main className="main-content">
          <Switch>
            {!token && <Route path="/auth" component={AuthPage} />}
            <Route path="/events" component={EventsPage} />
            {token && <Redirect from="/" to="/events" exact />}
            {token && <Redirect from="/auth" to="/events" exact />}
            {token && <Route path="/bookings" component={BookingsPage} />}
            {!token && <Redirect to="/auth" exact />}
          </Switch>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

export default App;

import React, { useRef, useState } from 'react';
import './Auth.css';
import axios from 'axios';
const AuthPage = () => {
    const emailEl = useRef(null);
    const passwordEl = useRef(null);
    const [isLogin, setIsLogin] = useState(true);

    const switchModeHandler = () => {
        setIsLogin(!isLogin);
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        const email = emailEl.current.value;
        const password = passwordEl.current.value;
        if (email.trim().length === 0 || password.trim().length === 0)
            return;

        console.log(email, password);

        let payload = {
            query: `
            query {
                login(email:"${email}",password:"${password}"){
                    userId
                    token
                    tokenExpiration
                }
            }
            `
        }
        if (!isLogin) {
            payload = {
                query: `
                mutation {
                    createUser(userInput:{email:"${email}",password:"${password}"}){
                        _id,
                        email
                    }
                }
                `
            }
        }

        try {

            const response = await axios.post("http://localhost:8000/graphql", JSON.stringify(payload),{
                headers:{
                    'Content-Type': 'application/json'
                }
            });
            if (response.status !== 200 && response.status !== 201) {
                throw new Error("Failed");
            }
            console.log(response.data);
        } catch (error) {
            console.log(error.response?error.response:error);
        }
    }

    return (
        <form className="auth-form" onSubmit={submitHandler}>
            <div className="form-control">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" ref={emailEl}></input>
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref={passwordEl}></input>
            </div>
            <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={switchModeHandler}>Switch to {isLogin ? 'Signup' : 'Login'}</button>
            </div>
        </form>
    )
}

export default AuthPage;
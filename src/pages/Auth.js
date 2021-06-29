import React, { useContext, useRef, useState } from 'react';
import './Auth.css';
import axios from 'axios';
import AuthContext from '../context/auth-context';

const AuthPage = () => {
    const emailEl = useRef(null);
    const passwordEl = useRef(null);
    const [isLogin, setIsLogin] = useState(true);
    const authContext = useContext(AuthContext);
    const switchModeHandler = () => {
        setIsLogin(!isLogin);
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        const email = emailEl.current.value;
        const password = passwordEl.current.value;
        if (email.trim().length === 0 || password.trim().length === 0)
            return;


        let payload = {
            query: `
            query Login($email:String!,$pass:String!){
                login(email:$email,password:$pass){
                    userId
                    token
                    tokenExpiration
                }
            }
            `,
            variables:{
                email:email,
                pass:password
            }
        }
        if (!isLogin) {
            payload = {
                query: `
                mutation CreateUser($email:String!,$pass:String!){
                    createUser(userInput:{email:$email,password:$pass}){
                        _id,
                        email
                    }
                }
                `,
                variables:{
                    email:email,
                    pass:password
                }
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
            const resData = response.data.data;
            authContext.login(resData.login.token,resData.login.userId);
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
import { useEffect, useRef, useState } from 'react';
import { imgurl, callApi, apibaseurl } from './lib';
import './App.css';
import ProgressBar from './components/ProgressBar.jsx';

const App = () => {
    const [isSignin, setIsSignIn] = useState(true);
    const finput = useRef();
    const [isProgress, setIsProgress] = useState(false);
    const [errorData, setErrorData] = useState({});

    const [signupData, setSignupData] = useState({
        fullname: "",
        phone: "",
        email: "",
        password: "",
        retypepassword: "",
        role: ""
    });

    const [signinData, setSigninData] = useState({
        username: "",
        password: "",
        role: ""
    });

    useEffect(() => {
        setTimeout(() => {
            finput.current?.focus();
        }, 100);
    }, [isSignin]);

    function switchWindow() {
        setIsSignIn(prev => !prev);
        setErrorData({});

        setSigninData({
            username: "",
            password: "",
            role: ""
        });

        setSignupData({
            fullname: "",
            phone: "",
            email: "",
            password: "",
            retypepassword: "",
            role: ""
        });
    }

    function handleSigninInput(e) {
        const { name, value } = e.target;

        setSigninData({
            ...signinData,
            [name]: name === "role" ? Number(value) : value
        });

        setErrorData(prev => ({ ...prev, [name]: false }));
    }

    function handleSignupInput(e) {
        const { name, value } = e.target;

        setSignupData({
            ...signupData,
            [name]: name === "role" ? Number(value) : value
        });

        setErrorData(prev => ({ ...prev, [name]: false }));
    }

    function validateSignup() {
        let errors = {};

        if (signupData.fullname === "") errors.fullname = true;

        if (!/^[0-9]{10}$/.test(signupData.phone)) {
            errors.phone = true;
        }

        if (!/\S+@\S+\.\S+/.test(signupData.email)) {
            errors.email = true;
        }

        if (signupData.password === "") errors.password = true;

        if (
            signupData.retypepassword === "" ||
            signupData.password !== signupData.retypepassword
        ) {
            errors.retypepassword = true;
        }

        if (signupData.role === "" || signupData.role === 0) {
            errors.role = true;
        }

        setErrorData(errors);
        return Object.keys(errors).length > 0;
    }

    function validateSignin() {
        let errors = {};

        if (signinData.username === "") errors.username = true;
        if (signinData.password === "") errors.password = true;
        if (signinData.role === "" || signinData.role === 0) {
            errors.role = true;
        }

        setErrorData(errors);
        return Object.keys(errors).length > 0;
    }

    function signin() {
        if (validateSignin()) return;

        setIsProgress(true);

        callApi(
            "POST",
            apibaseurl + "/authservice/signin",
            signinData,
            null,
            signinResponseHandler
        );
    }

    function signup() {
        if (validateSignup()) return;

        setIsProgress(true);

        callApi(
            "POST",
            apibaseurl + "/authservice/signup",
            signupData,
            null,
            signupResponseHandler
        );
    }

    function signinResponseHandler(res) {
        if (res.code !== 200) {
            alert(res.message);
        } else {
            if (res.jwt) {
                localStorage.setItem("token", res.jwt);
                window.location.replace("/home");
            } else {
                alert("Token not received");
            }
        }
        setIsProgress(false);
    }

    function signupResponseHandler(res) {
        alert(res.message);
        setIsProgress(false);

        setSignupData({
            fullname: "",
            phone: "",
            email: "",
            password: "",
            retypepassword: "",
            role: ""
        });

        finput.current?.focus();
    }

    return (
        <div className='app'>
            <div className='container' key={isSignin ? "signin" : "signup"}>
                <div className='container-header'>
                    <label>{isSignin ? "Login" : "Create Account"}</label>
                    <img src={imgurl + "logo.png"} alt='logo' />
                </div>

                <div className='container-content'>

                    {isSignin ? (
                        <>
                            <label>Username*</label>
                            <div className='input-group'>
                                <img src={imgurl + "user.png"} alt="user" />
                                <input
                                    type='text'
                                    ref={finput}
                                    className={errorData.username ? 'error' : ''}
                                    placeholder='Enter email id'
                                    autoComplete='off'
                                    name="username"
                                    value={signinData.username}
                                    onChange={handleSigninInput}
                                />
                            </div>

                            <label>Password*</label>
                            <div className='input-group'>
                                <img src={imgurl + "padlock.png"} alt="lock" />
                                <input
                                    type='password'
                                    className={errorData.password ? 'error' : ''}
                                    placeholder='Enter password'
                                    name='password'
                                    value={signinData.password}
                                    onChange={handleSigninInput}
                                />
                            </div>

                            <label>Role*</label>
                            <div className='input-group'>
                                <select
                                    className={errorData.role ? 'error' : ''}
                                    name='role'
                                    value={signinData.role}
                                    onChange={handleSigninInput}
                                >
                                    <option value="">Select Role</option>
                                    <option value="1">Admin</option>
                                    <option value="2">User</option>
                                    <option value="3">Manager</option>
                                    <option value="4">Guest</option>
                                </select>
                            </div>

                            <p>Forgot <span>Password?</span></p>

                            <button disabled={isProgress} onClick={signin}>
                                Let's start
                            </button>

                            <label onClick={switchWindow}>
                                Don't have an account? <span>Sign up</span>
                            </label>
                        </>
                    ) : (
                        <>
                            <label>Full Name*</label>
                            <div className='input-group'>
                                <img src={imgurl + "user.png"} alt="user" />
                                <input
                                    type='text'
                                    ref={finput}
                                    className={errorData.fullname ? 'error' : ''}
                                    placeholder='Enter full name'
                                    name='fullname'
                                    value={signupData.fullname}
                                    onChange={handleSignupInput}
                                />
                            </div>

                            <label>Mobile Number*</label>
                            <div className='input-group'>
                                <img src={imgurl + "phone.png"} alt="phone" />
                                <input
                                    type='tel'
                                    className={errorData.phone ? 'error' : ''}
                                    placeholder='Enter mobile number'
                                    name='phone'
                                    value={signupData.phone}
                                    onChange={handleSignupInput}
                                />
                            </div>

                            <label>Email Address*</label>
                            <div className='input-group'>
                                <img src={imgurl + "email.png"} alt="email" />
                                <input
                                    type='text'
                                    className={errorData.email ? 'error' : ''}
                                    placeholder='Enter email id'
                                    name='email'
                                    value={signupData.email}
                                    onChange={handleSignupInput}
                                />
                            </div>

                            <label>Password*</label>
                            <div className='input-group'>
                                <img src={imgurl + "padlock.png"} alt="lock" />
                                <input
                                    type='password'
                                    className={errorData.password ? 'error' : ''}
                                    placeholder='Enter password'
                                    name='password'
                                    value={signupData.password}
                                    onChange={handleSignupInput}
                                />
                            </div>

                            <label>Re-type Password*</label>
                            <div className='input-group'>
                                <img src={imgurl + "padlock.png"} alt="lock" />
                                <input
                                    type='password'
                                    className={errorData.retypepassword ? 'error' : ''}
                                    placeholder='Re-type your password'
                                    name='retypepassword'
                                    value={signupData.retypepassword}
                                    onChange={handleSignupInput}
                                />
                            </div>

                            <label>Role*</label>
                            <div className='input-group'>
                                <select
                                    className={errorData.role ? 'error' : ''}
                                    name='role'
                                    value={signupData.role}
                                    onChange={handleSignupInput}
                                >
                                    <option value="">Select Role</option>
                                    <option value="1">Admin</option>
                                    <option value="2">User</option>
                                    <option value="3">Manager</option>
                                    <option value="4">Guest</option>
                                </select>
                            </div>

                            <button disabled={isProgress} onClick={signup}>
                                Register
                            </button>

                            <label onClick={switchWindow}>
                                Already have an account? <span>Sign in</span>
                            </label>
                        </>
                    )}
                </div>

                <div className='container-footer'>
                    Copyright @ 2500030716. All rights reserved.
                </div>
            </div>

            <ProgressBar isProgress={isProgress} />
        </div>
    );
};

export default App;
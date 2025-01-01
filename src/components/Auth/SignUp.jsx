import React, { useState } from 'react';
import './Auth.css';

function SignUp() {
    const [role, setRole] = useState('client');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSignUp = (e) => {
        e.preventDefault();
        // Add your sign-up logic here
        console.log("Role:", role, "Name:", name, "Email:", email, "Password:", password);
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="submit" className="auth-button">Sign Up</button>
            </form>
            <p>
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    );
}

export default SignUp;

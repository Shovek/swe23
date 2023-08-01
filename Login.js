import React, { useContext, useState } from 'react'; 
import { UserContext } from '../../App'; 
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false); 
  const [email, setEmail] = useState(''); 
  const [emailSent, setEmailSent] = useState(false); // <-- New piece of state


  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useContext(UserContext);

  const handleSubmit = (event) => {
    event.preventDefault(); 

    fetch('http://localhost:8080/customer/getAllCustomers')
      .then(response => response.json())
      .then(data => {
          const user = data.find(user => user.username === username && user.password === password);
          if (user) {
              setIsLoggedIn(true);
              setUser(user);
              navigate('/'); 
          } else {
              alert('Login failed. Please try again.');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Login failed. Please try again.');
      });
  };

  const handleAdminLogin = () => {
    navigate('/adminlogin'); 
  };

  const showForgotPasswordForm = () => {
    setForgotPassword(true);
  }


  const handleForgotPassword = (event) => {
      event.preventDefault();

      fetch('http://localhost:8080/customer/getAllCustomers')
      .then(response => response.json())
      .then(data => {
          const user = data.find(user => user.email === email);
          if (user) {
              return fetch('http://localhost:8080/send-email', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      to: email,
                      subject: "Password Recovery",
                      message: `Password linked to account: ${user.password}`
                  })
              }).then(response => {
                  if (response.ok) {
                      setEmailSent(true); 
                  } else {
                      throw new Error("Failed to send recovery email");
                  }
              });
          } else {
              alert('Email not found. Please check and try again.');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('There was an error. Please try again.');
      });
  }

  if (isSubmitted) {
    return <h2>Login Complete</h2>;
  }

  if (forgotPassword) {
    if (emailSent) { 
        return <p>Password recovery email sent!</p>;
    }
    return (
      <form className="forgot-password-form" onSubmit={handleForgotPassword}>
        <label>
          Email*
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    );
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label>
        Username*
        <input
          type="text"
          placeholder="Required Field"
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
          required
        />
      </label>

      <label>
        Password*
        <input
          type="password"
          placeholder="Required Field"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
      </label>

      <button type="submit">Submit</button>
      <button onClick={handleAdminLogin}>Admin Login</button> 
      <p onClick={showForgotPasswordForm} style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}>Forgot Password</p>
    </form>
  );
}

export default Login;
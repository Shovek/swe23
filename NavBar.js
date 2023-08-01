import React, { useContext } from 'react';  
import { Link, useNavigate } from 'react-router-dom';  
import { UserContext } from '../../App';  
import './NavBar.css';  

function NavBar() {
    // Use the useNavigate hook for redirecting users
    const navigate = useNavigate();

    // Access the global state using useContext hook
    const { isLoggedIn, signOut, isAdminLoggedIn } = useContext(UserContext);

    // Handler for signing out
    const handleSignOut = () => {
        signOut();  // Clear the global state
        navigate('/');  // Redirect to home page
    };

    // Return the JSX for the navbar
    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/"><img src="https://static.vecteezy.com/system/resources/thumbnails/009/974/017/small/books-silhouette-free-png.png" alt="Home" className="nav-logo"/></Link></li>

                {/* If the user is not logged in and not an admin, show login and register links */}
                {!isLoggedIn && !isAdminLoggedIn && (
                    <li>
                        <div className="buttons-section">
                            <Link to="/login" className="nav-link">Login</Link>  
                            <Link to="/register" className="nav-link">Register</Link>  
                        </div>
                    </li>
                )}

                {/* If the user is logged in but not an admin, show links for authenticated users */}
                {isLoggedIn && !isAdminLoggedIn && (
                    <>
                        <li>
                            <div className="buttons-section">
                                <Link to="/editProfile" className="nav-link">Edit Profile</Link>  
                                <Link to="/" onClick={handleSignOut} className="nav-link">Sign Out</Link>
                            </div>
                        </li>
                        <li className="cart-logo"><Link to="/checkout"><img src="https://static.thenounproject.com/png/1227111-200.png" alt="Checkout" className="nav-logo"/></Link></li>
                    </>
                )}

                {/* If the admin is logged in, show links for authenticated admin users */}
                {isAdminLoggedIn && (
                    <>
                        <li><Link to="/manageBooks" className="nav-link">Manage Books</Link></li>  
                        <li><Link to="/" className="nav-link">Manage Users</Link></li>  
                        <li><Link to="/" className="nav-link">Manage Promotions</Link></li>  
                        <li><Link to="/" onClick={handleSignOut} className="nav-link">Sign Out</Link></li>
                        <li className="cart-logo"><Link to="/checkout"><img src="https://static.thenounproject.com/png/1227111-200.png" alt="Checkout" className="nav-logo"/></Link></li>

                    </>
                )}
            </ul>
        </nav>
    );
}

export default NavBar;

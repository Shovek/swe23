import React, { useContext, useEffect } from 'react'; 
import { UserContext } from '../../App'; 
import { Link, useNavigate } from 'react-router-dom'; 
import './Checkout.css'; 

// Checkout function component
function Checkout() {
    // Extract values from UserContext
    const { isLoggedIn, cartItems, setCartItems } = useContext(UserContext);

    // useNavigate hook for navigating 
    const navigate = useNavigate();

    // useEffect hook to navigate to home page if user is not logged in or cart is empty
    useEffect(() => {
        if (!isLoggedIn) {
            alert("Please login first.");
            navigate('/login');
        } else if (cartItems.length === 0) {
            alert("At least 1 item needed in cart.");
            navigate('/');
        }
    }, [isLoggedIn, cartItems, navigate]);

    // Function to remove item from the cart
    const removeItem = (index) => {
        const newCartItems = [...cartItems]; // Create a copy of the cartItems array
        newCartItems.splice(index, 1); // Remove the item at given index
        setCartItems(newCartItems); // Update the cartItems state
    }

    // Calculate the total price of the books in the cart
    const totalPrice = cartItems.reduce((total, book) => total +parseInt(book.price), 0);

    // Guard clause to prevent rendering if user is not logged in or the cart is empty
    if (!isLoggedIn || cartItems.length === 0) {
        return null;
    }

    const handleSubmit = (event) => {
        console.log('hi')
    }

    // Return Checkout JSX
    return (
        <div className="checkout">
            <h2>Checkout</h2>  
            <label className="promotions">    
                <input
                type="text"
                placeholder="Apply promotion code here"
                />
            </label>

            <h3 className="total-price">Total Price: ${totalPrice}</h3> 
            {cartItems.length === 0 
                ? <p>Your cart is empty.</p> // If cart is empty, display this message
                : (
                    // If there are items in the cart, display each book with a remove button
                    cartItems.map((book, index) => (
                        <div key={index} className="cart-item">
                            <img src={book.imageUrl} alt="Book" className="bookImage" /> 
                            <p>{book.title} - ${book.price}</p> 
                            <button onClick={() => removeItem(index)} className="btn-remove">Remove</button> 
                        </div>
                    ))
                )
            }
            <Link to="/payment" className="continue-button">Continue to Payment</Link> 
        </div>
    );
}

export default Checkout;

import React, { useContext, useState } from 'react'; 
import { UserContext } from '../../App'; 
import './Payment.css'; 
import { v4 as uuidv4 } from 'uuid';

// Payment function component
function Payment() {
    const { isLoggedIn, cartItems, clearCart } = useContext(UserContext);
    const [cardInfo, setCardInfo] = useState(''); 
    const [address, setAddress] = useState(''); 
    const [paymentComplete, setPaymentComplete] = useState(false); 
    const [orderId, setOrderId] = useState(null);
    const [receiptItems, setReceiptItems] = useState([]);
    const [email, setEmail] = useState(''); 
    const [emailSent, setEmailSent] = useState(false); // <-- New piece of state
    // Handler for card info change
    const handleCardInfoChange = (event) => {
        setCardInfo(event.target.value); 
    };

    // Handler for shipping address change
    const handleAddressChange = (event) => {
        setAddress(event.target.value); 
    };

    // Handler for form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent form from refreshing the page
        if(cardInfo === '' || address === '') { // If any field is empty
            alert('Please fill all the fields'); // Alert the user to fill all fields
            return;
        }
        // Save the cartItems in receiptItems before clearing the cart
        setReceiptItems([...cartItems]);
        setOrderId(uuidv4()); // Generate a unique order ID
        setPaymentComplete(true); // Update payment status to complete
        clearCart(); // Clear the cart
    };

    // If the user is not logged in, display a message
    if (!isLoggedIn) {
        return <div>Please login first.</div>;
    }


    // Return Payment JSX
    return (
        <div className="payment">
            {paymentComplete ? ( // If payment is complete, display the receipt
                <div className="payment-receipt">
                    <h2>Payment Complete</h2>
                    <hr />
                    <ul>
                        {receiptItems.map((item, index) => (
                            <li key={index} className="receipt-item">{item.title} - ${item.price}</li> 
                        ))}
                    </ul>
                    <h3>Total: ${receiptItems.reduce((total, book) => total + parseInt(book.price), 0)}</h3>
                    <hr />
                    <h4>Order ID: {orderId}</h4>
                </div>


            ) : ( // If payment is not complete, display the form
                <form onSubmit={handleSubmit}>
                    <label>
                        Card Info: 
                        <input type="text" placeholder="Required" value={cardInfo} onChange={handleCardInfoChange} required/>
                    </label>
                    <label>
                        Shipping Address: 
                        <input type="text" placeholder="Required" value={address} onChange={handleAddressChange} required/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            )}
        </div>
    );
}

export default Payment;
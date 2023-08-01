import React, { useState, useEffect, useContext } from 'react'; 
import { UserContext } from '../../App'; 
import './HomePage.css'; 
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [input, setInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [cartAlert, setCartAlert] = useState('');

    const { isLoggedIn, cartItems, setCartItems, featuredBooks, topSellerBooks } = useContext(UserContext);
    
    const navigate = useNavigate();

    function renderBook(book) {
        const { bookID, imageUrl, title, price } = book;

        const showDetails = () => {
            navigate(`/book/${bookID}`);
        };

        const addToCart = () => {
            if (!isLoggedIn) {
                alert('Please login first');
                return;
            }
            setCartItems([...cartItems, book]);
            setCartAlert(`${book.title} has been added to the cart!`);

            setTimeout(() => {
                setCartAlert('');
            }, 3000);
        };

        return (
            <div className="book">
                <img src={imageUrl} alt="Book" className="bookImage" />
                <p>{title}</p>
                <p>Price: ${price}</p>
                <button onClick={showDetails} className="btn-details">View Details</button>
                <button onClick={addToCart} className="btn-addtocart">Add to Cart</button>
            </div>
        );
    }

    const filteredFeaturedBooks = featuredBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredTopSellerBooks = topSellerBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearch = () => setSearchTerm(input);

    return (
        <div className="homePage">
            <input
                type="text"
                placeholder="Search for a book"
                onChange={(event) => setInput(event.target.value)}
            />
            <button onClick={handleSearch} className='searchButton'>Search</button>

            {cartAlert && <div className="cart-alert">{cartAlert}</div>}

            <h2>Featured Books</h2>
            <div className="books">
                {filteredFeaturedBooks.map(renderBook)}
            </div>

            <h2>Top Sellers</h2>
            <div className="books">
                {filteredTopSellerBooks.map(renderBook)}
            </div>
        </div>
    );
}

export default HomePage;
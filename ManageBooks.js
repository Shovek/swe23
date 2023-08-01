import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import './ManageBooks.css';

function ManageBooks() {
    const { featuredBooks, topSellerBooks, setFeaturedBooks, setTopSellerBooks } = useContext(UserContext);
    const [newBook, setNewBook] = useState({
        id: '',
        imageUrl: '',
        title: '',
        price: '',
        author: '',
        summary: '',
        isbn: '',
        isFeatured: true
    });

    const handleInputChange = e => {
        setNewBook({ ...newBook, [e.target.name]: e.target.value });
    };

    const handleRadioChange = e => {
        setNewBook({ ...newBook, isFeatured: e.target.value === "featured" });
    };


    const generateBookId = () => {
        // Combine featuredBooks and topSellerBooks into one array
        const allBooks = [...featuredBooks, ...topSellerBooks];

        // Get the highest existing book id
        const maxId = allBooks.reduce((maxId, book) => Math.max(book.id, maxId), 0);

        // Return the next available id
        return maxId + 1;
    };


    const handleAddBook = e => {
        e.preventDefault();
        // Generate a unique id for the book
        newBook.id = generateBookId();

        // Send POST request to the server
        fetch('http://localhost:8080/book/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBook)
        })
            .then(response => {
                // Always clear the form regardless of success or failure
                setNewBook({
                    id: '',
                    imageUrl: '',
                    title: '',
                    price: '',
                    author: '',
                    summary: '',
                    isbn: '',
                    isFeatured: true
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    return fetch('http://localhost:8080/book/getAll');
                }
                throw new Error(data.message);
            })
            .then(response => response.json())
            .then(data => {
                const fetchedFeaturedBooks = data.filter(book => book.isFeatured);
                const fetchedTopSellerBooks = data.filter(book => !book.isFeatured);

                setFeaturedBooks(fetchedFeaturedBooks);
                setTopSellerBooks(fetchedTopSellerBooks);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    };




    const handleRemoveBook = id => {
        // Filter out the book with the given id
        setFeaturedBooks(featuredBooks.filter(book => book.id !== id));
        setTopSellerBooks(topSellerBooks.filter(book => book.id !== id));
    };

    return (
        <div className="manage-books">
            <h2>Manage Books</h2>
            <form className="book-form" onSubmit={handleAddBook}>
                <input type="text" name="imageUrl" placeholder="Image URL" onChange={handleInputChange} value={newBook.imageUrl} required />
                <input type="text" name="title" placeholder="Title" onChange={handleInputChange} value={newBook.title} required />
                <input type="text" name="price" placeholder="Price" onChange={handleInputChange} value={newBook.price} required />
                <input type="text" name="author" placeholder="Author" onChange={handleInputChange} value={newBook.author} required />
                <input type="text" name="summary" placeholder="Summary" onChange={handleInputChange} value={newBook.summary} required />
                <input type="text" name="isbn" placeholder="ISBN" onChange={handleInputChange} value={newBook.isbn} required />
                <div>
                    <label>
                        <input type="radio" name="isFeatured" value="featured" checked={newBook.isFeatured} onChange={handleRadioChange} />
                        Featured Book
                    </label>
                    <label>
                        <input type="radio" name="isFeatured" value="topSeller" checked={!newBook.isFeatured} onChange={handleRadioChange} />
                        Top Seller Book
                    </label>
                </div>
                <button type="submit">Add Book</button>
            </form>
            <div className="book-list">
                {[...featuredBooks, ...topSellerBooks].map(book => (
                    <div key={book.id} className="book-item">
                        <img src={book.imageUrl} alt={book.title} />
                        <h3>{book.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManageBooks;
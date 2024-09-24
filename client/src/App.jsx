import { useState, useEffect } from 'react';

const API_URL = "http://127.0.0.1:5000/books";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [editingBookId, setEditingBookId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const validateInputs = () => {
    return title.trim() !== '' && author.trim() !== '' && description.trim() !== '';
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    setLoading(true);
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
  };

  const addBook = () => {
    if (!validateInputs()) {
      alert('All fields are required!');
      return;
    }
    const newBook = { title, author, description };
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    })
      .then(() => {
        fetchBooks();
        resetForm();
        setMessage('Book added successfully!');
      })
      .catch((error) => {
        console.error('Error adding book:', error);
        setMessage('Error adding book.');
      });
  };

  const deleteBook = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => {
          fetchBooks();
          setMessage('Book deleted successfully!');
        })
        .catch((error) => {
          console.error('Error deleting book:', error);
          setMessage('Error deleting book.');
        });
    }
  };

  const updateBook = (id) => {
    if (!validateInputs()) {
      alert('All fields are required!');
      return;
    }
    const updatedBook = { title, author, description };
    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBook),
    })
      .then(() => {
        fetchBooks();
        resetForm();
        setEditingBookId(null);
        setMessage('Book updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating book:', error);
        setMessage('Error updating book.');
      });
  };

  const editBook = (book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setDescription(book.description);
    setEditingBookId(book.id);
  };

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setDescription('');
    setEditingBookId(null);
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Book Management System</h1>
      {message && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-center">{message}</p>}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">{editingBookId ? 'Edit Book' : 'Add New Book'}</h2>
        <input
          type="text"
          placeholder="Title"
          className="border border-gray-300 rounded-md p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          className="border border-gray-300 rounded-md p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="border border-gray-300 rounded-md p-2 mb-4 w-full h-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {editingBookId ? (
          <button onClick={() => updateBook(editingBookId)} className="bg-green-500 text-white rounded-md p-2 hover:bg-green-600 transition">
            Update Book
          </button>
        ) : (
          <button onClick={addBook} className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition">
            Add Book
          </button>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ul className="space-y-4">
          {books.map((book) => (
            <li key={book.id} className="border border-gray-300 rounded-lg p-4 flex justify-between items-center bg-white shadow-md hover:shadow-lg transition">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{book.title}</h2>
                <p className="text-gray-600">Author: {book.author}</p>
                <p className="text-gray-700">{book.description}</p>
              </div>
              <div>
                <button onClick={() => editBook(book)} className="bg-yellow-500 text-white rounded-md p-2 mr-2 hover:bg-yellow-600 transition">
                  Edit
                </button>
                <button onClick={() => deleteBook(book.id)} className="bg-red-500 text-white rounded-md p-2 hover:bg-red-600 transition">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

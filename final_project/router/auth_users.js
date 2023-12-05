const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const user = users.find(u => u.username === username);
    return !user; // Returns false if user is found, true otherwise
}

const authenticatedUser = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    return !!user; // Returns true if user is found, false otherwise
  };

regd_users.get("/get", (req, res) => {
    res.send(users);
})
  

regd_users.post("/register", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (!isValid(username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    users.push({ username, password });
  
    return res.status(201).json({ message: "User registered successfully" });
});
  

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (authenticatedUser(username, password)) {
      const token = jwt.sign({ username }, "access");
  
      req.session.authorization = { accessToken: token };
  
      return res.status(201).json({ message: "User logged in successfully", token });
    }
  
    return res.status(404).json({ message: "No user found with these credentials" });
  });  

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
  
    const username = jwt.decode(req.session.authorization.accessToken).username;
  
    // Check if the ISBN and review are provided
    if (!isbn || !review) {
      return res.status(400).json({ message: "ISBN and review are required" });
    }

    let existingKey;

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    const keyArray = Object.keys(book.reviews);

    for(const key of keyArray){
        if(book.reviews[key].username === username){
            existingKey = key;
        }
    }

    if (existingKey) {
      // Modify existing review
      book.reviews[existingKey].review = review;
      return res.status(200).json({ message: "Review modified successfully" });
    } else {
      // Add a new review
      book.reviews[keyArray.length + 1] = { username, review };
      return res.status(201).json({ message: "Review added successfully" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = jwt.decode(req.session.authorization.accessToken).username;

    // Check if the ISBN is provided
    if (!isbn) {
      return res.status(400).json({ message: "ISBN is required" });
    }

    const book = books[isbn];

    // Check if the book exists
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Find the review index for the logged-in user
    const reviewIndex = Object.keys(book.reviews).find(
      (key) => book.reviews[key].username === username
    );

    // Check if the user has a review for this book
    if (reviewIndex) {
      // Delete the user's review
      delete book.reviews[reviewIndex];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "No review found for the user and ISBN" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    try {
        //const response = await axios.get(books);
        const booksResponse = books;
        return res.send(JSON.stringify(booksResponse));
    } catch (error) {
        console.error("Error fetching books:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    try {
        const isbn = req.params.isbn;
        //const response = await axios.get(books);
        const booksResponse = books;
        return res.send(JSON.stringify(booksResponse[isbn]));
    } catch (error) {
        console.error("Error fetching books:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    try {
    let author = req.params.author.toLowerCase();
    author = author.replace("_", " ");
    //const response = await axios.get(books);
    const booksResponse = books;
    const keysArray = Object.keys(booksResponse);
    const authorBook = {};
    for(const key of keysArray){
        if(booksResponse[key].author.toLowerCase() === author){
            authorBook[key] = booksResponse[key];
        }
    }
    return res.send(JSON.stringify(authorBook));
    } catch (error) {
        console.error("Error fetching books:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    } 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    try {
      let title = req.params.title.toLowerCase();
    title = title.replace("_", " ");
    //const response = await axios.get(books);
    const booksResponse = books;
    const keysArray = Object.keys(booksResponse);
    const titleBook = {};
    for(const key of keysArray){
        if(booksResponse[key].title.toLowerCase() === title){
            titleBook[key] = booksResponse[key];
        }
    }
    return res.send(JSON.stringify(titleBook));
} catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ message: "Internal Server Error" });
}
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;

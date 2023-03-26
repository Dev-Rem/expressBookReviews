const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  let all_books = await JSON.stringify(books);
  return res.status(200).send(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  let selected_book = await books[req.params.isbn];
  res.status(200).send(selected_book);
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  const keys = Object.keys(books);
  let books_searched = [];
  await keys.forEach((element) => {
    if (books[element].author === req.params.author) {
      books_searched.push(books[element]);
    }
  });
  res.status(200).send(books_searched);
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  const keys = Object.keys(books);
  let books_searched = [];
  await keys.forEach((element) => {
    if (books[element].title === req.params.title) {
      books_searched.push(books[element]);
    }
  });
  res.status(200).send(books_searched);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let book_reviews = books[req.params.isbn].reviews;
  res.status(200).send(book_reviews);
});

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

module.exports.general = public_users;

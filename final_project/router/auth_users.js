const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const router = express.Router();

let users = [];

const isValid = (username) => {
  let username_used = users.filter((user) => {
    return user.username === username;
  });
  if (username_used.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 120 }
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
router.put("/auth/review/:isbn", (req, res) => {
  let book = books[req.params.isbn];
  let username = req.session.authorization.username;
  let filtered_book_reviews = book.reviews.filter(
    (user_review) => user_review.username === username
  );

  if (filtered_book_reviews.length > 0) {
    let filtered_book_review = filtered_book_reviews[0];
    if (req.body.review) {
      filtered_book_review.review = new_review;
    }
  } else {
    book.reviews.push({ username: username, review: req.body.review });
  }

  res.send(book);
});

router.delete("/auth/review/:isbn", (req, res) => {
  let book = books[req.params.isbn];
  let username = req.session.authorization.username;
  let filtered_book_reviews = book.reviews.filter(
    (user_review) => user_review.username === username
  );
  if (filtered_book_reviews.length > 0) {
    let filtered_book_review = filtered_book_reviews[0];
    let review_to_delete = book.reviews.indexOf(filtered_book_review);
    book.reviews.splice(review_to_delete, 1);
    res.send('Your review has been deleted')
  } else {
    res.send("Review does not exist");
  }
});

module.exports.authenticated = router;
module.exports.isValid = isValid;
module.exports.users = users;

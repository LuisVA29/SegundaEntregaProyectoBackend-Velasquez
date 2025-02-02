const { Router } = require("express");
const path = require("path");
const pathDB = path.join(`${__dirname}/../dao/products.json`);
const styles = path.join(`${__dirname}/../public/styles/styles.css`);
const DBProductManager = require("../dao/DBProductManager");
const products = new DBProductManager();
const DBMessagesManager = require("../dao/DBMessagesManager");
const messages = new DBMessagesManager();
const DBCartManager = require("../dao/DBCartManager");
const cart = new DBCartManager();

const router = Router();

router.get("/", (req, res) => {
  const { page = 1, limit = 6, sort } = req.query;

  let query = {};

  if (req.query.status) {
    query = { status: req.query.status };
  }

  if (req.query.category) {
    query = {
      category:
        req.query.category.charAt(0).toUpperCase() +
        req.query.category.slice(1),
    };
  }

  const url = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);

  products
    .getProducts(page, limit, sort, query, url)
    .then((result) => {
      console.log(result);
      res.render("index", {
        title: "Proyecto final 2",
        products: result.payload,
        nextPage: result.nextLink,
        prevPage: result.prevLink,
        currentPage: page,
        style: "styles.css",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err.message);
    });
});

router.get("/realtimeproducts", (req, res) => {
  const { page = 1, limit = 6, sort } = req.query;

  let query = {};

  if (req.query.status) {
    query = { status: req.query.status };
  }

  if (req.query.category) {
    query = {
      category:
        req.query.category.charAt(0).toUpperCase() +
        req.query.category.slice(1),
    };
  }

  const url = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);

  products
    .getProducts(page, limit, sort, query, url)
    .then((result) => {
      res.render("realtimeproducts", {
        title: "Proyecto final 2 - Productos en tiempo real",
        products: result.payload,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err.message);
    });
});

router.get("/chat", (req, res) => {
  messages
    .getAllMessages()
    .then((result) => {
      res.render("chat", {
        title: "Proyecto final 2 - Chat en tiempo real",
        messages: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err.message);
    });
});

router.get("/products", (req, res) => {
  const { page = 1, limit = 6, sort } = req.query;

  let query = {};

  if (req.query.status) {
    query = { status: req.query.status };
  }

  if (req.query.category) {
    query = {
      category:
        req.query.category.charAt(0).toUpperCase() +
        req.query.category.slice(1),
    };
  }

  const url = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);

  products
    .getProducts(page, limit, sort, query, url)
    .then((result) => {
      res.render("products", {
        title: "Productos proyecto final",
        products: result.payload,
        nextPage: result.nextLink,
        prevPage: result.prevLink,
        style: "styles.css",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err.message);
    });
});

router.get("/carts/:cid", (req, res) => {
  const idCart = req.params.cid;

  cart
    .getCartProducts(idCart)
    .then((result) => {
      console.log(result);
      res.render("cart", {
        title: "Proyecto final 2 - Carrito de Compras",
        product: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err.message);
    });
});

module.exports = router;

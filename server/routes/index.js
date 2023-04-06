const express = require("express");
const authRoute = require("./auth.route");
const articleRoute = require("./article.route");
const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/article",
    route: articleRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;

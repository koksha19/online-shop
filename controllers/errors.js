exports.getNotFound = (req, res) => {
  res.status(404).render("404", {
    pageTitle: "Not found",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getError = (req, res) => {
  res.status(500).render("500", {
    pageTitle: "Error",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
};

module.exports.isLoggedIn = (req, res, next) => {
    if (typeof req.isAuthenticated !== "function" || !req.isAuthenticated()) {
        req.flash("error", "You must be signed in to do that!");
        return res.redirect("/login");
    }
    next();
};

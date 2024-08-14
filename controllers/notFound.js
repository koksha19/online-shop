exports.getNotFound = (req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Not found', path: undefined});
}

function errorHandler(err, req, res, next) {
    if (err.status) {
        res.status(err.status).json({
            message: err.message,
            error: err.error
        });
    } else {
        res.status(500).json({
            message: err.message || 'Internal server error',
            error: err.error || err
        });
    }
}

function notFoundHandler(req, res, next) {
    res.status(404).json({
        message: 'Not found',
        error: 'Not found'
    });
}

function errorLogger(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

function error(status, message, error) {
    return { status, message, error };
}

function errorNext(next, status, message, error) {
    next(error(status, message, error));
}

export default {
    errorHandler,
    notFoundHandler,
    errorLogger,
    error,
    errorNext
}
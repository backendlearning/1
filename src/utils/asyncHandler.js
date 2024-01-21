// Helper file as wraper handeling with promises

const asyncHandler = (requestHandler) => {
        return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch
        ((err) => next(err))
    };
};

export { asyncHandler };

// higher order function
// const asyncHandler = () => {} --> wrapping
//const asyncHandler = (fn) => {() => {}}
// const asyncHandler = (fn) => () => {}

// const asyncHandler = (fn) => async (err, req, res, next) => {
//     try {
//         await fn(err, req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success:false,
//             message: err.message
//         })
//     }
// }
const catchApiErrors = fn => (req, res, next) => {
    fn(req, res, next).catch(next)
}

export default catchApiErrors

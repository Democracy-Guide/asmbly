module.exports = (req, res, next) => {
	req.ip_address = req.headers['fastly-client-ip']
	next()
}

const randNum = (min, max) => {
	return Math.floor(
		Math.random() * (+Number(max) - +Number(min)) + +Number(min)
	)
}

module.exports.generate = () => {
	return randNum(1300000, 130000000)
		.toString(26)
		.toUpperCase()
}

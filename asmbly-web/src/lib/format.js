const second = 1000

const minute = 60 * second

const hour = 60 * minute

const day = 24 * hour

const week = 7 * day

const formatDate = dated => {
	const diff = new Date().getTime() - dated

	if (diff < 2 * minute) {
		return `${parseInt(diff / second)} seconds ago`
	} else if (diff < 2 * hour) {
		return `${parseInt(diff / minute)} minutes ago`
	} else if (diff < 2 * day) {
		return `${parseInt(diff / hour)} hours ago`
	} else if (diff < 2 * week) {
		return `${parseInt(diff / day)} days ago`
	} else {
		return `${parseInt(diff / week)} weeks ago`
	}
}

// counts are abbreviated at billion, million and thousand
// when abbreviating we only want the abbreviated value to nearest tenth

const billion = 1000000000
const billionDiv = 100000000

const million = 1000000
const millionDiv = 100000

const thousand = 1000
const thousandDiv = 100

const floatTen = 10.0

const formatCount = counted => {
	if (counted >= billion) {
		return `${parseInt(counted / billionDiv) / floatTen}B`
	} else if (counted >= million) {
		return `${parseInt(counted / millionDiv) / floatTen}M`
	} else if (counted >= thousand) {
		return `${parseInt(counted / thousandDiv) / floatTen}k`
	} else {
		return counted
	}
}

export { formatDate, formatCount }

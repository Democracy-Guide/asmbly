const cloudKms = require('@google-cloud/kms')
const credentials = JSON.parse(process.env.FIREBASE_CONFIG)
//const keyrings = JSON.parse(process.env.FIREBASE_KMS)

const crypto_client = new cloudKms.KeyManagementServiceClient()

const kms = Object.freeze({
	CRYPTO_PROJECT: 'ASMBLY',
	CRYPTO_LOCATION: 'global',
	CRYPTO_ENCRYPT_KEYRING: 'AsmblyDevKeyRing',
	CRYPTO_ENCRYPT_KEY: 'ApiEncrypt',
	CRYPTO_VERSION: '1',
	CRYPTO_CLIENT: 'undefined',
})

const name = crypto_client.cryptoKeyPath(
	kms.CRYPTO_PROJECT,
	kms.CRYPTO_LOCATION,
	kms.CRYPTO_ENCRYPT_KEYRING,
	kms.CRYPTO_ENCRYPT_KEY
)

/**
 * encodes plaintext for encryption
 * static method
 * @param {string} plaintext the text to encode
 * @returns base64 encoded string
 */
const encodeForEncryption = plaintext => {
	const contentsBuffer = Buffer.from(plaintext)
	return contentsBuffer.toString('base64')
}

/**
 * decodes encoded content for decryption
 * static method
 * @param {string} encoded the text to decode
 * @returns ascii encoded string
 */
const decodeForDecryption = encoded => {
	const decrypted = Buffer.from(encoded, 'base64')
	return decrypted.toString('ascii')
}

/**
 * encrypts data
 * static method
 * @param {string} content the text to encrypt
 * @returns {Promise<string>} encrypted string base 64 encoded
 */
const encryptData = async content => {
	if (!content) {
		return new Promise(resolve => {
			resolve('')
		})
	}
	const plaintext = encodeForEncryption(content)

	const [result] = await crypto_client.encrypt({
		name,
		plaintext,
	})

	const encrypted = Buffer.from(result.ciphertext, 'base64').toString(
		'base64'
	)

	return new Promise(resolve => {
		resolve(encrypted)
	})
}

/**
 * decrypts data
 * static method
 * @param {string} encrypted the encrypted content to decrypt
 * @returns {Promise<string>} decrypted string ascii encoded
 */
const decryptData = async encrypted => {
	/* istanbul ignore next */
	if (!encrypted) {
		return new Promise(resolve => {
			resolve('')
		})
	}
	const ciphertext = encrypted

	const [result] = await crypto_client.decrypt({
		name,
		ciphertext,
	})

	const decoded = decodeForDecryption(result.plaintext)

	return new Promise(resolve => {
		resolve(decoded)
	})
}

/**
 * encrypts data for a data model
 * static method
 * @param {Object} definition of data including which elements need encryption
 * @param {Object} data the content to encrypt
 * @returns {Object} data object encrypted per model
 */
const encrypt = async (model, data) => {
	let encryptedKeys = []
	let encryptionQueue = []
	Object.entries(model.definition).forEach(property => {
		const key = property[0]
		const val = property[1]
		if (val.encrypted) {
			encryptedKeys.push(key)
			encryptionQueue.push(encryptData(data[key]))
		}
	})
	const encryptedValues = await Promise.all(encryptionQueue)

	for (let encIndex in encryptedValues) {
		const key = encryptedKeys[encIndex]
		data[key] = encryptedValues[encIndex]
	}

	return data
}

/**
 * decrypts data for a data model
 * static method
 * @param {Object} definition of data including which elements need encryption
 * @param {Object} data the content to encrypt
 * @returns {Object} data object decrypted per model
 */
const decrypt = async (model, data) => {
	let encryptedKeys = []
	let decryptionQueue = []
	Object.entries(model.definition).forEach(property => {
		const key = property[0]
		const val = property[1]
		if (val.encrypted) {
			encryptedKeys.push(key)
			decryptionQueue.push(decryptData(data[key]))
		}
	})
	const decryptedValues = await Promise.all(decryptionQueue)

	for (let encIndex in decryptedValues) {
		const key = encryptedKeys[encIndex]
		data[key] = decryptedValues[encIndex]
	}

	return data
}

module.exports = {
	encrypt: encrypt,
	decrypt: decrypt,
	encryptData: encryptData,
	decryptData: decryptData,
}

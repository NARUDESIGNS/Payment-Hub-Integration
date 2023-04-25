const crypto = require('crypto');

const payload = {
    "amount": 50.00,
    "batchID": 123,
    "transaction": 123,
    "industryType": "E",
    "cardEntryMethod": "Z"
};
const endpoint = "https://epi.epxuap.com/sale/09LKFKXZHM8M8Y2NB9F/capture";
const secretKey = "8EEDC66DF02D7803E05321281FAC8C31";

function signData(secretKey, payload) {
    const signature = crypto // see possible hash algorithms commented below
        .createHmac('sha512', secretKey)
        .update(JSON.stringify(endpoint) + JSON.stringify(payload))
        .digest('hex');
    console.log(payload, signature);
    return signature;
}
signData(secretKey, endpoint + JSON.stringify(payload));

// HASH REF to be used with the crypto.creatHmac() method
// 'sha1': SHA-1 algorithm (160-bit hash)
// 'sha224': SHA-224 algorithm (224-bit hash)
// 'sha256': SHA-256 algorithm (256-bit hash)
// 'sha384': SHA-384 algorithm (384-bit hash)
// 'sha512': SHA-512 algorithm (512-bit hash)
// 'sha3-224': SHA-3 algorithm with a 224-bit hash
// 'sha3-256': SHA-3 algorithm with a 256-bit hash
// 'sha3-384': SHA-3 algorithm with a 384-bit hash
// 'sha3-512': SHA-3 algorithm with a 512-bit hash
// 'blake2b512': BLAKE2b algorithm with a 512-bit hash
// 'blake2s256': BLAKE2s algorithm with a 256-bit hash
const crypto = require('crypto');
const fs = require('fs');

const encrypt = (password) => {
    const salt = crypto.randomBytes(32).toString('hex');
    const digest = crypto.pbkdf2Sync(password, salt, 1, 32, 'sha512').toString('hex');
    return digest;
}

const password = 'qwerty';
const digest = encrypt(password);

fs.writeFile(`${__dirname}/hashed.txt`, digest, (err) => {
    if(err) throw err;
    console.log('password encrypt success');
})





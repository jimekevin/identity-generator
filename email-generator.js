const fs = require('fs');
const l = console.log;
const randBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const zeroPad = (value) => value < 10 ? `0${value}` : value;
Object.defineProperty(Array.prototype, 'rand', {
  value: function() { return this[randBetween(0, this.length - 1)]; }
});
const readJson = (file) => JSON.parse(fs.readFileSync(file)).items;
const firstnames = readJson('firstnames.json');
const surnames = readJson('surnames.json');
const zips = readJson('zips.json');
const emails = ['gmx.com', 'gmail.com', 'gmx.de', 'gmail.de', 'web.de', 'yahoo.com'];
const addons = [
  '89','90','91','92','93','94','95','96','97',
  '1989','1990','1991','1992','1993','1994','1995','1996','1997',
  '123','321','256','18'
];
const randBirthday = () => `${zeroPad(randBetween(1, 28))}.${zeroPad(randBetween(1, 12))}.${randBetween(1989, 1997)}`;
const randPass = () => Math.random().toString(36).slice(-8);
const randIdentity = () => {
  const rf = firstnames.rand();
  const rs = surnames.rand();
  const re = emails.rand();
  const rb = randBirthday();
  const rcz = zips.rand();
  const [rc, rz] = [rcz.city, rcz.zip]; 
  const randType = randBetween(0, 5);
  let email;
  switch (randType) { // _ and - are mostly disallowed
    case 0: email = `${rf}.${rs}`; break;
    case 1: email = `${rs}.${rf}`; break;
    case 2: email = `${rf}${rs}`; break;
    case 3: email = `${rs}${rf}`; break;
  }
  email += randBetween(0, 5) === 0 ? addons.rand() : '';
  return [`${email}@${re}`, rf, rs, rb, rc, rz, randPass()];
};
const requested = process.argv[2] !== undefined ? parseInt(process.argv[2]) : 1;
const randOut = () => l(randIdentity().join(','));
l('email,firstname,surname,birthday,city,zip,pass');
[...Array(requested).keys()].map(randOut);

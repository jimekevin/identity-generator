/* jshint esversion: 11 */ 
const fs = require('fs');
const l = console.log;
const repeat = (repeat, fn) => [...Array(repeat ?? 0)].map(fn);
const randBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFromDistribution = (distrs) => {
  const minVal = distrs.reduce((acc, cur) => Math.min(acc, cur));
  distrs = distrs.map((val) => val * (1.0 / minVal ));
  distrs = distrs.map((val, i, arr) => { return arr[i] += (i - 1 >= 0 ? arr[i - 1] : 0); });
  const r = randBetween(0, distrs[distrs.length - 1]);
  for (let i = 0; i < distrs.length; i++) if (distrs[i] >= r) return i;
  return distrs.length - 1;
};
const zeroPad = (value) => value < 10 ? `0${value}` : value;
Object.defineProperty(Array.prototype, 'rand', {
  value: function() { return this[randBetween(0, this.length - 1)]; }
});
Object.defineProperty(String.prototype, 'randTrunc', {
  value: function(min, max) { return this.slice(0, randBetween(min ?? 3, Math.min(max ?? this.length - 1, this.length - 1))); }
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
  const randType = randFromDistribution([1, 1, 1, 1, 0.5, 0.5]);
  let email;
  switch (randType) { // _ and - are mostly disallowed
    case 0: email = `${rf}.${rs}`; break;
    case 1: email = `${rs}.${rf}`; break;
    case 2: email = `${rf}${rs}`; break;
    case 3: email = `${rs}${rf}`; break;
    case 4: email = `${rs.randTrunc()}${rf}`; break;
    case 5: email = `${rs}${rf.randTrunc()}`; break;
  }
  email += randBetween(0, 5) === 0 ? addons.rand() : '';
  return [`${email}@${re}`, rf, rs, rb, rc, rz, randPass()];
};
const requested = process.argv[2] !== undefined ? parseInt(process.argv[2]) : 1;
const randOut = () => l(randIdentity().join(','));
if (requested > 0) l('email,firstname,surname,birthday,city,zip,pass');
repeat(requested, randOut);
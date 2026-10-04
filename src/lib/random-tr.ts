const STREETS = [
  "Atatürk Caddesi",
  "Cumhuriyet Bulvarı",
  "İnönü Sokak",
  "Gazi Mustafa Kemal Cad.",
  "Barbaros Mah. 7. Sk.",
  "Fatih Sultan Mehmet Cad.",
  "Bahçelievler 12. Sokak",
  "Yenimahalle 4. Cadde",
  "Sanayi Sitesi 3. Yol",
  "Kültür Mahallesi 606 Sokak",
];

const MAHALLE = [
  "Merkez Mahallesi",
  "Yeni Mahalle",
  "Cumhuriyet Mahallesi",
  "Aşağıpazar Mahallesi",
  "Bahçelievler Mahallesi",
  "Kültür Mahallesi",
  "İstiklal Mahallesi",
  "Gazi Mahallesi",
];

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Random street-level Turkish address bits (mahalle, sokak, no, kat, daire). */
export function randomAddressParts() {
  const mahalle = pick(MAHALLE);
  const street = pick(STREETS);
  const buildingNo = String(randInt(1, 180));
  const floor = String(randInt(0, 12)); // 0 = zemin
  const apartment = String(randInt(1, 24));
  const floorLabel = floor === "0" ? "Zemin" : floor;
  const full = `${mahalle} ${street} No: ${buildingNo} Kat: ${floorLabel} Daire: ${apartment}`;
  return {
    mahalle,
    street,
    buildingNo,
    floor: floorLabel,
    apartment,
    full,
  };
}

export function randomGsm() {
  const mid = String(randInt(100, 999));
  const last = String(randInt(1000, 9999));
  return `0532 ${mid} ${last.slice(0, 2)} ${last.slice(2)}`;
}

/** Generates a syntactically 11-digit TC-like number (not a real validated ID). */
export function randomTcKimlik() {
  let s = String(randInt(1, 9));
  for (let i = 0; i < 10; i++) s += String(randInt(0, 9));
  return s;
}

export function randomPerson() {
  const first = pick([
    "Ahmet",
    "Mehmet",
    "Ayşe",
    "Fatma",
    "Emre",
    "Elif",
    "Can",
    "Zeynep",
    "Burak",
    "Selin",
  ]);
  const last = pick([
    "Yılmaz",
    "Kaya",
    "Demir",
    "Çelik",
    "Şahin",
    "Yıldız",
    "Öztürk",
    "Aydın",
    "Arslan",
    "Doğan",
  ]);
  return { firstName: first, lastName: last };
}

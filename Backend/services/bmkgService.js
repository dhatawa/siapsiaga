const BMKG_URL =
  'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json';

async function getLatestEarthquake() {
  const response = await fetch(BMKG_URL);

  if (!response.ok) {
    throw new Error(
      `BMKG Error ${response.status}`
    );
  }

  const data = await response.json();

  if (!data.Infogempa || !data.Infogempa.gempa) {
    throw new Error(
      'Format data BMKG tidak sesuai'
    );
  }

  const gempa = data.Infogempa.gempa;

  return {
    id: 'bmkg-latest',
    source: 'BMKG',

    date: gempa.Tanggal,

    time: gempa.Jam,

    datetime: gempa.DateTime,

    magnitude: gempa.Magnitude,

    depth: gempa.Kedalaman,

    coordinates: gempa.Coordinates,

    latitude: gempa.Lintang,

    longitude: gempa.Bujur,

    location: gempa.Wilayah,

    potential: gempa.Potensi,

    felt: gempa.Dirasakan,

    shakemap: gempa.Shakemap
  };
}

module.exports = {
  getLatestEarthquake
};
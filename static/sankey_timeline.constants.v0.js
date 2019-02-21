const SCALE = 4;
const HSR3 = Math.sqrt(3) / 2;
const SR3 = Math.sqrt(3);


const WIDTH = 1500;
const HEIGHT = WIDTH * 3 / 4;
const ELEC_BOX = [700, 150];
const ELEC_GAP = 20;
const LEFT_X = 10;
const TOP_Y = 100;
const LEFT_GAP = 30;
const PATH_GAP = 20;
const RIGHT_GAP = LEFT_GAP * 2;
const BOX_WIDTH = 200;
const FUELS = [
  {fuel: 'elec', color: '#e49942', name: 'Electricity' },
  {fuel: 'solar', color: '#fed530', name: 'Solar' },
  {fuel: 'nuclear', color: '#ca0813', name: 'Nuclear' },
  {fuel: 'hydro', color: '#0b24fb', name: 'Hydro' },
  {fuel: 'wind', color: '#901d8f', name: 'Wind' },
  {fuel: 'geo', color: '#905a1c', name: 'Geothermal' },
  {fuel: 'gas', color: '#4cabf2', name: 'Natural gas' },
  {fuel: 'coal', color: '#000000', name: 'Coal' },
  {fuel: 'bio', color: '#46be48', name: 'Biomass' },
  {fuel: 'petro', color: '#095f0b', name: 'Petroleum' }
];
const BOX_GREY = '#cccccc';
const BOXES = [
  { box: 'elec', color: BOX_GREY, name: 'Electricity' },
  { box: 'res', color: BOX_GREY, name: 'Residential' },
  { box: 'comm', color: BOX_GREY, name: 'Commercial' },
  { box: 'ag', color: BOX_GREY, name: 'Agricultural' },
  { box: 'indus', color: BOX_GREY, name: 'Industrial' },
  { box: 'trans', color: BOX_GREY, name: 'Transportation' }
];
const FUEL_NAMES = FUELS.map(d => d.fuel);
const BOX_NAMES = BOXES.map(d => d.box);
const FLOW_ORDER = [
  ['elec', 'res'],
  ['solar ', 'res'],
  ['petro', 'trans'],
  ['nuclear', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
  ['elec', 'res'],
]
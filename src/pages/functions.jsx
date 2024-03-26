export let wordlist = [
    [
        ['BOMB', 'EEL', 'BAND', 'STEAM', 'POND', 'STAR', 'PEACH', 'CLOWN', 'SPRING', 'NOSE', 'TRAIN', 'SLUSH', 'FROG'] ,
        ['JUICE', 'PIE', 'GATE', 'RAIN', 'SNAKE', 'BOY', 'BRANCH', 'CUBE', 'THUMB', 'MAT', 'HOLE', 'FUDGE', 'KEY'] ,
        ['CONE', 'STOOL', 'HORN', 'SOAP', 'CASH', 'JEEP', 'PET', 'CHALK', 'FOOD', 'SKUNK', 'PEARL', 'MOOSE', 'WAVE'] ,
        ['STICK', 'DESK', 'BEE', 'STORE', 'DOCK', 'PIPE', 'LAMB', 'FORT', 'GRASS', 'STEAK', 'CLIFF', 'SEAL', 'BUSH'] ,
        ['HILL', 'CAPE', 'TOAD', 'VEST', 'PIG', 'CANE', 'SEAT', 'SUIT', 'STORM', 'RAT', 'ROCK', 'BROOM', 'PIT'] ,
        ['HAT', 'INK', 'MOUTH', 'SPEAR', 'CORD', 'FOX', 'ROSE', 'WORLD', 'GLASS', 'HORSE', 'PLANE', 'SHIELD', 'RIB']
    ]
    ,
    [
        ['STAIR', 'TAIL', 'PRINCE', 'ARM', 'TRASH', 'PASTE', 'SEA', 'MAZE', 'JET', 'FOAM', 'COW', 'SMILE', 'PEA'] ,
        ['EGG', 'VASE', 'BEAR', 'SMOKE', 'LIP', 'DRUM', 'WORM', 'GRAPE', 'VAN', 'STRAW', 'WOOD', 'SHOE', 'BOOK'] ,
        ['SLEEVE', 'SOUP', 'PEAR', 'GLOVE', 'SAIL', 'WALL', 'CRANE', 'VINE', 'FLEA', 'PARK', 'MAIL', 'SEED', 'SUN'] ,
        ['PEN', 'POOL', 'ROOT', 'SOCK', 'STEM', 'PLATE', 'ROOF', 'MUG', 'BOWL', 'GEESE', 'LOCK', 'MULE', 'BANK'] ,
        ['FAN', 'WOLF', 'BRIDGE', 'CAKE', 'CROWN', 'FLUTE', 'BAT', 'SALT', 'FLAG', 'NEST', 'TREE', 'HEN', 'DART'] ,
        ['FACE', 'HOOK', 'MAP', 'WEED', 'ICE', 'RUG', 'CLOCK', 'MAD', 'BADGE', 'BIRD', 'YARD', 'FOOT', 'RATS']
    ]
    ,
    [
        ['DOOR', 'BEACH', 'PHONE', 'COIN', 'FARM', 'POLE', 'SQUARE', 'SPIN', 'GUARD', 'STOVE', 'ZOO', 'FISH', 'SINK'] ,
        ['TOE', 'LEG', 'SWAMP', 'PURSE', 'MOON', 'SPARK', 'BRICK', 'SHARK', 'BRAIN', 'LAWN', 'PLANT', 'LEAF', 'TOOL'] ,
        ['TOAST', 'ROAD', 'HOUSE', 'FLAME', 'BLUSH', 'WHALE', 'SHEET', 'LAND', 'CORN', 'MOLE', 'ANT', 'SWORD', 'CAGE'] ,
        ['SCHOOL', 'STONE', 'LAKE', 'GOAT', 'FUR', 'DOG', 'BOARD', 'AXE', 'HAWK', 'HOSE', 'DUCK', 'BOX', 'RAKE'] ,
        ['JAR', 'DOLL', 'APE', 'CALF', 'TOY', 'TEETH', 'WING', 'CHIEF', 'ARK', 'COUCH', 'FLOOR', 'BAG', 'TRAY'] ,
        ['CHEEK', 'SNAIL', 'SNOW', 'GOLD', 'CHIN', 'CAVE', 'BAIL', 'CUP', 'FRUIT', 'PALM', 'JUDGE', 'ELF', 'STRING']
    ]
];
export let trial_wordlist = [
    ['FENCE', 'SHIP', 'ROPE', 'SIGN', 'TEA', 'BOOT', 'OAK', 'SHELL', 'SHRIMP', 'KITE', 'CLOTH','WHEEL'],
    ['DITCH', 'BEAN', 'JUG', 'BARN', 'OWL', 'STREET', 'CLAY', 'TENT', 'FORK', 'PIN', 'TRUCK','HEART'],
    ['SHIRT', 'GUM', 'RICE', 'WEB', 'SHEEP', 'LAMP', 'MUD', 'CLOUD', 'SLIME', 'DARK','JAIL','PANTS']
];
export function randomize(array) {
    return array.map((element) => {
        if (Array.isArray(element)) {
        return randomize(element);
        }
        return element;
    }).sort(() => Math.random() - 0.7);
    }
export function randomize_wordList(nestedArrays) {
    return randomize(nestedArrays);
}
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// _______________________________________________________ FUNCTIONS _______________________________________________________
export function generateRandomList(count, min, max) {
    const randomList = Array.from({ length: max - min + 1 }, (_, i) => i + min);
    for (let i = count - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomList[i], randomList[j]] = [randomList[j], randomList[i]];
    }
    return randomList.slice(0, count);
  }
export function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
  // Handling the saving of the file.
export const handleSave = (filename, data) => {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export function make_stimuli(wordlist, time1, time2) {
    // time1 = 22 
    // time2 = 68

    const shuffledList = wordlist.slice();
    const res1 = [];
    const res2 = [];
    for (let i = 0; i < shuffledList.length - 1; i++) {
        const currentWord = shuffledList[i];
        for (let j = i + 1; j < shuffledList.length; j++) {
            const nextWord = shuffledList[j];
            const diff = Math.round(Math.abs(nextWord.start - currentWord.end));
            const words = Math.random() < 0.5 ? [currentWord, nextWord] : [nextWord, currentWord];
            if (diff >= Math.round(0.95 * time1) && diff <= Math.round(1.05 * time1)) {
                res1.push(words);
            }
            if (diff >= Math.round(0.95 * time2) && diff <= Math.round(1.05 * time2)) {
                res2.push(words);
            }
        }
    }
    console.log(res1);
    console.log(res2);
    const minLength = Math.min(res1.length, res2.length);
    const combinedList = res1.slice(0, minLength).concat(res2.slice(0, minLength));
    return combinedList.sort(() => Math.random() - 0.5);;
}
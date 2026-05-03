import fs from 'fs';

let html = fs.readFileSync('src/constants/genealogy.html', 'utf8');

const dictionary = {
    'GOD': 'தேவன்',
    'Adam': 'ஆதாம்',
    'Eve': 'ஏவாள்',
    'Cain': 'காயீன்',
    'Abel': 'ஆபேல்',
    'Seth': 'சேத்',
    'Wife \\(unnamed\\)': 'மனைவி',
    'Enoch': 'ஏனோக்கு',
    'Irad': 'ஈராத்',
    'Mehujael': 'மெகுயவேல்',
    'Methushael': 'மெத்தூசவேல்',
    'Lamech': 'லாமேக்கு',
    'Adah': 'ஆதாள்',
    'Zillah': 'சில்லாள்',
    'Jabal': 'யாபால்',
    'Jubal': 'யூபால்',
    'Tubal-Cain': 'தூபல்காயீன்',
    'Naamah': 'நாமாள்',
    'Enosh': 'ஏனோஸ்',
    'Kenan': 'கேனான்',
    'Mahalalel': 'மகலாலெயேல்',
    'Jared': 'யாரேத்',
    'Methuselah': 'மெத்தூசலா',
    'Noah': 'நோவா',
    'Shem': 'சேம்',
    'Ham': 'காம்',
    'Japheth': 'யாப்பேத்',
    'Cush': 'கூஷ்',
    'Mizraim': 'மிஸ்ராயீம்',
    'Put': 'பூத்',
    'Canaan': 'கானான்',
    'Gomer': 'கோமேர்',
    'Magog': 'மாகோகு',
    'Madai': 'மாதாய்',
    'Javan': 'யாவான்',
    'Tubal': 'தூபால்',
    'Meshech': 'மேசேக்',
    'Arphaxad': 'அர்ப்பகசாத்',
    'Cainan': 'கேனான்',
    'Shelah': 'சாலா',
    'Eber': 'ஏபேர்',
    'Peleg': 'பேலேகு',
    'Joktan': 'யொக்தான்',
    'Reu': 'ரெகூ',
    'Serug': 'செரூக்',
    'Nahor \\(I\\)': 'நாகோர்',
    'Terah': 'தேராகு',
    'Abraham': 'ஆபிரகாம்',
    'Nahor \\(II\\)': 'நாகோர்',
    'Haran': 'ஆரான்',
    'Lot': 'லோத்து',
    'Milcah': 'மில்காள்',
    'Iscah': 'இஸ்காள்',
    'Bethuel': 'பெத்துவேல்',
    'Laban': 'லாபான்',
    'Rebekah': 'ரெபெக்காள்',
    'Sarah': 'சாராள்',
    'Hagar': 'ஆகார்',
    'Keturah': 'கேத்தூராள்',
    'Ishmael': 'இஸ்மவேல்',
    'Zimran': 'சிம்ரான்',
    'Jokshan': 'யொக்ஷான்',
    'Medan': 'மேதான்',
    'Midian': 'மீதியான்',
    'Ishbak': 'இஸ்பாக்',
    'Shuah': 'சூவாகு',
    'Isaac': 'ஈசாக்கு',
    'Esau': 'ஏசா',
    'Jacob / Israel': 'யாக்கோபு / இஸ்ரவேல்',
    'Leah': 'லேயாள்',
    'Rachel': 'ராகேல்',
    'Bilhah': 'பில்காள்',
    'Zilpah': 'சில்பாள்',
    'Reuben': 'ரூபன்',
    'Simeon': 'சிமியோன்',
    'Levi': 'லேவி',
    'Judah ★': 'யூதா ★',
    'Judah': 'யூதா',
    'Issachar': 'இசக்கார்',
    'Zebulun': 'செபுலோன்',
    'Dinah': 'தீனாள்',
    'Dan': 'தாண்',
    'Naphtali': 'நப்தலி',
    'Gad': 'காத்',
    'Asher': 'ஆசேர்',
    'Joseph': 'யோசேப்பு',
    'Benjamin': 'பென்யமீன்',
    'Kohath': 'கோகாத்',
    'Amram': 'அம்ராம்',
    'Jochebed': 'யோகெபேத்',
    'Moses': 'மோசே',
    'Aaron': 'ஆரோன்',
    'Miriam': 'மிரியாம்',
    'Asenath': 'ஆஸ்நாத்',
    'Manasseh': 'மனாசே',
    'Ephraim': 'எப்பிராயீம்',
    'Tamar': 'தாமார்',
    'Perez': 'பேரேஸ்',
    'Zerah': 'சேராகு',
    'Hezron': 'எஸ்ரோன்',
    'Ram': 'ராம்',
    'Amminadab': 'அம்மினதாப்',
    'Nahshon': 'நகசோன்',
    'Salmon': 'சல்மோன்',
    'Rahab': 'ராகாப்',
    'Boaz': 'போவாஸ்',
    'Ruth': 'ரூத்',
    'Obed': 'ஓபேத்',
    'Jesse': 'ஈசாய்',
    'King David': 'தாவீது ராஜா',
    'Bathsheba': 'பத்சேபாள்',
    'Solomon': 'சாலொமோன்',
    'Rehoboam': 'ரெகொபெயாம்',
    'Abijah': 'அபியா',
    'Asa': 'ஆசா',
    'Jehoshaphat': 'யோசபாத்',
    'Joram': 'யோராம்',
    'Uzziah': 'உசியா',
    'Jotham': 'யோதாம்',
    'Ahaz': 'ஆகாஸ்',
    'Hezekiah': 'எசேக்கியா',
    'Amon': 'ஆமோன்',
    'Josiah': 'யோசியா',
    'Jeconiah': 'எகோனியா',
    'Shealtiel': 'செயல்தியேல்',
    'Zerubbabel': 'செருபாபேல்',
    'Abiud': 'அபியூத்',
    'Eliakim': 'எலியாக்கீம்',
    'Azor': 'ஆசோர்',
    'Zadok': 'சாதோக்',
    'Achim': 'ஆகீம்',
    'Eliud': 'எலியூத்',
    'Eleazar': 'எலெயாசார்',
    'Matthan': 'மாத்தான்',
    'Jacob': 'யாக்கோபு',
    'Mary \\(Miriam\\)': 'மரியாள்',
    'Holy Spirit': 'பரிசுத்த ஆவியானவர்',
    'JESUS CHRIST': 'இயேசு கிறிஸ்து',
    'Other sons': 'மற்ற குமாரர்கள்'
};

const exactInfoMatches = {
    "info\\('Enoch \\(son of Cain\\)'": "info('Enoch (ஏனோக்கு)'",
    "info\\('Lamech \\(Cain\\'s\\)'": "info('Lamech (லாமேக்கு)'",
    "info\\('Lamech \\(Seth\\'s line\\)'": "info('Lamech (லாமேக்கு)'",
    "info\\('Abraham \\(Abram\\)'": "info('Abraham (ஆபிரகாம்)'",
    "info\\('Uzziah \\(Azariah\\)'": "info('Uzziah (உசியா)'",
    "info\\('Jeconiah \\(Jehoiachin\\)'": "info('Jeconiah (எகோனியா)'",
    "info\\('Joram \\(Jehoram\\)'": "info('Joram (யோராம்)'",
    "info\\('Jacob \\(father of Joseph\\)'": "info('Jacob (யாக்கோபு)'",
    "info\\('Joseph \\(husband of Mary\\)'": "info('Joseph (யோசேப்பு)'",
    "info\\('Mary'": "info('Mary (மரியாள்)'"
};

for (const [key, val] of Object.entries(exactInfoMatches)) {
    html = html.replace(new RegExp(key, 'g'), val);
}

for (const [eng, tam] of Object.entries(dictionary)) {
    // Escape parenthesis for regex
    let engRegexStr = eng.replace(/\\/g, ''); // Remove the \\ for normal exact matching
    let engStr = eng.replace(/\\/g, '');

    // Replace info popup names
    // Examples: info('Adam', -> info('Adam (ஆதாம்)',
    // We only replace if it's not already replaced
    html = html.replace(new RegExp(`info\\('${engStr}'`, 'g'), `info('${engStr} (${tam})'`);
    html = html.replace(new RegExp(`info\\("${engStr}"`, 'g'), `info('${engStr} (${tam})'`);

    // Replace the visual label on the SVG diagram
    // >Adam</text> -> >Adam (ஆதாம்)</text>
    html = html.replace(new RegExp(`>${engStr}</text>`, 'g'), `>${engStr} (${tam})</text>`);
}

// In case some boxes are too narrow, let's artificially expand all rect widths by 40 pixels!
// Find width="120" and change to width="160"
html = html.replace(/width="(\d+)"/g, (match, p1) => {
    let newWidth = parseInt(p1) + 60; // adding 60px to accommodate Tamil text comfortably
    return `width="${newWidth}"`;
});

// Since we expanded the rects, they will grow to the right. We need to shift them left by half the growth to keep them centered,
// OR since text is anchored to the center of the text (and positioned relative to the parent), 
// increasing width doesn't ruin the center alignment if we just increase width. 
// Wait, rects are drawn from top-left (x, y). If we increase width, it grows to the right. 
// We should subtract 30 from 'x' to keep the box centered around the text!
html = html.replace(/<rect class="box ([^"]+)" x="(\d+)"/g, (match, p1, p2) => {
    let newX = parseInt(p2) - 30;
    return `<rect class="box ${p1}" x="${newX}"`;
});

fs.writeFileSync('src/constants/genealogy.html', html);
console.log('Translated to Tamil successfully!');

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 300 }, debug: false }
    },
    scene: { preload: preload, create: create, update: update }
};

let player, stars, aliens, ladders, door, cursors;
let currentLevel = 1;

const game = new Phaser.Game(config);

function preload() {
    // כאן טוענים תמונות (Placeholder - ניתן להחליף בקישורים לתמונות אמיתיות)
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('star', 'https://labs.phaser.io/assets/demoscene/star.png');
    this.load.image('penguin', 'https://labs.phaser.io/assets/sprites/orange-cat1.png'); // החלף בפינגווין
    this.load.image('cheerleader', 'https://labs.phaser.io/assets/sprites/purple-cat1.png'); // פינגווין מעודד
    this.load.image('alien', 'https://labs.phaser.io/assets/sprites/space-baddie.png');
    this.load.image('ladder', 'https://labs.phaser.io/assets/sprites/columns.png');
}

function create() {
    this.add.image(400, 300, 'sky');
    
    // יצירת פלטפורמות ומדרגות
    let platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');

    // מדרגות
    ladders = this.physics.add.staticGroup();
    ladders.create(200, 450, 'ladder');

    // השחקן (פינגווין)
    player = this.physics.add.sprite(100, 450, 'penguin');
    player.setCollideWorldBounds(true);

    // פינגווין מעודד (עומד בצד)
    this.add.sprite(50, 500, 'cheerleader').setFlipX(true);

    // כוכבים לאיסוף
    stars = this.physics.add.group({
        key: 'star', repeat: 5, setXY: { x: 12, y: 0, stepX: 70 }
    });

    // דלת לשלב הבא (מוסתרת בהתחלה)
    door = this.physics.add.staticSprite(750, 500, 'ground').setScale(0.2).setTint(0x00ff00);
    door.disableBody(true, true);

    // הגדרת מקשים
    cursors = this.input.keyboard.createCursorKeys();

    // התנגשויות
    this.physics.add.collider(player, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.overlap(player, ladders, climb, null, this);
    this.physics.add.overlap(player, door, nextLevel, null, this);
}

function update() {
    // תנועה בסיסית
    if (cursors.left.isDown) player.setVelocityX(-160);
    else if (cursors.right.isDown) player.setVelocityX(160);
    else player.setVelocityX(0);

    if (cursors.up.isDown && player.body.touching.down) player.setVelocityY(-330);
    
    // איפוס גרביטציה כשמטפסים
    player.body.allowGravity = true;
}

function collectStar(player, star) {
    star.disableBody(true, true);
    if (stars.countActive(true) === 0) {
        door.enableBody(false, 750, 500, true, true); // הדלת מופיעה
    }
}

function climb(player, ladder) {
    if (cursors.up.isDown) {
        player.body.allowGravity = false;
        player.setVelocityY(-100);
    }
}

function nextLevel() {
    alert("כל הכבוד! עוברים לשלב הבא!");
    location.reload(); // פשוט מרענן לשם הדוגמה, כאן בונים לוגיקה לשלב 2
}

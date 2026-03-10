const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB', // צבע שמיים תכלת
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 500 }, debug: false }
    },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);
let player, stars, platforms, cursors, ladders, door;
let score = 0;

function preload() {
    // טעינת ספריות גרפיקה בסיסיות (אם הלינקים נשברים, נשתמש בגרפיקה מובנית)
    this.load.image('star', 'https://labs.phaser.io/assets/demoscene/star.png');
}

function create() {
    // יצירת רצפה ומדפים (מלבנים ירוקים)
    platforms = this.physics.add.staticGroup();
    let ground = this.add.rectangle(400, 580, 800, 40, 0x228B22); // רצפה
    this.physics.add.existing(ground, true);
    platforms.add(ground);

    let ledge = this.add.rectangle(600, 400, 200, 20, 0x228B22); // מדף
    this.physics.add.existing(ledge, true);
    platforms.add(ledge);

    // סולם (מלבן חום)
    ladders = this.physics.add.staticGroup();
    let ladder = this.add.rectangle(250, 450, 40, 260, 0x8B4513);
    this.physics.add.existing(ladder, true);
    ladders.add(ladder);

    // שחקן - פינגווין (מלבן כחול)
    player = this.add.rectangle(100, 450, 30, 40, 0x0000FF);
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);

    // כוכבים
    stars = this.physics.add.group();
    for (let i = 0; i < 5; i++) {
        let star = this.physics.add.sprite(150 + (i * 100), 100, 'star');
        stars.add(star);
    }

    // דלת (מלבן שחור שמופיע בסוף)
    door = this.add.rectangle(750, 530, 50, 70, 0x000000);
    this.physics.add.existing(door, true);
    door.visible = false;

    // מקשים
    cursors = this.input.keyboard.createCursorKeys();

    // התנגשויות
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, (p, s) => { s.destroy(); score++; checkWin(); }, null, this);
    this.physics.add.overlap(player, door, () => { if(door.visible) alert("עברת שלב!"); }, null, this);
}

function update() {
    player.body.allowGravity = true;

    if (cursors.left.isDown) player.body.setVelocityX(-160);
    else if (cursors.right.isDown) player.body.setVelocityX(160);
    else player.body.setVelocityX(0);

    if (cursors.up.isDown && player.body.touching.down) player.body.setVelocityY(-350);

    // טיפוס על סולם
    this.physics.overlap(player, ladders, () => {
        if (cursors.up.isDown) {
            player.body.setVelocityY(-150);
            player.body.allowGravity = false;
        }
    });
}

function checkWin() {
    if (score >= 5) {
        door.visible = true;
        console.log("הדלת נפתחה!");
    }
}

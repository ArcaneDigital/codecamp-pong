var game = new Phaser.Game(480,640, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update
});

var playerBet, computerBet, ball;
var computerBetSpeed = 190;
var ballSpeed = 300;
var ballReleased = false;
var playerBetHalfWidth;

function preload () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.load.image('bet', '/image/sprite/paddle/paddle.png');
    game.load.image('ball', '/image/sprite/ball/ball.png');
    game.load.image('background', '/image/starfield.png');
}

function create () {
    game.add.tileSprite(0,0,480,640,'background');
    playerBet = createBet(game.world.centerX, 624);
    computerBet = createBet(game.world.centerX, 16);
    ball = createBall(game.world.centerX, game.world.centerY);
    playerBetHalfWidth = playerBet.width / 2;
    game.input.onDown.add(setBall, this);
}

function update () {
    controlPlayerPaddle(game.input.x);
    controlComputerPaddle();
    processBallAndPaddleCollisions();
    checkGoal();
}

function createBet (x,y) {
    var bet = game.add.sprite(x,y, 'bet');
    game.physics.arcade.enable(bet);
    bet.anchor.setTo(0.5,0.5);
    bet.body.collideWorldBounds = true;
    bet.body.bounce.setTo(1,1);
    bet.body.immovable = true;

    return bet;
}

function createBall (x,y) {
    var tmpBall = game.add.sprite(x,y, 'ball');
    game.physics.arcade.enable(tmpBall);
    tmpBall.anchor.setTo(0.5,0.5);
    tmpBall.body.collideWorldBounds = true;
    tmpBall.body.bounce.setTo(1, 1);

    return tmpBall;
}

function setBall () {
    if (ballReleased) {
        ball.x = game.world.centerX;
        ball.y = game.world.centerY;
        ball.body.velocity.x = 0;
        ball.body.velocity.y = 0;
        ballReleased = false;
    } else {
        ball.body.velocity.x = ballSpeed;
        ball.body.velocity.y = -ballSpeed;
        ballReleased = true;
    }
}

function controlPlayerPaddle (x) {
    playerBet.x = x;

    if (playerBet.x < playerBetHalfWidth) {
        playerBet.x = playerBetHalfWidth;
    } else if (playerBet.x > game.width - playerBetHalfWidth) {
        playerBet.x = game.width - playerBetHalfWidth;
    }
}

function controlComputerPaddle () {
    if (computerBet.x - ball.x < -15) {
        computerBet.body.velocity.x = computerBetSpeed;
    } else if(computerBet.x - ball.x > 15) {
        computerBet.body.velocity.x = -computerBetSpeed;
    } else {
        computerBet.body.velocity.x = 0;
    }
}

function processBallAndPaddleCollisions () {
    game.physics.arcade.collide(ball, playerBet, ballHitsBet, null, this);
    game.physics.arcade.collide(ball, computerBet, ballHitsBet, null, this);
}

function ballHitsBet (_ball, _bet) {
    var diff = 0;

    if (_ball.x < _bet.x) {
        diff = _bet.x - _ball.x;
    } else if (_ball.x > _bet.x) {
        diff = _ball.x - _bet.x;
        _ball.body.velocity.x = (10*diff);
    } else {
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }
}

function checkGoal () {
    if (ball.y < 13) {
        setBall();
    } else if (ball.y > 629) {
        setBall();
    }
}

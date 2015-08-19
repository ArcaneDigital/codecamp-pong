var game = new Phaser.Game(480, 640, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update
});

var playerPaddle, computerPaddle, ball;
var computerPaddleSpeed = 190;
var ballSpeed = 300;
var ballReleased = false;

function preload () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.load.image('paddle', '/image/sprite/paddle/paddle.png');
    game.load.image('ball', '/image/sprite/ball/ball.png');
}

function create () {
    game.stage.backgroundColor = '#990000';
    playerPaddle = createPaddle(game.world.centerX, game.height - 50);
    computerPaddle = createPaddle(game.world.centerX, 30);
    ball = createBall(game.world.centerX, game.world.centerY);
    game.input.onDown.add(setBall, this);
}

function update () {
    controlPlayerPaddle(game.input.x);
    controlComputerPaddle();
    processBallAndPaddleCollisions();
    checkGoal();
}

function createPaddle (x,y) {
    var paddle = game.add.sprite(x,y, 'paddle');
    game.physics.arcade.enable(paddle);
    paddle.body.collideWorldBounds = true;
    paddle.body.bounce.setTo(1,1);
    paddle.body.immovable = true;

    return paddle;
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
    playerPaddle.x = x;

    if (playerPaddle.x < 0) {
        playerPaddle.x = 0;
    } else if (playerPaddle.x + playerPaddle.width > game.width) {
        playerPaddle.x = game.width - playerPaddle.width;
    }
}

function controlComputerPaddle () {
    if (computerPaddle.x - ball.x < -15) {
        computerPaddle.body.velocity.x = computerPaddleSpeed;
    } else if(computerPaddle.x - ball.x > 15) {
        computerPaddle.body.velocity.x = -computerPaddleSpeed;
    } else {
        computerPaddle.body.velocity.x = 0;
    }
}

function processBallAndPaddleCollisions () {
    game.physics.arcade.collide(ball, playerPaddle, ballHitsPaddle, null, this);
    game.physics.arcade.collide(ball, computerPaddle, ballHitsPaddle, null, this);
}

function ballHitsPaddle (_ball, _paddle) {
    var diff = 0;

    if (_ball.x < _paddle.x) {
        diff = _paddle.x - _ball.x;
    } else if (_ball.x > _paddle.x) {
        diff = _ball.x - _paddle.x;
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

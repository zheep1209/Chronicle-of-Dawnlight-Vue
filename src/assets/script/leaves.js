var stop, staticx;
var img = new Image();
img.src = "https://img.picgo.net/2024/11/13/4507231c2c798fadd07a2774a5bde4ee58afa47d678b9826.png";

function Sakura(x, y, s, r, fn) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.r = r;
    this.fn = fn;
    this.canvas = document.createElement("canvas");
    this.cxt = this.canvas.getContext("2d");
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.canvas.style.position = "fixed";
    this.canvas.style.left = "0";
    this.canvas.style.top = "0";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = Math.random() < 0.5 ? "1" : "1000";
    document.body.appendChild(this.canvas);
}

Sakura.prototype.draw = function() {
    this.cxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.cxt.save();
    this.cxt.translate(this.x, this.y);
    this.cxt.rotate(this.r);
    this.cxt.drawImage(img, 0, 0, 20 * this.s, 20 * this.s);
    this.cxt.restore();
};

Sakura.prototype.update = function() {
    this.x = this.fn.x(this.x, this.y);
    this.y = this.fn.y(this.y, this.y);
    this.r = this.fn.r(this.r);

    // 确保叶子在超出屏幕边界时重新初始化
    if (this.x > window.innerWidth || this.x < 0 || this.y > window.innerHeight || this.y < 0) {
        this.r = getRandom("fnr");
        if (Math.random() > 0.4) {
            this.x = getRandom("x");
            this.y = 0;
            this.s = getRandom("s");
            this.r = getRandom("r");
        } else {
            this.x = window.innerWidth;
            this.y = getRandom("y");
            this.s = getRandom("s");
            this.r = getRandom("r");
        }
    }
};

let SakuraList = function() {
    this.list = [];
};

SakuraList.prototype.push = function(sakura) {
    this.list.push(sakura);
};

SakuraList.prototype.update = function() {
    for (var i = 0, len = this.list.length; i < len; i++) {
        this.list[i].update();
    }
};

SakuraList.prototype.draw = function() {
    for (var i = 0, len = this.list.length; i < len; i++) {
        this.list[i].draw();
    }
};

SakuraList.prototype.get = function(i) {
    return this.list[i];
};

SakuraList.prototype.size = function() {
    return this.list.length;
};

function getRandom(option) {
    var ret, random;
    switch (option) {
        case "x":
            ret = Math.random() * window.innerWidth;
            break;
        case "y":
            ret = Math.random() * window.innerHeight;
            break;
        case "s":
            ret = 0.5 + Math.random() * 0.5; // 确保缩放比例不会太小
            break;
        case "r":
            ret = Math.random() * 4;
            break;
        case "fnx":
            random = -0.5 + Math.random() * 1;
            ret = function(x, y) {
                return x + 0.5 * random - 1.7;
            };
            break;
        case "fny":
            random = 1.5 + Math.random() * 0.7;
            ret = function(x, y) {
                return y + random;
            };
            break;
        case "fnr":
            random = Math.random() * 0.03;
            ret = function(r) {
                return r + random;
            };
            break;
    }
    return ret;
}

function startSakura() {
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;
    staticx = true;
    var sakuraList = new SakuraList();
    for (var i = 0; i < 20; i++) {
        var sakura, randomX, randomY, randomS, randomR, randomFnx, randomFny, randomFnR;
        randomX = getRandom("x");
        randomY = getRandom("y");
        randomR = getRandom("r");
        randomS = getRandom("s");
        randomFnx = getRandom("fnx");
        randomFny = getRandom("fny");
        randomFnR = getRandom("fnr");
        sakura = new Sakura(randomX, randomY, randomS, randomR, {
            x: randomFnx,
            y: randomFny,
            r: randomFnR
        });
        sakuraList.push(sakura);
    }

    function animate() {
        sakuraList.update();
        sakuraList.draw();
        stop = requestAnimationFrame(animate);
    }

    animate();
}

window.onresize = function() {
    if (staticx) {
        stopp();
        startSakura();
    }
};

img.onload = function() {
    startSakura();
};

function stopp() {
    if (staticx) {
        var child = document.getElementById("canvas_sakura");
        while (child = document.querySelector("[style*='position: fixed; left: 0px; top: 0px; pointer-events: none;']")) {
            child.parentNode.removeChild(child);
        }
        window.cancelAnimationFrame(stop);
        staticx = false;
    } else {
        startSakura();
    }
}

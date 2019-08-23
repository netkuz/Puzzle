class Panel {
    constructor(l) {
        this.level = l;
        this.canvas = $("canvas", 0, "id=canvas;className=canvas;");
        this.canvasElm = document.getElementById('canvas');
        this.context = this.canvasElm.getContext('2d');
        this.img = new Image();
        this.img.src = "images/image.jpg";
        this.img.onload = () => {
            this.SetImage();
            this.SetCanvas();
            this.SetTitle("Press to start puzzle");
            new Piece(this);
        }
    }
    SetImage() {
        this.pieceW = Math.floor(this.img.width / this.level);
        this.pieceH = Math.floor(this.img.height / this.level);
        this.puzzleW = this.pieceW * this.level;
        this.puzzleH = this.pieceH * this.level;
    }
    SetCanvas() {
        this.canvasElm.width = this.puzzleW;
        this.canvasElm.height = this.puzzleH;
        this.canvasElm.style.border = "1px solid black";
        this.context.drawImage(this.img, 0, 0, this.puzzleW, this.puzzleH, 0, 0, this.puzzleW, this.puzzleH);
    }
    SetTitle(msg) {
        this.context.fillStyle = "#000000";
        this.context.globalAlpha = .5;
        this.context.fillRect(0, 0, this.puzzleW, this.puzzleH);
        this.context.fillStyle = "#FFFFFF";
        this.context.globalAlpha = 1;
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.font = "20px Arial";
        this.context.fillText(msg, this.puzzleW / 2, this.puzzleH / 2);
    }

}
class Piece {
    constructor(o) {
        this.panel = o;
        this.pieces = [];
        this.mouse = { x: 0, y: 0 };
        this.curPiece = null;
        this.curDropPiece = null;
        let piece;
        let xPos = 0;
        let yPos = 0;
        for (let i = 0; i < this.panel.level * this.panel.level; i++) {
            piece = {};
            piece.sx = xPos;
            piece.sy = yPos;
            this.pieces.push(piece);
            xPos += this.panel.pieceW;
            if (xPos >= this.panel.puzzleW) {
                xPos = 0;
                yPos += this.panel.pieceH;
            }
        }
        document.onmousedown = (e) => this.ShufflePuzzle();
    }
    ShuffleArray(o) {
        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
    ShufflePuzzle() {
        this.pieces = this.ShuffleArray(this.pieces);
        this.panel.context.clearRect(0, 0, this.panel.puzzleW, this.panel.puzzleH);
        let piece;
        let xPos = 0;
        let yPos = 0;
        for (let i = 0; i < this.pieces.length; i++) {
            piece = this.pieces[i];
            piece.xPos = xPos;
            piece.yPos = yPos;
            this.panel.context.drawImage(this.panel.img, piece.sx, piece.sy, this.panel.pieceW, this.panel.pieceH, xPos, yPos, this.panel.pieceW, this.panel.pieceH);
            this.panel.context.strokeRect(xPos, yPos, this.panel.pieceW, this.panel.pieceH);
            xPos += this.panel.pieceW;
            if (xPos >= this.panel.puzzleW) {
                xPos = 0;
                yPos += this.panel.pieceH;
            }
        }
        document.onmousedown = (e) => this.OnClick(e);
    }
    CheckPiece() {
        let piece;
        for (let i = 0; i < this.pieces.length; i++) {
            piece = this.pieces[i];
            if (!(this.mouse.x < piece.xPos || this.mouse.x > (piece.xPos + this.panel.pieceW) || this.mouse.y < piece.yPos || this.mouse.y > (piece.yPos + this.panel.pieceH)))
                return piece;
        }
        return null;
    }
    OnClick(e) {
        if (e.layerX || e.layerX == 0) {
            this.mouse.x = e.layerX;
            this.mouse.y = e.layerY;
        }
        else if (e.offsetX || e.offsetX == 0) {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
        }
        this.curPiece = this.CheckPiece();
        if (this.curPiece != null) {
            this.panel.context.clearRect(this.curPiece.xPos, this.curPiece.yPos, this.panel.pieceW, this.panel.pieceH);
            this.panel.context.save();
            this.panel.context.globalAlpha = .9;
            this.panel.context.drawImage(this.panel.img, this.curPiece.sx, this.curPiece.sy, this.panel.pieceW, this.panel.pieceH, this.mouse.x - (this.panel.pieceW / 2), this.mouse.y - (this.panel.pieceH / 2), this.panel.pieceW, this.panel.pieceH);
            this.panel.context.restore();
            document.onmousemove = (e) => this.Dragged(e);
            document.onmouseup = (e) => this.Dropped(e);
        }
    }
    Dragged(e) {
        this.curDropPiece = null;
        if (e.layerX || e.layerX == 0) {
            this.mouse.x = e.layerX;
            this.mouse.y = e.layerY;
        }
        else if (e.offsetX || e.offsetX == 0) {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
        }
        this.panel.context.clearRect(0, 0, this.panel.puzzleW, this.panel.puzzleH);
        let piece;
        for (let i = 0; i < this.pieces.length; i++) {
            piece = this.pieces[i];
            if (piece == this.curPiece) {
                continue;
            }
            this.panel.context.drawImage(this.panel.img, piece.sx, piece.sy, this.panel.pieceW, this.panel.pieceH, piece.xPos, piece.yPos, this.panel.pieceW, this.panel.pieceH);
            this.panel.context.strokeRect(piece.xPos, piece.yPos, this.panel.pieceW, this.panel.pieceH);
            if (this.curDropPiece == null) {
                if (!(this.mouse.x < piece.xPos || this.mouse.x > (piece.xPos + this.panel.pieceW) || this.mouse.y < piece.yPos || this.mouse.y > (piece.yPos + this.panel.pieceH))) {
                    this.curDropPiece = piece;
                    this.panel.context.save();
                    this.panel.context.globalAlpha = .4;
                    this.panel.context.fillStyle = '#009900';
                    this.panel.context.fillRect(this.curDropPiece.xPos, this.curDropPiece.yPos, this.panel.pieceW, this.panel.pieceH);
                    this.panel.context.restore();
                }
            }
        }
        this.panel.context.save();
        this.panel.context.globalAlpha = .6;
        this.panel.context.drawImage(this.panel.img, this.curPiece.sx, this.curPiece.sy, this.panel.pieceW, this.panel.pieceH, this.mouse.x - (this.panel.pieceW / 2), this.mouse.y - (this.panel.pieceH / 2), this.panel.pieceW, this.panel.pieceH);
        this.panel.context.restore();
        this.panel.context.strokeRect(this.mouse.x - (this.panel.pieceW / 2), this.mouse.y - (this.panel.pieceH / 2), this.panel.pieceW, this.panel.pieceH);
    }
    Dropped(e) {
        document.onmousemove = null;
        document.onmouseup = null;
        if (this.curDropPiece != null) {
            let tmp = { xPos: this.curPiece.xPos, yPos: this.curPiece.yPos };
            this.curPiece.xPos = this.curDropPiece.xPos;
            this.curPiece.yPos = this.curDropPiece.yPos;
            this.curDropPiece.xPos = tmp.xPos;
            this.curDropPiece.yPos = tmp.yPos;
        }
        this.ResetCheckWin();
    }
    ResetCheckWin() {
        this.panel.context.clearRect(0, 0, this.panel.puzzleW, this.panel.puzzleH);
        let gameWin = true;
        let piece;
        for (let i = 0; i < this.pieces.length; i++) {
            piece = this.pieces[i];
            this.panel.context.drawImage(this.panel.img, piece.sx, piece.sy, this.panel.pieceW, this.panel.pieceH, piece.xPos, piece.yPos, this.panel.pieceW, this.panel.pieceH);
            this.panel.context.strokeRect(piece.xPos, piece.yPos, this.panel.pieceW, this.panel.pieceH);
            if (piece.xPos != piece.sx || piece.yPos != piece.sy) {
                gameWin = false;
            }
        }
        if (gameWin) {
            setTimeout(this.GameOver(), 500);
        }
    }
    GameOver() {
        this.panel.context.clearRect(0, 0, this.panel.puzzleW, this.panel.puzzleH);
        this.panel.context.drawImage(this.panel.img, 0, 0, this.panel.puzzleW, this.panel.puzzleH, 0, 0, this.panel.puzzleW, this.panel.puzzleH);
        this.panel.SetTitle("You win!");

        document.onmousedown = null;
        document.onmousemove = null;
        document.onmouseup = null;
    }
}
class Puzzle {
    constructor() {
        $("h1", 0, "innerText=Puzzle");
        let div = $("div", 0, "id=divLvl");
        $("label", 0, "htmlFor=level;innerText=Level:", div);
        $("input", 0, "type=submit;className=button;value=Easy", div).onclick = () => new Panel(2);
        $("input", 0, "type=submit;className=button;value=Medium", div).onclick = () => new Panel(4);
        $("input", 0, "type=submit;className=button;value=Hard", div).onclick = () => new Panel(8);
    }
}
onload = () => new Puzzle();
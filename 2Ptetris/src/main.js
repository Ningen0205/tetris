'use strict';

//実際の実行用クラス
class Tetris {
  playerId;
  draw;
  field;
  block;
  context;//テトリス本体のキャンバスのコンテキスト
  next;//ネクストを描画する部分のキャンバスのコンテキスト
  hold; //ホールドブロックを描画するキャンバスのコンテキスト
  canHold = true;//ホールドできるときはtrue
  //ネクストのブロックID14個を保存するリスト
  timerId;
  score = 0;
  scoreId;
  holdBlockId = null;
  nextblockList = new Array();
  constructor(ctx, nextContext, holdContext, scoreId, playerId) {
    this.playerId = playerId;
    this.context = ctx;
    this.next = nextContext;
    this.hold = holdContext;
    // console.log(scoreId);
    this.scoreId = scoreId;
    this.draw = new Draw(ctx, nextContext, holdContext);
    this.field = new Field();
    this.draw.init(this.field.data);
    //最初の7順を追加
    this.setBlockList();
    //次の7順を生成
    this.setBlockList();
    console.log(this.nextblockList);
    this.block = new Block(this.nextblockList.shift());
    this.putBlock(this.block);
    // this.draw.field(this.field.data);
    this.draw.next(this.nextblockList[0]);

    // console.log(this.field.data);
  }

  start = () => {
    window.addEventListener('keydown', this.putButton, true);
    this.timerFunc();
  } 



  // checkBlock = () => {
  //   this.lineCheck();
  //   if(this.field.data[0][Math.ceil(Field.getWidth()/2)]){
  //     alert('GameOver...');
  //   }
  //   this.block = new Block(this.nextblockList.shift());
  //   this.putBlock(this.block);
  //   this.draw.field(this.field.data);
  //   this.setBlockList();
  // }

  timerFunc = () => {
    const oldy = this.block.y;
    this.putBlock(0);
    this.block.y++;
    //衝突したら
    if (this.hitCheck()) {
      this.block.y = oldy;
      this.putBlock(this.block);
      this.score += this.lineCheck();
      this.scoreId.textContent = `${this.score}pt`;
      if (this.field.data[0][Math.ceil(Field.getWidth() / 2)]) {
        // alert('GameOver...');
      }
      this.block = new Block(this.nextblockList.shift());
      this.putBlock(this.block);
      this.draw.field(this.field.data);
      this.canHold = true;
      this.setBlockList();
    } else {
      this.putBlock(this.block);
      this.draw.field(this.field.data);
    }
    this.draw.next(this.nextblockList[0]);
    this.timerId = setTimeout(() => {
      this.timerFunc(this.ctx);
    }, 1000);
  }

  getBlockList = () => {
    let blockList = new Array();//次の7順が入るリスト
    do {
      const blockId = Math.ceil(Math.random() * 7); //仮に生成したID
      blockList.push(blockId);
      blockList = Array.from(new Set(blockList));

    } while (blockList.length < 7)

    return blockList;
  }

  //リストの数が7以下（1巡以下ならブロックを追加する）
  setBlockList = () => {
    if (this.nextblockList.length <= 7) {
      this.nextblockList.push(...this.getBlockList());
      this.nextblockList.flat();
    }
  }

  putBlock = (block) => {
    for (let i = 0; i < Block.getBlockType(this.block.id).length; i++) {
      const cx = this.block.x + this.block.fallPoint.x[i];
      const cy = this.block.y + this.block.fallPoint.y[i];
      if ((cx >= 0) && (cx <= Field.getWidth() - 1) && (cy >= 0) && (cy <= Field.getHeight() - 1)) {
        this.field.data[cy][cx] = block;
      } else {
        // console.log('false');
      }
    }
  }

  putButton = (event) => {
    const keyCode = event.keyCode;
    // console.log(keyCode);
    const oldx = this.block.x;
    const oldy = this.block.y;
    let r = 0;
    this.putBlock(0);
    // console.log(keyCode);
    switch (keyCode) {
      case 16://Shift
        if (this.canHold && this.playerId == 0) {
          this.canHold = false;
          if (this.holdBlockId == null) {
            this.putBlock(0);
            this.holdBlockId = this.block.id;
            this.block = new Block(this.nextblockList.shift());
            this.setBlockList();
          } else {
            this.putBlock(0);
            const tmp = this.holdBlockId;
            this.holdBlockId = this.block.id;
            this.block = new Block(tmp);
          }
        }
        this.draw.hold(this.holdBlockId);
        break;
      case 32://spaces
        break;
      case 37://←
        if (this.playerId == 0) {
          event.preventDefault();
          this.block.x--;
        }
        break;
      case 38://↑
        if (this.playerId == 0) {
          event.preventDefault();
          this.hardDrop();
        }
        break;
      case 39://→		
        if (this.playerId == 0) {
          event.preventDefault();
          this.block.x++;
        }
        break;
      case 40://↓
        if (this.playerId == 0) {
          event.preventDefault();
          this.block.y++;
        }
        break;
      case 88://Zキー
        if (this.playerId == 0) {
          event.preventDefault();
          r = 1
        }
        break;
      case 90://Xキー
        if (this.playerId == 0) {
          event.preventDefault();
          r = -1;
        }
        break;

      //ここから2P
      case 13://→回転
        if (this.playerId == 1) {
          event.preventDefault();
          r = -1;
        }
        break;
      case 96://←回転
        if (this.playerId == 1) {
          event.preventDefault();
          r = 1
        }
        break;
      case 97://←
        if (this.playerId == 1) {
          event.preventDefault();
          this.block.x--;
        }
        break;
      case 98://↓
        if (this.playerId == 1) {
          event.preventDefault();
          this.block.y++;
        }
        break;
      case 99://→
        if (this.playerId == 1) {
          event.preventDefault();
          this.block.x++;
        }
        break;
      case 101://↑
        if (this.playerId == 1) {
          event.preventDefault();
          this.hardDrop();
        }
        break;
      case 110://ホールド
        if (this.canHold && this.playerId == 1) {
          this.canHold = false;
          if (this.holdBlockId == null) {
            this.putBlock(0);
            this.holdBlockId = this.block.id;
            this.block = new Block(this.nextblockList.shift());
            this.setBlockList();
          } else {
            this.putBlock(0);
            const tmp = this.holdBlockId;
            this.holdBlockId = this.block.id;
            this.block = new Block(tmp);
          }
        }
        this.draw.hold(this.holdBlockId);
        break;
    }
    if (this.hitCheck()) {
      this.block.x = oldx;
      this.block.y = oldy;
    } else {
      // console.log('false');
    }
    if (r) {
      this.block.turn(r);
      if (this.hitCheck()) {
        this.block.turn(-r);
      }
    }
    this.putBlock(this.block);
    this.draw.field(this.field.data);
  }

  hardDrop = () => {
    while (!this.hitCheck()) {
      this.block.y++
    }
    this.block.y--;
    clearTimeout(this.timerId);
    setTimeout(this.timerFunc, 10);
    // this.timerFunc();
  }



  testFunc = () => {
    let shadowY = this.block.y;
    while (!this.hitCheck()) {
      shadowY++;
    }
    shadowY--;
  }

  lineCheck = () => {
    let delLine = 0;
    let line;
    // console.log(Field.getHeight()-1 >= 0);
    for (let i = Field.getHeight() - 1; i >= 0; i--) {
      // console.log(i);
      line = 0;
      for (let j = 0; j < Field.getWidth(); j++) {
        if (this.field.data[i][j]) line++;
      }
      //行がすべて埋まっているとき
      if (line == Field.getWidth()) {
        delLine++;
        console.log(delLine);
        for (let k = i; k > 0; k--) {
          this.field.data[k] = [...this.field.data[k - 1]];
        }
        for (let l = 0; l < Field.getWidth(); l++) {
          this.field.data[0][l] = 0;
        }
        i = Field.getHeight();
      } else {
        //  continue;
      }
    }
    switch (delLine) {
      case 0:
        return 0;
      case 1:
        return 50;
      case 2:
        return 150;
      case 3:
        return 300;
      case 4:
        return 500;
    }
  }


  hitCheck = () => {
    for (let i = 0; i < Block.getBlockType(this.block.id).length; i++) {
      const cx = this.block.x + this.block.fallPoint.x[i];
      const cy = this.block.y + this.block.fallPoint.y[i];
      // console.log(cy);
      if ((cx >= 0) && (cx <= Field.getWidth() - 1) && (cy >= 0) && (cy <= Field.getHeight() - 1)) {
        if (this.field.data[cy][cx]) {
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  }
}

class Block {
  x;//現在落下中のブロックのX座標情報
  y;//現在落下中のブロックのY座標情報
  id;//操作中のブロックのID(1~7)

  fallPoint = {
    x: new Array(),
    y: new Array(),
  }

  constructor(blockId) {
    this.x = Math.ceil(Field.getWidth() / 2),
      this.y = 1;
    this.id = blockId;
    //相対位置を入れておく
    for (let i = 0; i < Block.getBlockType(this.id).length; i++) {
      this.fallPoint.x.push(Block.getBlockType(this.id)[i][0]);
      this.fallPoint.y.push(Block.getBlockType(this.id)[i][1]);
    }
  }

  turn = (r) => {
    for (let i = 0; i < Block.getBlockType(this.id).length; i++) {
      [this.fallPoint.x[i], this.fallPoint.y[i]] = [-this.fallPoint.y[i] * r, this.fallPoint.x[i] * r];
    }
  };



  // static getBlockType = [				//ブロックのパターン
  // 	[[],[],[],[]],//ID:0（何もない場合）
  // 	[[0, -1], [0, 0], [0, 1], [0, 2],],	/*Iミノ*/
  // 	[[0, -1], [0, 0], [1, 0], [-1, 0],],	/*Tミノ*/
  // 	[[0, -1], [0, 0], [1, 0], [1, -1],],	/*Oミノ*/
  // 	[[0, -1], [0, 0], [-1, 0], [1, -1],],	/*Sミノ*/
  // 	[[0, -1], [0, 0], [1, 0], [-1, -1],],	/*Zミノ*/
  // 	[[0, -1], [0, 0], [0, 1], [-1, 1],],	/*Jミノ*/
  // 	[[0, -1], [0, 0], [0, 1], [1, 1],],	/*Lミノ*/
  // ];

  //ブロックの位置インデックスを返す
  static getBlockType = (blockId) => {
    switch (blockId) {
      case 0: /*何もない場合*/
        return [[], [], [], []];
      case 1:	/*Iミノ*/
        return [[0, -1], [0, 0], [0, 1], [0, 2],];/*Iミノ*/
      case 2: /*Tミノ*/
        return [[0, -1], [0, 0], [1, 0], [-1, 0],];	/*Tミノ*/
      case 3: /*Oミノ*/
        return [[0, -1], [0, 0], [1, 0], [1, -1],];	/*Oミノ*/
      case 4: /*Sミノ*/
        return [[0, -1], [0, 0], [-1, 0], [1, -1],];	/*Sミノ*/
      case 5: /*Zミノ*/
        return [[0, -1], [0, 0], [1, 0], [-1, -1],]; /*Zミノ*/
      case 6: /*Jミノ*/
        return [[0, -1], [0, 0], [0, 1], [-1, 1],];	/*Jミノ*/
      case 7: /*Lミノ*/
        return [[0, -1], [0, 0], [0, 1], [1, 1],];　/*Lミノ*/
    }
  }




  //1blockの大きさを返す
  static getBlockSize = () => {
    return 32;
  }

  static getBlockColor = (blockId) => {
    switch (blockId) {
      case 0: /*何もなし*/
        return 'rgb(150,150,150)';
      case 1:	/*Iミノ*/
        return 'rgb(0,220,255)';
      case 2: /*Tミノ*/
        return 'rgb(150,0,255)';
      case 3: /*Oミノ*/
        return 'rgb(255,255,0)';
      case 4: /*Sミノ*/
        return 'rgb(0,255,0)';
      case 5: /*Zミノ*/
        return 'rgb(255,0,0)';
      case 6: /*Jミノ*/
        return 'rgb(0,0,255)';
      case 7: /*Lミノ*/
        return 'rgb(255,150,0)';
    }
  }
}

class Field {
  //フィールド内の情報を格納するリスト
  data;

  //初期設定（フィールドデータを生成）
  constructor() {
    this.data = new Array(Field.getHeight());
    for (let i = 0; i < Field.getHeight(); i++) {
      this.data[i] = new Array(Field.getWidth());
    }

    this.data.forEach(element => {
      element.fill(0);
    });
  }

  //フィールドの横幅
  static getWidth = () => {
    return 10;
  }

  static getHeight = () => {
    return 20;
  }
}

class Draw {
  context;
  nextContext;
  holdContext;
  constructor(ctx, nextContext, holdContext) {
    this.context = ctx;
    this.nextContext = nextContext;
    this.holdContext = holdContext;
  }

  init(data) {
    this.field(data);
    this.nextContext.fillStyle = 'rgb(220,220,220)';
    this.nextContext.fillRect(0, 0, 100, 100);
    this.holdContext.fillStyle = 'rgb(220,220,220)';
    this.holdContext.fillRect(0, 0, 100, 100);
  }
  //フィールドの中身を描画
  field = (data) => {
    for (let i = 0; i < Field.getHeight(); i++) {
      for (let j = 0; j < Field.getWidth(); j++) {
        const blockId = (data[i][j] == 0) ? 0 : data[i][j].id;
        this.context.fillStyle = Block.getBlockColor(blockId);
        this.context.fillRect(j * Block.getBlockSize(), i * Block.getBlockSize(), Block.getBlockSize() - 1, Block.getBlockSize() - 1);
      }
    }
  }

  next = (blockId) => {
    //最初にネクスト領域を空白にする
    this.nextContext.fillStyle = 'rgb(240,240,2040)';
    this.nextContext.fillRect(0, 0, 100, 100);
    for (let i = 0; i < Block.getBlockType(blockId).length; i++) {
      const cx = Block.getBlockType(blockId)[i][0];
      const cy = Block.getBlockType(blockId)[i][1];
      this.nextContext.fillStyle = Block.getBlockColor(blockId);
      if (blockId == 1) this.nextContext.fillRect((cx + 1) * 25, (cy + 1) * 25, 24, 24);
      else this.nextContext.fillRect((cx + 1) * 25, (cy + 2) * 25, 24, 24);
    }
  }

  hold = (blockId) => {
    //最初にネクスト領域を空白にする
    this.holdContext.fillStyle = 'rgb(220,220,220)';
    this.holdContext.fillRect(0, 0, 100, 100);
    for (let i = 0; i < Block.getBlockType(blockId).length; i++) {
      const cx = Block.getBlockType(blockId)[i][0];
      const cy = Block.getBlockType(blockId)[i][1];
      this.holdContext.fillStyle = Block.getBlockColor(blockId);
      if (blockId == 1) this.holdContext.fillRect((cx + 1) * 25, (cy + 1) * 25, 24, 24);
      else this.holdContext.fillRect((cx + 1) * 25, (cy + 2) * 25, 24, 24);
    }
  }

}



// window.addEventListener('keydown',(event)=> {
//   console.log(event.keyCode);
// },true)



// class buttleTetris{
//   main;
//   next;
//   hold;
//   score;
//   constructor(main,next,hold,score){
//     this.main = main;
//     this.next = next;
//     this.hold = hold;
//     this.score = score;
//   }
// }




let tetris;
let tetris2p;
let init;

let start;
window.onload = () => {
  init = () => {
    const canvas = document.querySelectorAll('.container .main');
    const mainContext = new Array();
    canvas.forEach(element => {
      mainContext.push(element.getContext('2d'));
    });

    console.log(canvas.length);

    const next = document.querySelectorAll('.container .next');
    const nextContext = new Array();
    next.forEach(element => {
      nextContext.push(element.getContext('2d'));
    });


    const hold = document.querySelectorAll('.container .hold');
    const holdContext = new Array();
    hold.forEach(element => {
      holdContext.push(element.getContext('2d'));
    });

    const score = document.querySelectorAll('.container .score');
    const scoreList = new Array();
    score.forEach(element => {
      scoreList.push(element);
    });

    // console.log(document.querySelectorAll('.container').length);
    // for (let i = 0; i < document.querySelectorAll('.container').length; i++) {
    //   new Tetris(mainContext[i], nextContext[i], holdContext[i], scoreList[i], i);
    // }

    tetris =  new Tetris(mainContext[0], nextContext[0], holdContext[0], scoreList[0], 0);
    tetris2p =  new Tetris(mainContext[1], nextContext[1], holdContext[1], scoreList[1], 1);
  }

  init();
}

start = () => {
  window.addEventListener('keydown', this.putButton, true);
  tetris.start();
  tetris2p.start();
}

// console.log(mainContext,nextContext,holdContext,scoreList);

// tetris2p = new tetris();

// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
// const nextCanvas = document.getElementById('next');
// const nextContext = nextCanvas.getContext('2d');
// const holdCanvas = document.getElementById('hold');
// const holdContext = holdCanvas.getContext('2d');
// const score = document.getElementById('score');
// tetris = new Tetris(ctx,nextContext,holdContext,score);
// tetris2p = new Tetris(ctx,nextContext,holdContext,score);



// window.addEventListener('keydown', () => {
//   console.log(event.keyCode);
// }, true)


//実際の実行用クラス
class Tetris {
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
  constructor(ctx, nextContext, holdContext, scoreId) {
    this.context = ctx;
    this.next = nextContext;
    this.hold = holdContext;
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
      this.scoreId.innerText = `${this.score}pt`;
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

  putLeft = () => {
    this.block.x--;
  }

  putRight = () => {
    this.block.x++;
  }

  putSoftDrop = () => {
    this.block.y++;
  }

  putHold = () => {
    if (this.canHold) {
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
  }

  putButtons = (code) => {
    // const keyCode = event.keyCode;
    // console.log(keyCode);
    const oldx = this.block.x;
    const oldy = this.block.y;
    let r = 0;
    this.putBlock(0);
    // console.log(keyCode);
    switch (code) {
      case 0:
      case 2://右回転
        r = 1;
        break;
      case 1://左回転
      case 3:
        r = -1;
        break;
      case 4:
      case 5:
        this.putHold();
        break;
      case 6:
      case 7:
        this.hardDrop();
        break;
      case 9:
        window.location.reload();
        break;
      case 'LEFT':
        this.putLeft();
        break;
      case 'RIGHT':
        this.putRight();
        break;
      case 'SOFTDROP':
        this.putSoftDrop();
        break;
      case 'HARDDROP':
        this.hardDrop();
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
        this.putHold();
        // if(this.canHold){
        //   this.canHold = false;
        //   if(this.holdBlockId == null){
        //     this.putBlock(0);
        //     this.holdBlockId = this.block.id;
        //     this.block = new Block(this.nextblockList.shift());
        //     this.setBlockList();
        //   }else{
        //     this.putBlock(0);
        //     const tmp = this.holdBlockId;
        //     this.holdBlockId = this.block.id;
        //     this.block = new Block(tmp);
        //   }
        // }
        // this.draw.hold(this.holdBlockId);
        break;
      case 32://spaces
        break;
      case 37://←
        event.preventDefault();
        this.putLeft(event);
        // event.preventDefault();
        // this.block.x--;
        break;
      case 38://↑
        event.preventDefault();
        this.hardDrop();
        break;
      case 39://→		
        event.preventDefault();
        this.block.x++;
        break;
      case 40://↓
        event.preventDefault();
        this.block.y++;
        break;
      case 88://Zキー
        event.preventDefault();
        r = 1
        break;
      case 90://Xキー
        event.preventDefault();
        r = -1;
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
        return 'rgb(220,220,220)';
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
    this.nextContext.fillStyle = 'rgb(220,220,220)';
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




let tetris;


window.onload = () => {
  var haveEvents = 'GamepadEvent' in window;
  var controllers = {};
  // var rAF = window.requestAnimationFrame;
  var hold = [];
  const keys = [
    "□", "×", "〇", "△", "L1", "R1", "L2", "R2", "SHARE", "OPTIONS", "L3", "R3", "PS"
  ]

  const axis = ["LEFT-ANALOG-X", "LEFT-ANALOG-Y", "RIGHT-ANALOG-X", , "", "", "RIGHT-ANALOG-Y"];
  let x = 0;
  let y = 0;
  function connectHandler(e) {
    addGamepad(e.gamepad);
  }
  function addGamepad(gamepad) {
    // gamepadのArrayを作成
    controllers[gamepad.index] = gamepad;
    // rAF(updateStatus);
    // setInterval(updateStatus,200);
    updateStatus();
  }

  function disconnectHandler(e) {
    removeGamepad(e.gamepad);
  }

  function removeGamepad(gamepad) {
    var d = document.getElementById("controller" + gamepad.index);
    document.body.removeChild(d);
    delete controllers[gamepad.index];
  }

  function updateStatus() {
    scanGamepads();
    for (j in controllers) {
      var controller = controllers[j];

      //ボタン情報の状態取得
      for (var i = 0; i < controller.buttons.length; i++) {
        var val = controller.buttons[i];
        var pressed = val == 1.0;
        if (typeof (val) == "object") {
          pressed = val.pressed;
          val = val.value;
        }
        var pct = Math.round(val * 100) + "%";
        // console.log(pct);
        if (pressed && !hold[i]) {
          // switch (i) {
          //   case 0:
          //   case 2:
          //     break;
          //   case 4:
          //   case 5:
          //     tetris.putHold();
          //     break;
          // }
          tetris.putButtons(i);
          console.log(keys[i], i);
          hold[i] = true;
          // console.log(hold);
        } else if (!pressed) {
          hold[i] = false;
        }
      }
      for (var i = 0; i < controller.axes.length; i++) {
        var a = controller.axes[i];
        let text = "";
        switch (i) {
          case 0:
            text = `LEFT-ANALOG-X ${a}`;
            if (a == 1) {
              console.log(`LEFT-ANALOG-X RIGHT`);
              tetris.putButtons('RIGHT');
            } else if (a == -1) {
              console.log(`LEFT-ANALOG-X LEFT`);
              tetris.putButtons('LEFT');
            }
            break;
          case 1:
            text = `LEFT-ANALOG-Y ${a}`;
            if (a == 1) {
              console.log(`LEFT-ANALOG-Y DOWN`);
              tetris.putButtons('SOFTDROP')
            } else if (a == -1) {
              console.log(`LEFT-ANALOG-Y UP`);
              // tetris.putButtons('HARDDROP');
            }
            break;
          case 2:
            text = `RIGHT-ANALOG-X ${a}`;
            if (a == 1) {
              console.log(`RIGHT-ANALOG-X RIGHT`);
            } else if (a == -1) {
              console.log(`RIGHT-ANALOG-X LEFT`);
            }
            break;
          case 5:
            text = `RIGHT-ANALOG-Y ${a}`;
            if (a == 1) {
              console.log(`RIGHT-ANALOG-Y DOWN`);
            } else if (a == -1) {
              console.log(`RIGHT-ANALOG-Y UP`);
            }
            break;
          case 9:
            text = `ANALOG ${a}`;
            break;
          default:
            break;
        }
        // console.log(x,y);
        // if(text) console.log(text);
        // console.log(a);
      }

    }
    // rAF(updateStatus);
    setTimeout(updateStatus, 50);
  }

  function scanGamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (var i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        if (!(gamepads[i].index in controllers)) {
          addGamepad(gamepads[i]);
          console.log("a");
        } else {
          controllers[gamepads[i].index] = gamepads[i];
          //console.log("b");
        }
      }
    }
  }

  if (haveEvents) {
    window.addEventListener("gamepadconnected", connectHandler);
    window.addEventListener("gamepaddisconnected", disconnectHandler);
  } else {
    setInterval(scanGamepads, 500);
  }

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const nextCanvas = document.getElementById('next');
  const nextContext = nextCanvas.getContext('2d');
  const holdCanvas = document.getElementById('hold');
  const holdContext = holdCanvas.getContext('2d');
  const score = document.getElementById('score');
  console.log(tetris);
  tetris = new Tetris(ctx, nextContext, holdContext, score);

}

// window.addEventListener('keydown',(event)=> {
//   console.log(event.keyCode);
// },true)



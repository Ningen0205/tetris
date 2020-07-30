'use strict';

const Tetris = class {
	#canvas;
	#ctx;
	// 3順（21手）までのブロックを格納
	#nextBlock;
	#nextBlockList = new Array(3);

	#fields = {
		width: 12 + 1,
		height: 20 + 1,
	};

	position = {
		x: Math.floor(this.#fields.width / 2),
		y: 3,
		incrementY(){
			this.y += 1;
		}
	};

	#blockSize = 25;
	data;
	#block = new Block();

	constructor() {
		this.#canvas = document.getElementById('canvas');
		this.#ctx = canvas.getContext('2d');
	}

	//フィールドのリストを作成して壁と床も1を代入
	init = () => {
		console.log(this.position);
		
		this.data = new Array(this.#fields.height);
		for (let i = 0; i < this.#fields.height; i++) {
			this.data[i] = new Array(this.#fields.width);
		}

		//壁と床の要素を壁（1）に設定する
		for (let i = 0; i < this.#fields.height; i++) {
			for (let j = 0; j < this.#fields.width; j++) {
				this.data[i][j] = (j == 0 || j == this.#fields.width - 1 || i == this.#fields.height - 1) ? 1 : 0;
			}
		}
		
		//次の3順（21手）までのブロックを追加する
		for (let i = 0; i < this.#nextBlockList.length; i++) {
			this.#nextBlockList[i] = this.#block.getNextBlockList();
		}
		this.#nextBlockList = this.#nextBlockList.flat(1);
	}


	setNextBlock(){
		this.#block.data.setBlockId(this.#nextBlockList.pop());
		// console.log(this.#block.types[this.#block.data.blockid]);
		for(let i=0;i<4;i++){
			this.#block.data.y[i] = this.#block.types[this.#block.data.blockid][i][1];
			this.#block.data.x[i] = this.#block.types[this.#block.data.blockid][i][0];
			this.data[this.position.y + this.#block.data.y[i]][this.position.x + this.#block.data.x[i]] = this.#block.data.getBlockId();
		}
		console.log(this.#block.data);
	}

	putBlock = (blockId) => {
		for(let i=0;i<4;i++){
			this.#block.data.y[i] = this.#block.types[this.#block.data.blockid][i][1];
			this.#block.data.x[i] = this.#block.types[this.#block.data.blockid][i][0];
			this.data[this.position.y + this.#block.data.y[i]][this.position.x + this.#block.data.x[i]] = blockId;
		}
	} 

	//自由落下処理
	freefall(){
		// this.putBlock(0);
		console.log(this.position);
		// this.position.incrementY();
		this.putBlock(this.#block.blockId);
		this.drow();
		// setTimeout(this.freefall,1000);
		// setTimeout(function(obj){obj.freefall()},1000,this);

	}


	
	drow = () => {
		console.log(this.data);
		for (let i = 0; i < this.#fields.height; i++) {
			for (let j = 0; j < this.#fields.width; j++) {
				this.#ctx.fillStyle = Block.getBlockColor(this.data[i][j]);
				this.#ctx.fillRect(j * this.#blockSize, i * this.#blockSize, this.#blockSize - 1, this.#blockSize - 1);
			}
		}
	}

	start(){
		// this.position.y--;
		this.drow();
		setTimeout(start,1000);
	}
}

const Block = class {
	
	data = {
		blockid:7,
		x: new Array(),
		y: new Array(),

		// getX(index){
		// 	return this.x(index);
		// },

		// getY(index){
		// 	return this.y(index);
		// },

		setBlockId(blockId){
			this.blockid =blockId;
		},

		getBlockId(){
			return this.blockid;
		}
	};

	types = [				//ブロックのパターン
		[[], [], [], [],],//何もなし（だみー）
		[[], [], [], [],],//壁(ダミーデータ)
		[[0, -1], [0, 0], [0, 1], [0, 2],],	/*Iミノ*/
		[[0, -1], [0, 0], [1, 0], [-1, 0],],	/*Tミノ*/
		[[0, -1], [0, 0], [1, 0], [1, -1],],	/*Oミノ*/
		[[0, -1], [0, 0], [-1, 0], [1, -1],],	/*Sミノ*/
		[[0, -1], [0, 0], [1, 0], [-1, -1],],	/*Zミノ*/
		[[0, -1], [0, 0], [0, 1], [-1, 1],],	/*Jミノ*/
		[[0, -1], [0, 0], [0, 1], [1, 1],],	/*Lミノ*/
	];

	//次の7順のブロックIDを格納する
	constructor() {

	}

	getNextBlockList() {
		let result = new Array(0);
		do {
			result.push(this.getNextBlock());
			const resultToSet = new Set(result);
			result = Array.from(resultToSet);
			if (result.length >= 7) {
				break;
			}
		} while (true)
		// console.log(result);
		return result;
	}

	getNextBlock() {
		return Math.floor(Math.random() * 7) + 2;//0：何もなし　1：壁のためそれ以降を抽選対象にする
	}

	setNextBlock(blockId){
		this.data.blockid = blockId;
	}

	static getBlockColor(blockId) {
		switch (blockId) {
			case 0: /*何もなし*/
				return 'rgb(200,200,200)';
			case 1: /*壁*/
				return 'rgb(0,0,0)';
			case 2:	/*Iミノ*/
				return 'rgb(0,220,255)';
			case 3: /*Tミノ*/
				return 'rgb(150,0,255)';
			case 4: /*Oミノ*/
				return 'rgb(255,255,0)';
			case 5: /*Sミノ*/
				return 'rgb(0,255,0)';
			case 6: /*Zミノ*/
				return 'rgb(255,0,0)';
			case 7: /*Jミノ*/
				return 'rgb(0,0,255)';
			case 8: /*Lミノ*/
				return 'rgb(255,150,0)';
		}
	}
}



window.onload = () => {
	const tetris = new Tetris();
	tetris.init();
	tetris.setNextBlock();
	tetris.drow();
	tetris.freefall();
	// console.log(tetris.data);
}
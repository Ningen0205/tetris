//実際の実行用クラス
class Tetris {
	draw;
	field;
	//ネクストのブロックID14個を保存するリスト
	blockList = new Array();
	constructor(ctx){
		this.draw = new Draw(ctx);
		this.field = new Field();
		console.log(this.field);
		this.draw.field(this.field.data);
	}

	setBlockList = () => {
		const blockList = new Array();//次の7順が入るリスト
		do{
			const blockId = Math.random()*7+1; //仮に生成した

		}while(true)
	}
}

class Block {
	x;//現在落下中のブロックのX座標情報
	y;//現在落下中のブロックのY座標情報
	id;//操作中のブロックのID(1~7)

	constructor(blockId){
		this.x= Math.ceil(Field.getWidth() / 2),
		this.y = 1;
		this.id = blockId;
	}


	
	static getBlockType = [				//ブロックのパターン
		[[],[],[],[]],//ID:0（何もない場合）
		[[0, -1], [0, 0], [0, 1], [0, 2],],	/*Iミノ*/
		[[0, -1], [0, 0], [1, 0], [-1, 0],],	/*Tミノ*/
		[[0, -1], [0, 0], [1, 0], [1, -1],],	/*Oミノ*/
		[[0, -1], [0, 0], [-1, 0], [1, -1],],	/*Sミノ*/
		[[0, -1], [0, 0], [1, 0], [-1, -1],],	/*Zミノ*/
		[[0, -1], [0, 0], [0, 1], [-1, 1],],	/*Jミノ*/
		[[0, -1], [0, 0], [0, 1], [1, 1],],	/*Lミノ*/
	];

	//ブロックの位置インデックスを返す
	static getBlockType = (blockId) => {
		switch (blockId) {
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
		return 12;
	}

	static getHeight = () => {
		return 20;
	}
}

class Draw {
	context;
	constructor(ctx) {
		this.context = ctx;
	}

	//フィールドの中身を描画
	field = (data) => {
		for (let i = 0; i < Field.getHeight(); i++) {
			for (let j = 0; j < Field.getWidth(); j++) {
				const blockId = data[i][j];
				this.context.fillStyle = Block.getBlockColor(blockId);
				this.context.fillRect(j * Block.getBlockSize(), i * Block.getBlockSize(), Block.getBlockSize() - 1, Block.getBlockSize() - 1);
			}
		}
		console.log(this.context);
	}
}


window.onload = () => {
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');
	new Tetris(ctx);

}




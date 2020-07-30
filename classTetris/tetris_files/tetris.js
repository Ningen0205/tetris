var Tetris = {
	//プロパティ定義
	data      : null,					//ゲーム画面のブロックの状態を保持
	screen    : null,					//camvasのElementObjectのインスタンス
	context   : null,					//2D-canvasのインスタンス
	fields    : {x:15,y:20},			//ゲーム画面の幅(ブロック数)
	fallPoint : {						//落下中のブロックの中心座標
					x:0,
					y:0
				 },
	fallBlock : null,					//落下中のブロック
	nextBlock : null,					//次に落下するブロック
	speed	  : 1000,					//自動落下スピード
	score	  : 0,						//獲得スコア
	scoreText   : null,			//divのid_scoreインスタンス
	sound : null,				//Audioのインスタンス

	//関数定義
	//※ここでは関数を一覧で見せたいので処理は書かない
	init        :function(canvasId,scoreId,soundId){},	//初期化処理
	start       : function(){},			//ゲームを開始する為の処理
	gameOver	: function(){},			//ゲームオーバーになった時用のコールバックとして準備
	clearblock	: function(){},			//dataの中身を壁だけの状態にする
	drow        : function(){},			//dataの状態を画面に出力する
	hitcheck	: function(){},			//ブロックの衝突チェック
	keydownFunc : function(event){},	//キーが入力された時の処理
	lineCheck	: function(){},			//そろったラインが無いかをチェック
	putBlock    : function(){},			//ブロックをdataに反映させる
	timerFunc	: function(){},			//自動落下
}



/**
 * ゲームの初期化
 * ゲーム準備に失敗した場合にはfalseを返します。
 *
 * @return boolean
 */
Tetris.init = function(canvasId,scoreId,soundId){

	//ゲーム画面になるcanvasタグを取得する
	this.screen = document.getElementById(canvasId);
	if(!this.screen){
		alert("第1引数にはcanvasタグのid属性を渡してください");
		return false;
	}
	
	//2D-Contextのハンドルを取得する
	this.context = this.screen.getContext('2d');
	this.scoreText = document.getElementById(scoreId);
	
	
	//dataを初期化
	this.data = new Array(this.fields.y);
	for(i=0; i<this.fields.y ;i++){
		this.data[i] = new Array(this.fields.x);
	}
	
	//落下させるブロックは真ん中から落としたいので、幅/2をセットする
	this.fallPoint.x = Math.ceil(this.fields.x /2);
	
	//ゲーム画面を初期化
	this.clearblock();

	this.sound = document.getElementById(soundId);
	this.sound.play();
	
	
	//画面を表示
	this.drow();
}




/**
 * ゲームの初期化
 * ゲーム準備に失敗した場合にはfalseを返します。
 *
 * @return boolean
 */
Tetris.start = function(){

	this.fallBlock = new Block();
	
	//キー入力開始
	window.addEventListener('keydown',this.keydownFunc,true);
	
	//自動落下を開始
	setTimeout(this.timerFunc,this.speed);
}



/**
 * dataの中身を壁だけの状態にする
 */
Tetris.clearblock = function(){
	var i,j;
	
	for(i=0; i<this.fields.y ;i++){
		for(j=0; j<this.fields.x ;j++){
			if(j==0||(j==this.fields.x-1)||(i==this.fields.y-1)){
				this.data[i][j] = 1;	//床と壁
			}else{
				this.data[i][j] = 0;
			}
		}
	}

	this.scoreText.innerText = `score:${this.score}`;
}



/**
 * dataの状態を画面に出力する
 */
Tetris.drow = function(){
	var i,j;
	
	for(i=0; i<this.fields.y; i++){
		for(j=0; j<this.fields.x; j++){
			if(this.data[i][j] ==0){
				this.context.fillStyle = "rgb(200,255,255)";	//何もない
			}else if(this.data[i][j] == 1){
				this.context.fillStyle = "rgb(0,128,0)";		//壁又は床
			}else if(this.data[i][j] == 2){
				this.context.fillStyle = "rgb(128,0,0)";		//落下中
			}else if(this.data[i][j] == 3){
				this.context.fillStyle = "rgb(0,128,255)";	//落下後
			}
			this.context.fillRect(j*16,i*16,15,15);
		}
	}
	this.scoreText.innerText = `score:${this.score}`;
};



/**
 * ブロックの衝突チェック
 * @return boolean
 */
Tetris.hitcheck = function(){
	var i,cx,cy,hit=0;
	
	for(i=0; i<this.fallBlock.data.x.length; i++){
		cx=this.fallPoint.x + this.fallBlock.data.x[i];
		cy=this.fallPoint.y + this.fallBlock.data.y[i];
		if((cx>=0) && (cx<=this.fields.x-1) && (cy>0)&&(cy<=this.fields.y-1)){
			if(this.data[cy][cx]) hit++;
		}
	}
	return(hit);	//戻り値が１以上なら衝突
}



/**
 * キーが入力された時の処理
 * @params event Event
 */
Tetris.keydownFunc = function(event){
	var code = event.keyCode;
	var oldx=Tetris.fallPoint.x,oldy=Tetris.fallPoint.y,r=0;
	
	Tetris.putBlock(0);
	switch(code){
	case 37:	//←キー
		event.preventDefault();
		Tetris.fallPoint.x--;
		break;
	case 39:	//→キー
		event.preventDefault();
		Tetris.fallPoint.x++;
		break;
	case 40:	//↓キー
		event.preventDefault();
		Tetris.fallPoint.y++;
		break;
	case 88:	//xキー
		event.preventDefault();
		r=1;
		break;
	case 90:	//zキー
		event.preventDefault();
		r=-1;
		break;
	}
	if(Tetris.hitcheck()){
		Tetris.fallPoint.x=oldx;
		Tetris.fallPoint.y=oldy;
	}
	if(r){
		Tetris.fallBlock.turn(r);
		if(Tetris.hitcheck()){
			Tetris.fallBlock.turn(-r);
		}
	}
	Tetris.putBlock(2);
	Tetris.drow();
};



/**
 * ブロックをdataに反映させる
 * @return int 	削除した行数
 */
Tetris.lineCheck = function(){
	var i,cx,cy,line;
	
	delLine = 0;		//削除した行の数
	
	cy=this.fields.y-2; //チェックする最初の行(y)
	//※-2の根拠：配列のIndex番号は実際の数-1で、一番下が壁でその次の行から処理するための-2になる
	
	lineblock = this.fields.x-2;

	while(cy>=1){
		line=0;
		for(cx=1 ;cx<=lineblock ;cx++){
			if(this.data[cy][cx]) line++;
		}
		if(line==lineblock){
		//1行そろった場合の処理
			delLine++;
			for(i=cy; i>=1; i--){
				for(cx=1; cx<=lineblock;cx++){
					this.data[i][cx]=this.data[i-1][cx];
				}
			}
			this.speed -= 50;
			if(this.speed<100) this.speed=100;
		}else{
			cy--;
		}
	}
	return delLine;
};



/**
 * ブロックをdataに置く
 * @params int a	ブロックの状態(0:なし,1:壁＆床,2:落下中,3落下後)
 */
Tetris.putBlock = function(a){
	var i,cx,cy;

	for(i=0; i<this.fallBlock.data.x.length; i++){
		cx=this.fallPoint.x+this.fallBlock.data.x[i];
		cy=this.fallPoint.y+this.fallBlock.data.y[i];
		if((cx>=0) && (cx<=this.fields.x-1) && (cy>=0)&&(cy<=this.fields.y-1)){
			this.data[cy][cx] = a;
		}
	}
};

Tetris.gameOver = function(){
	alert("game over");
}



/**
 * 自動落下処理
 */
Tetris.timerFunc = function(){

	Tetris.putBlock(0);
	Tetris.fallPoint.y++;		//ブロックを落下
	if(Tetris.hitcheck()){	//落下時の衝突判定
	//衝突した場合
		Tetris.fallPoint.y--;
		Tetris.putBlock(3);
		Tetris.score += Tetris.lineCheck();	//ラインのチェックと消去
		Tetris.fallBlock = new Block();	//新しいブロックを生成
		Tetris.fallPoint.x = Math.ceil(Tetris.fields.x/2);
		Tetris.fallPoint.y = 0;
		if(Tetris.hitcheck()){
			Tetris.drow();
			Tetris.gameOver();	//ゲームオーバー
			return;
		}
	}else{
	//衝突してない場合
		Tetris.putBlock(2);
	}
	Tetris.drow();
	setTimeout(Tetris.timerFunc,Tetris.speed);
}



var Block = function(){
	//落下中のブロックの形を保持
	this.data = {x: new Array(),
				 y: new Array()};
	//落下するブロックの種類
	this.types = [				//ブロックのパターン
				[[0,-1], [0,0], [ 0,1], [ 0, 2],],	/*A*/
				[[0,-1], [0,0], [ 1,0], [-1, 0],],	/*B*/
				[[0,-1], [0,0], [ 1,0], [ 1,-1],],	/*C*/
				[[0,-1], [0,0], [-1,0], [ 1,-1],],	/*D*/
				[[0,-1], [0,0], [ 1,0], [-1,-1],],	/*E*/
				[[0,-1], [0,0], [ 0,1], [-1, 1],],	/*F*/
				[[0,-1], [0,0], [ 0,1], [ 1, 1],],	/*G*/
			];
	//ブロックを回転させる処理
	this.turn = function(r){
		var tx,i;
		
		for(i=0; i<4; i++){
			tx = this.data.x[i] * r;
			this.data.x[i] = -this.data.y[i] * r;
			this.data.y[i] = tx;
		}
	};
			
	//ブロックタイプを決定
	num = Math.floor(Math.random() * 7);
	
	for(i=0; i<this.types[num].length; i++){
		this.data.x[i] = this.types[num][i][0];
		this.data.y[i] = this.types[num][i][1];
	}

	t = Math.floor(Math.random() * 4);
	for(i=0; i<t; i++){
		this.turn(1);		//ランダムに回転させる
	}

}

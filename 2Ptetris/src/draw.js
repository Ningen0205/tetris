class Draw {
  context;
  nextContext;
  holdContext;
  constructor(ctx,nextContext,holdContext) {
    this.context = ctx;
    this.nextContext = nextContext;
    this.holdContext = holdContext;
  }

  init(data){
    this.field(data);
    this.nextContext.fillStyle = 'rgb(220,220,220)';
    this.nextContext.fillRect(0,0,100,100);
    this.holdContext.fillStyle = 'rgb(220,220,220)';
    this.holdContext.fillRect(0,0,100,100);
  }
  //フィールドの中身を描画
  field = (data) => {
    for (let i = 0; i < Field.getHeight(); i++) {
      for (let j = 0; j < Field.getWidth(); j++) {
        const blockId = (data[i][j] == 0)? 0:data[i][j].id;
        this.context.fillStyle = Block.getBlockColor(blockId);
        this.context.fillRect(j * Block.getBlockSize(), i * Block.getBlockSize(), Block.getBlockSize() - 1, Block.getBlockSize() - 1);
      }
    }
  }

  next = (blockId) => {
    //最初にネクスト領域を空白にする
    this.nextContext.fillStyle = 'rgb(220,220,220)';
    this.nextContext.fillRect(0,0,100,100);
    for(let i=0;i<Block.getBlockType(blockId).length;i++){
      const cx = Block.getBlockType(blockId)[i][0];
      const cy = Block.getBlockType(blockId)[i][1];
      this.nextContext.fillStyle = Block.getBlockColor(blockId);
      if(blockId == 1) this.nextContext.fillRect((cx+1)* 25, (cy+1) * 25, 24, 24);
      else this.nextContext.fillRect((cx+1)* 25, (cy+2) * 25, 24, 24);
    }
  }

  hold = (blockId) => {
    //最初にネクスト領域を空白にする
    this.holdContext.fillStyle = 'rgb(220,220,220)';
    this.holdContext.fillRect(0,0,100,100);
    for(let i=0;i<Block.getBlockType(blockId).length;i++){
      const cx = Block.getBlockType(blockId)[i][0];
      const cy = Block.getBlockType(blockId)[i][1];
      this.holdContext.fillStyle = Block.getBlockColor(blockId);
      if(blockId == 1) this.holdContext.fillRect((cx+1)* 25, (cy+1) * 25, 24, 24);
      else this.holdContext.fillRect((cx+1)* 25, (cy+2) * 25, 24, 24);
    }
  }

}
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
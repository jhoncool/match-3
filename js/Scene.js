;(function(){
  "use strict";

  class Scene {
    constructor() {
      this.$scene = document.getElementById('scene');
      this.item_size = 50;
      this.columns = 9;
      this.rows = 9;

      this.create_scene();
      this.fill_scene();
    }

    fill_scene() {
      let shape;
      let $shape;
      let position;
      const count_cells = this.rows * this.columns;

      for (let i = 0; i < count_cells; i++) {
        position = this.__get_position_by_idx_in_grid(i);
        shape = new $$.ShapeFabric(this.item_size);
        $shape = shape.get_shape();
        $shape.style.top = position.top + 'px';
        $shape.style.left = position.left + 'px';
        this.$scene.appendChild($shape);
      }
    }

    create_scene() {
      this.$scene.style.width = this.columns * this.item_size + 'px';
      this.$scene.style.height = this.rows * this.item_size + 'px';
      this._create_grid();
    }

    _create_grid() {
      let $div;
      let position;
      const count_cells = this.rows * this.columns;

      for (let i = 0; i < count_cells; i++) {
        position = this.__get_position_by_idx_in_grid(i);
        $div = document.createElement('div');
        $div.classList.add('cell', `cell_${i}`);
        $div.style.width = this.item_size + 'px';
        $div.style.height = this.item_size + 'px';
        $div.style.top = position.top + 'px';
        $div.style.left = position.left + 'px';
        this.$scene.appendChild($div);
      }

    }

    __get_position_by_idx_in_grid(idx) {
      let position = {};
      position.top = (this.rows - 1 - Math.floor(idx / this.columns)) * this.item_size;
      position.left = (idx % this.columns) * this.item_size;
      return position;
    }


  }

  $$.Scene = Scene;
})();

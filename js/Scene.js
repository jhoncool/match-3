;(function(){
  "use strict";

  class Scene {
    constructor(opt={}) {
      this.$scene = document.getElementById('scene');
      this.item_size = opt.item_size || 50;
      this.columns = opt.columns || 9;
      this.rows = opt.rows || 9;
      this.shapes = [];
      this.target = null;

      this.create_scene();
      this.fill_scene();
      this.click_handler = this.__click_handler.bind(this);
    }


    on_click(cb) {
      this.click_callback = cb;
      this.$scene.addEventListener("click", this.click_handler);
    }

    off_click() {
      this.$scene.removeEventListener("click", this.click_handler);
    }

    __click_handler(event) {
      let $target = event.target;
      if ( $target.classList.contains("shape") ) {
        this.target = $target;
        this.off_click();
        this.click_callback();
      }
    }

    get_target() {
      return this.target;
    }

    get_shapes() {
      return this.shapes;
    }

    fill_scene() {
      let shape;
      let $shape;
      let position;
      const count_cells = this.rows * this.columns;

      for (let i = 0; i < count_cells; i++) {
        position = this.__get_position_by_idx_in_grid(i);
        shape = new $$.ShapeFabric(this.item_size);
        this.shapes.push(shape);
        while ( !this.__is_available_type_shape() ) {
          shape.change_shape_type();
        }
        $shape = shape.get_$shape();
        $shape.classList.add('shape_hover');
        $shape.style.top = position.top + 'px';
        $shape.style.left = position.left + 'px';
        $shape.setAttribute("data-shape_idx", `${i}`);
        $shape.setAttribute("data-grid_idx", `${i}`);
        this.$scene.appendChild($shape);
      }
    }

    __is_available_type_shape() {
      const idx = this.shapes.length - 1;
      const last_shape = this.shapes[idx];
      const shape_row = Math.floor(idx / this.columns);
      let last_shape_name = last_shape.get_shape_name();
      let prev_left_shapes_names = [];
      let prev_below_shapes_names = [];

      for (let i = 1; i <= 2; i++) {
        let current_idx_left = idx - i;
        let prev_left_row = Math.floor(current_idx_left / this.columns);
        if ( (current_idx_left >= 0) && (prev_left_row === shape_row) ) {
          prev_left_shapes_names.push( this.shapes[current_idx_left].get_shape_name() );
        }
        let current_idx_below = idx - i * (this.columns);
        if ( current_idx_below >= 0 ) {
          prev_below_shapes_names.push( this.shapes[current_idx_below].get_shape_name() );
        }
      }

      return !(
        ( (prev_left_shapes_names.length === 2) &&
          prev_left_shapes_names.every( (name) => name === last_shape_name ) ) ||
        ( (prev_below_shapes_names.length === 2) &&
          prev_below_shapes_names.every( (name) => name === last_shape_name ) )
      );
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

    get_position(idx) {
      return this.__get_position_by_idx_in_grid(idx);
    }


  }

  $$.Scene = Scene;
})();

;(function(){
  "use strict";

  class Scene {
    constructor(opt={}) {
      this.$scene = document.getElementById('scene');
      this.item_size = opt.item_size || 50;
      this.columns = opt.columns || 9;
      this.rows = opt.rows || 9;
      this.shapes = [];
      this.shapes_in_cells = [];
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

    get_match_indexes_in_swap(indexes) {
      let match = [];

      for (let i = 0; i < 2; i++) {
        let some_match = false;
        let shape_idx = indexes[i];
        let swap_shape_idx = indexes[(i+1)%2];
        let exclude_side = this.__get_exclude_side(shape_idx, swap_shape_idx);
        let shape_name = this.shapes[swap_shape_idx].get_shape_name();

        let check_horizontal = this.__get_match_shape_indexes_horizontal(
          this.get_idx_cell_from_idx_shape(shape_idx), shape_name, exclude_side
        );

        if (check_horizontal.length >= 2) {
          match = match.concat(check_horizontal);
          some_match = true;
        }

        let check_vertical = this.__get_match_shape_indexes_vertical(
          this.get_idx_cell_from_idx_shape(shape_idx), shape_name, exclude_side
        );

        if (check_vertical.length >= 2) {
          match = match.concat(check_vertical);
          some_match = true;
        }

        if (some_match) {
          match.push(shape_idx);
        }
      }

      return match;
    }

    __get_exclude_side(shape_idx_1, shape_idx_2) {
      let cell_idx_1 = this.get_idx_cell_from_idx_shape(shape_idx_1);
      let cell_idx_2 = this.get_idx_cell_from_idx_shape(shape_idx_2);
      let exclude_side;
      if ( this.__is_in_one_row(cell_idx_1, cell_idx_2) ) {
        if ( cell_idx_1 < cell_idx_2 ) {
          exclude_side = 'right';
        } else {
          exclude_side = 'left';
        }
      } else {
        if ( cell_idx_1 < cell_idx_2 ) {
          exclude_side = 'above';
        } else {
          exclude_side = 'below';
        }
      }
      return exclude_side;
    }

    __get_match_shape_indexes_horizontal(cell_idx, shape_name, exclude_side) {
      let shape_indexes_horizontal = [];
      if ( exclude_side !== 'left') {
        shape_indexes_horizontal = shape_indexes_horizontal.concat(
          this.__check_left(cell_idx, shape_name)
        );
      }
      if ( exclude_side !== 'right') {
        shape_indexes_horizontal = shape_indexes_horizontal.concat(
          this.__check_right(cell_idx, shape_name)
        );
      }
      return shape_indexes_horizontal
    }

    __get_match_shape_indexes_vertical(cell_idx, shape_name, exclude_side) {
      let shape_indexes_vertical = [];
      if ( exclude_side !== 'below') {
        shape_indexes_vertical = shape_indexes_vertical.concat(
          this.__check_below(cell_idx, shape_name)
        );
      }
      if ( exclude_side !== 'above') {
        shape_indexes_vertical = shape_indexes_vertical.concat(
          this.__check_above(cell_idx, shape_name)
        );
      }
      return shape_indexes_vertical
    }

    __check_above(cell_idx, shape_name) {
      let check = [];
      let check_cell_idx;
      let check_shape_idx;
      let check_shape_name;
      for (let i = 1; i <= 2; i++) {
        check_cell_idx = cell_idx + i * this.columns;
        check_shape_idx = this.__get_idx_shape_from_idx_cell(check_cell_idx);
        if ( check_shape_idx < this.columns * this.rows ) {
          check_shape_name = this.shapes[check_shape_idx].get_shape_name();
          if ( shape_name === check_shape_name ) {
            check.push(check_shape_idx);
          } else {
            break;
          }
        } else {
          break;
        }
      }
      return check;
    }

    __check_below(cell_idx, shape_name) {
      let check = [];
      let check_cell_idx;
      let check_shape_idx;
      let check_shape_name;
      for (let i = 1; i <= 2; i++) {
        check_cell_idx = cell_idx - i * this.columns;
        check_shape_idx = this.__get_idx_shape_from_idx_cell(check_cell_idx);
        if ( check_shape_idx >= 0 ) {
          check_shape_name = this.shapes[check_shape_idx].get_shape_name();
          if ( shape_name === check_shape_name ) {
            check.push(check_shape_idx);
          } else {
            break;
          }
        } else {
          break;
        }
      }
      return check;
    }

    __check_left(cell_idx, shape_name) {
      let check = [];
      let check_cell_idx;
      let check_shape_idx;
      let check_shape_name;
      for (let i = 1; i <= 2; i++) {
        check_cell_idx = cell_idx - i;
        check_shape_idx = this.__get_idx_shape_from_idx_cell(check_cell_idx);
        if ( check_shape_idx >= 0 ) {
          check_shape_name = this.shapes[check_shape_idx].get_shape_name();
          if ( this.__is_in_one_row(cell_idx, check_cell_idx) && shape_name === check_shape_name ) {
            check.push(check_shape_idx);
          } else {
            break;
          }
        }
      }
      return check;
    }

    __check_right(cell_idx, shape_name) {
      let check = [];
      let check_cell_idx;
      let check_shape_idx;
      let check_shape_name;
      for (let i = 1; i <= 2; i++) {
        check_cell_idx = cell_idx + i;
        check_shape_idx = this.__get_idx_shape_from_idx_cell(check_cell_idx);
        if ( check_shape_idx < this.columns * this.rows ) {
          check_shape_name = this.shapes[check_shape_idx].get_shape_name();
          if ( this.__is_in_one_row(cell_idx, check_cell_idx) && shape_name === check_shape_name ) {
            check.push(check_shape_idx);
          } else {
            break;
          }
        }
      }
      return check;
    }

    get_idx_cell_from_idx_shape(idx_shape) {
      return this.shapes_in_cells.indexOf(idx_shape);
    }

    __get_idx_shape_from_idx_cell(idx_cell) {
      return this.shapes_in_cells[idx_cell];
    }

    __is_in_one_row(idx_1, idx_2) {
      return Math.floor(idx_1/this.columns) === Math.floor(idx_2/this.columns)
    }

    get_target() {
      return this.target;
    }

    get_shapes() {
      return this.shapes;
    }

    get_shapes_in_cells() {
      return this.shapes_in_cells;
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
        this.shapes_in_cells.push(i);
        $shape = shape.get_$shape();
        $shape.classList.add('shape_hover');
        $shape.style.top = position.top + 'px';
        $shape.style.left = position.left + 'px';
        // $shape.setAttribute("data-shape_idx", `${i}`);
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
        let current_idx_below = idx - (i * this.columns);
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
      this.__create_grid();
    }

    __create_grid() {
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

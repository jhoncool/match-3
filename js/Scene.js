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
      this.score = null;

      this.__create_scene();
      this.__fill_scene();
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

    change_swap_indexes(swap_shapes_indexes) {
      let shape_idx_1 = swap_shapes_indexes[0];
      let shape_idx_2 = swap_shapes_indexes[1];
      let cell_idx_1 = this.get_cell_idx_from_shape_idx(shape_idx_1);
      let cell_idx_2 = this.get_cell_idx_from_shape_idx(shape_idx_2);
      this.shapes_in_cells[cell_idx_1] = shape_idx_2;
      this.shapes_in_cells[cell_idx_2] = shape_idx_1;
    }

    change_cells_indexes_from_data(data) {
      for (let column_idx = 0; column_idx < this.columns; column_idx++) {
        let column_name = `column_${column_idx}`;
        if ( data.hasOwnProperty(column_name) ) {
          let shapes_indexes = this.__get_shapes_indexes_from_column_idx(column_idx);
          let cells_match_indexes = data[column_name].cells_match_indexes;
          let cells_above_indexes = data[column_name].cells_above_indexes;
          cells_above_indexes.forEach( (cell_above_idx) => {
            let count_below_match = cells_match_indexes.filter( (idx) => idx < cell_above_idx ).length;
            let cell_idx_update = cell_above_idx - count_below_match * this.columns;
            this.shapes_in_cells[cell_idx_update] = shapes_indexes[this.__get_row_idx_from_cell_idx(cell_above_idx)];
          });
          cells_match_indexes.forEach( (cell_match_idx, i) => {
            let cell_idx_update = column_idx + (this.rows - cells_match_indexes.length + i) * this.columns;
            this.shapes_in_cells[cell_idx_update] = shapes_indexes[this.__get_row_idx_from_cell_idx(cell_match_idx)];
          });
        }
      }
    }

    __get_shapes_indexes_from_column_idx(column_idx) {
      let shapes_indexes = [];
      for (let row_idx = 0; row_idx < this.rows; row_idx++) {
        shapes_indexes.push( this.get_shape_idx_from_cell_idx(column_idx + row_idx * this.columns) );
      }
      return shapes_indexes;
    }

    prepare_data_for_animation_right(match_shapes_indexes) {
      let data = {};
      let cells_indexes = [];
      match_shapes_indexes.forEach( (shape_idx) => {
        cells_indexes.push(this.get_cell_idx_from_shape_idx(shape_idx));
      });
      cells_indexes.forEach( (cell_idx) => {
        let column_idx = this.__get_column_idx_from_cell_idx(cell_idx);
        let column_name = `column_${column_idx}`;
        if ( !data.hasOwnProperty(column_name) ) {
          data[column_name] = {};
          data[column_name].cells_match_indexes = []
        }
        data[column_name].cells_match_indexes.push(cell_idx);

      });

      for (let column_idx = 0; column_idx < this.columns; column_idx++) {
        let column_name = `column_${column_idx}`;
        if ( data.hasOwnProperty(column_name) ) {
          data[column_name].cells_above_indexes = [];
          let cells_above_indexes = data[column_name].cells_above_indexes;
          let cells_match_indexes = data[column_name].cells_match_indexes;
          cells_match_indexes.sort((a, b) => a - b);
          let first_cell_match_idx = cells_match_indexes[0];
          let max_cells_above = this.rows - this.__get_row_idx_from_cell_idx(first_cell_match_idx) - 1;
          for (let i = 0; i < max_cells_above; i++) {
            let cell_above_idx = first_cell_match_idx + (i + 1) * this.columns;
            if ( cells_match_indexes.indexOf(cell_above_idx) === -1) {
              cells_above_indexes.push(cell_above_idx);
            }
          }
        }
      }
      return data;
    }

    __get_row_idx_from_cell_idx(cell_idx) {
      return Math.floor(cell_idx / this.columns);
    }

    __get_column_idx_from_cell_idx(cell_idx) {
      return cell_idx % this.columns;
    }

    get_all_match_shapes_indexes() {
      let match = [];
      const count_cells = this.rows * this.columns;

      for (let cell_idx = 0; cell_idx < count_cells; cell_idx++) {
        let some_match = false;
        let shape_name = this.get_shape_by_cell_idx(cell_idx).get_shape_name();

        let check_right = this.__check_right(cell_idx, shape_name, this.columns - 1);
        if (check_right.length >= 2) {
          match = match.concat(check_right);
          some_match = true;
        }

        let check_above = this.__check_above(cell_idx, shape_name, this.rows - 1);
        if (check_above.length >= 2) {
          match = match.concat(check_above);
          some_match = true;
        }

        if (some_match) {
          match.push(this.get_shape_idx_from_cell_idx(cell_idx));
        }
      }

      return [...new Set(match)];
    }

    get_match_indexes_in_swap(indexes) {
      let match = [];
      let max_shapes = 2;

      for (let i = 0; i < 2; i++) {
        let some_match = false;
        let shape_idx = indexes[i];
        let swap_shape_idx = indexes[(i+1)%2];
        let exclude_side = this.__get_exclude_side(shape_idx, swap_shape_idx);
        let shape_name = this.shapes[swap_shape_idx].get_shape_name();

        let check_horizontal = this.__get_match_shape_indexes_horizontal(
          this.get_cell_idx_from_shape_idx(shape_idx), shape_name, exclude_side, max_shapes
        );

        if (check_horizontal.length >= 2) {
          match = match.concat(check_horizontal);
          some_match = true;
        }

        let check_vertical = this.__get_match_shape_indexes_vertical(
          this.get_cell_idx_from_shape_idx(shape_idx), shape_name, exclude_side, max_shapes
        );

        if (check_vertical.length >= 2) {
          match = match.concat(check_vertical);
          some_match = true;
        }

        if (some_match) {
          match.push(swap_shape_idx);
        }
      }

      return match;
    }

    __get_exclude_side(shape_idx_1, shape_idx_2) {
      let cell_idx_1 = this.get_cell_idx_from_shape_idx(shape_idx_1);
      let cell_idx_2 = this.get_cell_idx_from_shape_idx(shape_idx_2);
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

    __get_match_shape_indexes_horizontal(cell_idx, shape_name, exclude_side, max_shapes) {
      let shape_indexes_horizontal = [];
      if ( exclude_side !== 'left') {
        shape_indexes_horizontal = shape_indexes_horizontal.concat(
          this.__check_left(cell_idx, shape_name, max_shapes)
        );
      }
      if ( exclude_side !== 'right') {
        shape_indexes_horizontal = shape_indexes_horizontal.concat(
          this.__check_right(cell_idx, shape_name, max_shapes)
        );
      }
      return shape_indexes_horizontal
    }

    __get_match_shape_indexes_vertical(cell_idx, shape_name, exclude_side, max_shapes) {
      let shape_indexes_vertical = [];
      if ( exclude_side !== 'below') {
        shape_indexes_vertical = shape_indexes_vertical.concat(
          this.__check_below(cell_idx, shape_name, max_shapes)
        );
      }
      if ( exclude_side !== 'above') {
        shape_indexes_vertical = shape_indexes_vertical.concat(
          this.__check_above(cell_idx, shape_name, max_shapes)
        );
      }
      return shape_indexes_vertical
    }

    __check_above(cell_idx, shape_name, max_shapes=2) {
      let check = [];
      let check_cell_idx;
      let check_shape_idx;
      let check_shape_name;
      for (let i = 1; i <= max_shapes; i++) {
        check_cell_idx = cell_idx + i * this.columns;
        if ( check_cell_idx < this.columns * this.rows ) {
          check_shape_idx = this.get_shape_idx_from_cell_idx(check_cell_idx);
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

    __check_below(cell_idx, shape_name, max_shapes=2) {
      let check = [];
      let check_cell_idx;
      let check_shape_idx;
      let check_shape_name;
      for (let i = 1; i <= max_shapes; i++) {
        check_cell_idx = cell_idx - i * this.columns;
        if ( check_cell_idx >= 0 ) {
          check_shape_idx = this.get_shape_idx_from_cell_idx(check_cell_idx);
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

    __check_left(cell_idx, shape_name, max_shapes=2) {
      let check = [];
      let check_cell_idx;
      let check_shape_idx;
      let check_shape_name;
      for (let i = 1; i <= max_shapes; i++) {
        check_cell_idx = cell_idx - i;
        if ( check_cell_idx >= 0 ) {
          check_shape_idx = this.get_shape_idx_from_cell_idx(check_cell_idx);
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

    __check_right(cell_idx, shape_name, max_shapes=2) {
      let check = [];
      let check_cell_idx;
      let check_shape_idx;
      let check_shape_name;
      for (let i = 1; i <= max_shapes; i++) {
        check_cell_idx = cell_idx + i;
        if ( check_cell_idx < this.columns * this.rows ) {
          check_shape_idx = this.get_shape_idx_from_cell_idx(check_cell_idx);
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

    get_cell_idx_from_shape_idx(idx_shape) {
      return this.shapes_in_cells.indexOf(idx_shape);
    }

    get_shape_idx_from_cell_idx(idx_cell) {
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

    get_shape_by_cell_idx(cell_idx) {
      return this.shapes[this.get_shape_idx_from_cell_idx(cell_idx)];
    }

    __fill_scene() {
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
        let shape_idx = +$shape.getAttribute('data-shape_idx');
        this.shapes_in_cells.push(shape_idx);
        $shape.classList.add('shape_hover');
        $shape.style.top = position.top + 'px';
        $shape.style.left = position.left + 'px';
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

    __create_scene() {
      let scene_height = this.rows * this.item_size;
      this.$scene.style.width = this.columns * this.item_size + 'px';
      this.$scene.style.height = scene_height + 'px';
      this.score = new $$.Score();
      let $score_wrapper = this.score.get_$wrapper();
      this.$scene.appendChild($score_wrapper);
      $score_wrapper.style.top = scene_height + 10 + 'px';
      $score_wrapper.style.left = 0 + 'px';
      this.__create_grid();
    }

    get_score_obj() {
      return this.score;
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

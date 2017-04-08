;(function(){
  "use strict";

  class Steps {
    constructor() {
      this.run();
    }

    run() {
      this.init();
    }

    init() {
      this.selected_shapes_indexes = [];
      this.match_indexes_shapes = null;
      this.data = null;
      this.data_columns_indexes = null;
      this.item_size = 50;
      this.columns = 9;
      this.rows = 9;
      this.fall_indent = this.item_size;
      this.render();
    }

    render() {
      this.scene = new $$.Scene({
        item_size: this.item_size,
        columns: this.columns,
        rows: this.rows
      });
      this.handle_click();
    }

    handle_click() {
      for (let shape of this.scene.get_shapes()) {
        shape.get_$shape().classList.add('shape_hover');
      }
      this.scene.on_click( this.check_can_swap.bind(this) );
    }

    check_can_swap() {
      let $target = this.scene.get_target();
      const shape_idx = +$target.getAttribute('data-shape_idx');
      if ( $target.classList.contains('shape_selected') ) {
        this.selected_shapes_indexes = this.selected_shapes_indexes.filter( (i) => i !== shape_idx );
        $target.classList.remove('shape_selected');
      } else {
        this.selected_shapes_indexes.push(shape_idx);
        if ( this.selected_shapes_indexes.length === 2 ) {
          let prev_shape_idx = this.selected_shapes_indexes[0];
          let $prev_shape = this.scene.get_shapes()[prev_shape_idx].get_$shape();
          const grid_idx = this.scene.get_cell_idx_from_shape_idx(shape_idx);
          const prev_grid_idx = this.scene.get_cell_idx_from_shape_idx(prev_shape_idx);
          let is_beside = $$.is_two_shapes_beside([prev_grid_idx, grid_idx], this.columns);
          $prev_shape.classList.remove('shape_selected');
          if ( !is_beside ) {
            this.selected_shapes_indexes.shift();
            $target.classList.add('shape_selected');
          }
        } else {
          $target.classList.add('shape_selected');
        }
      }

      this.is_can_swap( (this.selected_shapes_indexes.length === 2) ? 'yes' : 'no' );
    }

    is_can_swap(type) {
      switch(type) {
        case "no": {
          this.handle_click();
          break;
        }
        case "yes": {
          this.check_swap_status();
          break;
        }
        default: {
          throw new Error("incorrect type in step 'is_can_swap'");
        }
      }
    }

    check_swap_status() {
      for (let shape of this.scene.get_shapes()) {
        shape.get_$shape().classList.remove('shape_hover');
      }
      this.match_indexes_shapes = this.scene.get_match_indexes_in_swap(this.selected_shapes_indexes);
      this.is_valid_swap( (this.match_indexes_shapes.length === 0) ? 'invalid' : 'valid' );
    }

    is_valid_swap(type) {
      switch(type) {
        case "invalid": {
          this.animate_invalid_swap();
          break;
        }
        case "valid": {
          this.animate_right_match();
          break;
        }
        default: {
          throw new Error("incorrect type in step 'is_valid_swap'");
        }
      }
    }

    animate_invalid_swap() {
      this.__animate_swap('invalid', () => {
        this.selected_shapes_indexes = [];
        this.handle_click();
      });
    }

    animate_right_match() {
      this.__animate_swap('valid', () => {
        this.scene.change_swap_indexes(this.selected_shapes_indexes);
        this.selected_shapes_indexes = [];
        this.data = this.scene.prepare_data_for_animation_right(this.match_indexes_shapes);
        this.data_columns_indexes = [];

        for (let column_idx = 0; column_idx < this.columns; column_idx++) {
          let column_name = `column_${column_idx}`;
          if ( this.data.hasOwnProperty(column_name) ) {
            this.data_columns_indexes.push(column_idx);
          }
        }

        this.__animate_match_shapes(() => {
          this.__animate_falling_shapes_above(() => {
            this.update_score();
          });
        });

      });
    }

    update_score() {
      this.add_new_shapes();
    }

    add_new_shapes() {
      this.data_columns_indexes.forEach( (column_idx) => {
        let column_name = `column_${column_idx}`;
        let column_shapes_names = [];
          this.data[column_name].cells_match_indexes.forEach( (cell_idx) => {
            let shape = this.scene.get_shape_by_cell_idx(cell_idx);
            shape.refresh_shape();
            if (column_shapes_names.slice(-2).every( (name) => name === shape.get_shape_name() ) ) {
              shape.change_shape_type();
            }
            column_shapes_names.push(shape.get_shape_name());
          });
      });

      this.__animate_falling_new_shapes(() => {
        this.scene.change_cells_indexes_from_data(this.data);

        // this.is_more_match('yes');
      });

    }

    is_more_match(type) {
      switch(type) {
        case "yes": {
          this.animate_right_match();
          break;
        }
        case "no": {
          this.check_finish();
          break;
        }
        default: {
          throw new Error("incorrect type in step 'is_more_match'");
        }
      }
    }

    check_finish() {

      this.is_finish('no');
    }

    is_finish(type) {
      switch(type) {
        case "no": {
          this.handle_click();
          break;
        }
        case "yes": {
          this.before_end();
          break;
        }
        default: {
          throw new Error("incorrect type in step 'is_finish'");
        }
      }
    }

    before_end() {
      console.log('THE_END');
    }


    // Additional (Helpers) methods //
    __animate_swap(type, cb) {
      let shape_idx_1 = this.selected_shapes_indexes[0];
      let shape_idx_2 = this.selected_shapes_indexes[1];
      let $shape_1 = this.scene.get_shapes()[shape_idx_1].get_$shape();
      let $shape_2 = this.scene.get_shapes()[shape_idx_2].get_$shape();
      const grid_idx_1 = this.scene.get_cell_idx_from_shape_idx(shape_idx_1);
      const grid_idx_2 = this.scene.get_cell_idx_from_shape_idx(shape_idx_2);
      $shape_1.parentNode.appendChild($shape_1);
      const position_1 = this.scene.get_position(grid_idx_1);
      const position_2 = this.scene.get_position(grid_idx_2);

      let tl = new $$.Timeline({onComplete: () => {
          cb();
        }
      });

      const duration = 0.3;
      tl
        .to( $shape_2, duration, { left: position_1.left, top: position_1.top } )
        .to( $shape_1, duration, { left: position_2.left, top: position_2.top }, 0 );
      if (type === 'invalid') {
        tl
          .to( $shape_2, duration, { left: position_2.left, top: position_2.top } )
          .to( $shape_1, duration, { left: position_1.left, top: position_1.top }, duration );
      }
    }

    __animate_match_shapes(cb) {
      let tl = new $$.Timeline({onComplete: () => {
          cb();
        }
      });

      this.data_columns_indexes.forEach( (column_idx) => {
        let column_name = `column_${column_idx}`;
        this.data[column_name].cells_match_indexes.forEach( (cell_idx, i) => {
          let $shape = this.scene.get_shape_by_cell_idx(cell_idx).get_$shape();
          tl
            .to( $shape, 0.3, { scale: 0 }, 0 )
            .to( $shape, 0, {
              opacity: 0,
              top: -(this.fall_indent + this.item_size * i),
              scale: 1
            })
        });
      });
    }

    __animate_falling_shapes_above(cb) {
      let tl = new $$.Timeline({onComplete: () => {
          cb();
        }
      });

      this.data_columns_indexes.forEach( (column_idx) => {
        let column_name = `column_${column_idx}`;
        let cell_match_index_first = this.data[column_name].cells_match_indexes[0];
        let position = this.scene.get_position(cell_match_index_first);
        this.data[column_name].cells_above_indexes.forEach( (cell_idx, i) => {
          let $shape = this.scene.get_shape_by_cell_idx(cell_idx).get_$shape();
          tl
            .to( $shape, 0.3, { top: `${position.top - this.item_size * i}px` }, 0 )
        });
      });
    }

    __animate_falling_new_shapes(cb) {
      let tl = new $$.Timeline({onComplete: () => {
          cb();
        }
      });

      this.data_columns_indexes.forEach( (column_idx) => {
        let column_name = `column_${column_idx}`;
        let cells_match_indexes = this.data[column_name].cells_match_indexes;
        let start_cell_idx = column_idx + (this.rows - cells_match_indexes.length) * this.columns;
        let position = this.scene.get_position(start_cell_idx);
        cells_match_indexes.forEach( (cell_idx, i) => {
          let $shape = this.scene.get_shape_by_cell_idx(cell_idx).get_$shape();
          tl
            .to( $shape, 0.1, { opacity: 1 }, 0 )
            .to( $shape, 0.3, { top: `${position.top - this.item_size * i}px` }, 0 )
        });
      });
    }

  }

  $$.Steps = Steps;

})();




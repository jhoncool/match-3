/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let $$ = {};

$$.random_in_range = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

$$.random_in_arr = (arr) => arr[$$.random_in_range(0, arr.length - 1)];

$$.sort = (arr) => arr.slice().sort((a, b) => a - b);

$$.is_two_shapes_beside = (arr_idx, columns) => {
  const idx_0 = arr_idx[0];
  const idx_1 = arr_idx[1];
  let check_horizontal = false;
  let check_vertical = false;
  if ( (Math.abs(idx_0 - idx_1) === 1) && (Math.floor(idx_0 / columns) === Math.floor(idx_1 / columns)) )  {
    check_horizontal = true;
  }
  if ( (idx_0 % columns === idx_1 % columns) && Math.abs((Math.floor(idx_0 / columns) - Math.floor(idx_1 / columns))) === 1 ) {
    check_vertical = true;
  }
  return check_horizontal || check_vertical;
};

$$.Tween = TweenLite;
$$.Timeline = TimelineLite;

/* harmony default export */ __webpack_exports__["a"] = ($$);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Scene__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);



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
    this.scene = new __WEBPACK_IMPORTED_MODULE_0__Scene__["a" /* default */]({
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
        let is_beside = __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].is_two_shapes_beside([prev_grid_idx, grid_idx], this.columns);
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

  animate_right_match(with_swap=true) {
    let promise = new Promise((resolve) => {
      if ( with_swap ) {
        this.__animate_swap('valid', () => {
          this.scene.change_swap_indexes(this.selected_shapes_indexes);
          this.selected_shapes_indexes = [];
          resolve();
        });
      } else {
        resolve();
      }
    });

    promise.then(
      () => {
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
      }
    );
  }

  update_score() {
    let score = 0;
    this.data_columns_indexes.forEach( (column_idx) => {
      let column_name = `column_${column_idx}`;
      this.data[column_name].cells_match_indexes.forEach( (cell_idx) => {
        let shape = this.scene.get_shape_by_cell_idx(cell_idx);
        score += shape.get_score();
      });
    });

    this.scene.get_score_obj().update_score(score);
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
      this.match_indexes_shapes = this.scene.get_all_match_shapes_indexes();
      this.is_more_match( (this.match_indexes_shapes.length === 0) ? 'no' : 'yes' );
    });
  }

  is_more_match(type) {
    switch(type) {
      case "yes": {
        this.animate_right_match(false);
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
    this.is_finish( (this.scene.get_score_obj().get_current_score() >= 100000) ? 'yes' : 'no' );
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
    alert('YOU WIN!!!');
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

    let tl = new __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].Timeline({onComplete: () => {
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
    let tl = new __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].Timeline({onComplete: () => {
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
    let tl = new __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].Timeline({onComplete: () => {
        cb();
      }
    });

    this.data_columns_indexes.forEach( (column_idx) => {
      let column_name = `column_${column_idx}`;
      let cells_match_indexes = this.data[column_name].cells_match_indexes;
      this.data[column_name].cells_above_indexes.forEach( (cell_idx, i) => {
        let count_below_match = cells_match_indexes.filter( (idx) => idx < cell_idx ).length;
        let $shape = this.scene.get_shape_by_cell_idx(cell_idx).get_$shape();
        tl
          .to( $shape, 0.3, { top: `+=${count_below_match * this.item_size}px` }, 0 )
      });
    });
  }

  __animate_falling_new_shapes(cb) {
    let tl = new __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].Timeline({onComplete: () => {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Steps;







/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ShapeFabric__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Score__ = __webpack_require__(3);



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
      shape = new __WEBPACK_IMPORTED_MODULE_0__ShapeFabric__["a" /* default */](this.item_size);
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
    this.score = new __WEBPACK_IMPORTED_MODULE_1__Score__["a" /* default */]();
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
    let $canvas = document.createElement('canvas');
    this.$scene.appendChild($canvas);
    let canvas_width = this.columns * this.item_size;
    let canvas_height = this.rows * this.item_size;
    $canvas.style.width = canvas_width + 'px';
    $canvas.style.height = canvas_height + 'px';
    $canvas.setAttribute("width", `${canvas_width}`);
    $canvas.setAttribute("height", `${canvas_height}`);
    $canvas.style.top = 0 + 'px';
    $canvas.style.left = 0 + 'px';
    let ctx = $canvas.getContext("2d");
    for (let i = 1; i <= this.columns; i++) {
      ctx.beginPath();
      ctx.moveTo(i * this.item_size, 0);
      ctx.lineTo(i * this.item_size, canvas_height);
      ctx.stroke();
    }
    for (let i = 1; i <= this.rows; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * this.item_size);
      ctx.lineTo(canvas_width, i * this.item_size);
      ctx.stroke();
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Scene;





/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class Score {
  constructor() {
    this.score = 0;
    this.$score = null;
    this.$wrapper = null;
    this.__create_score();
    this.__update();
  }

  update_score(score) {
    this.score += score;
    this.__update();
  }

  get_current_score() {
    return this.score;
  }

  get_$wrapper() {
    return this.$wrapper;
  }

  __update() {
    this.$score.innerHTML = this.score;
  }

  __create_score() {
    let $wrapper = document.createElement('div');
    $wrapper.classList.add('score-wrapper');
    let $caption = document.createElement('span');
    $caption.classList.add('score-wrapper__caption');
    $caption.innerHTML = 'Score: ';
    $wrapper.appendChild($caption);
    let $score = document.createElement('span');
    $score.classList.add('score-wrapper__count');
    $wrapper.appendChild($score);
    this.$score = $score;
    this.$wrapper = $wrapper;
  }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Score;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);


let current_idx = 0;
const shapes_data = {
  circle: {
    score: 30
  },
  square: {
    score: 10
  },
  triangle: {
    score: 20
  }
};


class ShapeFabric {
  constructor(item_size) {
    this.item_size = item_size;
    this.shapes_variants = Object.keys(shapes_data);
    this.shapes_variants_for_change = this.shapes_variants.slice();
    this.$shape = null;
    this.shape_name = null;
    this.__create_shape();
  }

  __create_shape() {
    let $shape = document.createElement('div');
    this.shape_name = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].random_in_arr(this.shapes_variants);
    $shape.classList.add('shape', this.shape_name);
    $shape.style.width = this.item_size + 'px';
    $shape.style.height = this.item_size + 'px';
    this.$shape = $shape;
    $shape.setAttribute("data-shape_idx", `${current_idx++}`);
  }

  get_score() {
    return shapes_data[this.shape_name].score;
  }

  get_shape_name() {
    return this.shape_name;
  }

  get_$shape() {
    return this.$shape;
  }

  change_shape_type() {
    this.$shape.classList.remove(this.shape_name);
    this.shapes_variants_for_change = this.shapes_variants_for_change.filter( (name) => name !== this.shape_name );
    if ( this.shapes_variants_for_change.length === 0) throw new Error('There are no more variant shapes names');
    this.shape_name = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].random_in_arr(this.shapes_variants_for_change);
    this.$shape.classList.add(this.shape_name);
  }

  refresh_shape() {
    this.$shape.classList.remove(this.shape_name);
    this.shape_name = __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* default */].random_in_arr(this.shapes_variants);
    this.shapes_variants_for_change = this.shapes_variants.slice();
    this.$shape.classList.add(this.shape_name);
  }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = ShapeFabric;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Steps__ = __webpack_require__(1);


new __WEBPACK_IMPORTED_MODULE_0__Steps__["a" /* default */]();



/***/ })
/******/ ]);
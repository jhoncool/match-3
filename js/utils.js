;(function(){
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

  window.$$ = $$;
})();
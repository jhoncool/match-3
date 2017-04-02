;(function(){
  "use strict";

  let $$ = {};

  $$.random_in_range = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

  $$.random_in_arr = (arr) => arr[$$.random_in_range(0, arr.length - 1)];

  window.$$ = $$;
})();
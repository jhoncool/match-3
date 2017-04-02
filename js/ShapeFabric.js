;(function(){
  "use strict";

  class ShapeFabric {
    constructor(item_size) {
      this.item_size = item_size;
      this.shapes_variants = ['circle', 'square', 'triangle'];
      this.$shape = null;
      this.shape_name = null;
      this.__create_shape();
    }

    __create_shape() {
      let $shape = document.createElement('div');
      this.shape_name = $$.random_in_arr(this.shapes_variants);
      $shape.classList.add('shape', this.shape_name);
      $shape.style.width = this.item_size + 'px';
      $shape.style.height = this.item_size + 'px';
      this.$shape = $shape;
    }

    get_shape() {
      return this.$shape;
    }
  }

  $$.ShapeFabric = ShapeFabric;

})();
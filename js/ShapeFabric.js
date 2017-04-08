;(function(){
  "use strict";

  let current_idx = 0;

  class ShapeFabric {
    constructor(item_size) {
      this.item_size = item_size;
      this.shapes_variants = ['circle', 'square', 'triangle'];
      this.shapes_variants_for_change = this.shapes_variants.slice();
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
      $shape.setAttribute("data-shape_idx", `${current_idx++}`);
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
      this.shape_name = $$.random_in_arr(this.shapes_variants_for_change);
      this.$shape.classList.add(this.shape_name);
    }

    refresh_shape() {
      this.$shape.classList.remove(this.shape_name);
      this.shape_name = $$.random_in_arr(this.shapes_variants);
      this.shapes_variants_for_change = this.shapes_variants.slice();
      this.$shape.classList.add(this.shape_name);
    }

  }

  $$.ShapeFabric = ShapeFabric;

})();
;(function(){
  "use strict";

  class Steps {
    constructor() {
      this.run();
    }

    run() {
      console.log('START');
      this.init();
    }

    init() {

      this.render();
    }

    render() {
      this.scene = new $$.Scene();


      this.handle_click();
    }

    handle_click() {

      // this.action_with_shape('select');
    }

    action_with_shape(type) {
      switch(type) {
        case "select": {
          this.toggle_select_shape();
          break;
        }
        case "swap": {
         this.swap_shapes();
          break;
        }
        default: {
          throw new Error("incorrect type in step 'action_with_shape'");
        }
      }
    }

    toggle_select_shape() {

      this.handle_click();
    }

    swap_shapes() {

      this.check_swap_status('invalid');
    }

    check_swap_status(type) {
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
          throw new Error("incorrect type in step 'check_swap_status'");
        }
      }
    }

    animate_invalid_swap() {

      this.handle_click();
    }

    animate_right_match() {

      this.update_score();
    }

    update_score() {

      this.add_new_shapes();
    }

    add_new_shapes() {

      this.is_more_match('yes');
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

  }


  $$.Steps = Steps;

})();




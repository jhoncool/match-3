export default class Score {
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

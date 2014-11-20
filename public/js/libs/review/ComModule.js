sand.define('Review/ComModule', [
  'Seed',
  'DataPackage/Controller->DP',
  'DOM/toDOM',
  'Review/Library',
  'Review/ColComments',
  'Review/Canvas/CanvasTrack'
], function(r) {

var ComModule = r.Seed.extend({

  isMediator: true,
  respondsTo: { dp: function() {return this.dp;} },

  tpl: function() {
    return this.create(r.ColComments, {mainID: this.id}, 'colCom').el;
  },

  /*Data init: {attachEl: DOMelement, canvas: 'on' || 'off', dp: CommonDP}*/
  options: function() {
    return {
      id: this.guid()(),
      attachEl: null,
      canvas: null,
      dp: null
    }
  },

  '+init': function() {
    this.attachEl ? this.attachComments(this.attachEl, this.canvas) : null;
  },

  /*Link comments to attachEl
  **Data attach: (DOMelement)
  */
  attachComments: function(attachEl, doCanvas) {
    if (!attachEl.tagName) {
      console.log('Comments error: attachComments/ attachEl is not a DOM element');
      return ;
    }
    this.attachEl = attachEl;

    this.colCom.setHeight(this.attachEl.clientHeight || this.attachEl.offsetHeight || this.attachEl.scrollHeight || this.attachEl.style.height || 0);
    this.setDisplay('column');

    //MCB
    window.addEventListener('load', function() {setTimeout(this.resizeCol.bind(this), 0)}.bind(this));
    this.attachEl.addEventListener('resize', this.resizeCol.bind(this));

    doCanvas === 'on' ? this.setCanvas(attachEl) : null;
  },

  resizeCol: function() {
    this.colCom.setHeight(this.attachEl.clientHeight || this.attachEl.offsetHeight || this.attachEl.scrollHeight || this.attachEl.style.height || 0);
    this.canvas ? this.canvas.setSize(this.attachEl.clientHeight, this.attachEl.clientWidth) : null;
  },

  setCanvas: function(containEl) {

    this.canvas = this.create(r.CanvasTrack);
    this.canvas.setSize(containEl.clientHeight, containEl.clientWidth);

    /*Echanges entre canvas et colcom*/
    this.canvas.on('validArea', this.suggestComment.bind(this));
    this.canvas.onTarget = this.colCom.canTarget.bind(this.colCom);
    this.canvas.drawAll = this.colCom.drawAreas.bind(this.colCom);
    this.colCom.on('clearCanvas', this.canvas.clearCanvas.bind(this.canvas), this);
    this.colCom.ctx = this.canvas.ctx;

    containEl.appendChild(this.canvas.el);
  },

  suggestComment: function(x, y, data) {
    typeof(x) === "int" ? null : delete x;
    this.colCom.suggestComment.bind(this.colCom)(x, y, data);
  },

  setDisplay: function(format) {
    if (format === 'column') {
      this.colCom.display = this.colCom.displayColumn.bind(this.colCom);
    } else if (format == 'bubble') {
      this.colCom.display = this.colCom.displayBubble.bind(this.colCom);
    }
    this.colCom.display();
  },

/*Not modulable*/
  setID: function(id, container) {
    var prevLeft = this.el.style.left;
    if (this.canvas) this.canvas.clearCanvas();
    this.id = id;
    this.el.remove();
    this.colCom = this.create(r.ColComments, {mainID: this.id});
    this.setDisplay('column');
    this.colCom.display();
    this.el = this.colCom.el;
    this.el.style.left = prevLeft;
    if (prevLeft === '0px') container.appendChild(this.el);
    this.colCom.setHeight(this.attachEl.clientHeight || this.attachEl.offsetHeight || this.attachEl.scrollHeight || this.attachEl.style.height || 0);
    this.colCom.refreshDP();
  },

  guid: function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    }
    return function() {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    };
  }

});
return ComModule;
});

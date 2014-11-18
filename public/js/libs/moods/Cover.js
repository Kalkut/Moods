sand.define('Moods/Cover', [
  'Seed',
  'DOM/toDOM',
  'DataPackage/Controller->DP',
  'Moods/Upload',
  'Moods/View',
  'Moods/Case'
], function(r) {

  var Cover = r.Seed.extend({

    '+init' : function (opt) {
      
      this.layout = opt.layout || [[100,100,200,200],[400,100,200,200],[100,325,200,200],[400,325,200,200]];
      this.el = r.toDOM('.cover');

      for (var i = 0, n = this.layout.length; i < n; i++) {
        var tCase = this.create(r.Case,{ width : this.layout[i][2], height : this.layout[i][3]});
        tCase.el.style.left = this.layout[i][0] +'px'
        tCase.el.style.top = this.layout[i][1] + 'px'
        this.el.appendChild(tCase.el);
     }
    }

  });
  return Cover;
});

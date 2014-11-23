sand.define('Moods/Cover', [
  'Seed',
  'DOM/toDOM',
  'DataPackage/Controller->DP',
  'Moods/Case',
  'DOM/handle'
], function(r) {

  var Cover = r.Seed.extend({

    '+init' : function (opt) {
      
      this.layout = opt.layout || [[50,100,200,200],[350,100,200,200],[50,325,200,200],[350,325,200,200]];
      this.el = r.toDOM('.cover');

      for (var i = 0, n = this.layout.length; i < n; i++) {
        var tCase = this.create(r.Case,{ width : this.layout[i][2], height : this.layout[i][3]});
        tCase.el.style.left = this.layout[i][0] +'px'
        tCase.el.style.top = this.layout[i][1] + 'px'
        this.el.appendChild(tCase.el);
        tCase.el.setAttribute("cover",true);
        tCase.el.addEventListener("mousedown", function (tCase,e) {
          if(e.shiftKey) {
            tCase.freeze();
            var clone = tCase.el.cloneNode(true);
            clone.style.pointerEvents = "none";

            var sOl = e.clientX - $(tCase.el).offset().left;
            var sOt = e.clientY - $(tCase.el).offset().top;

            clone.style.left = e.clientX - sOl  + "px";
            clone.style.top = e.clientY - sOt + "px";
            
            $(".moods")[0].appendChild(clone);
            
            
            
            var move = function (e) {
              clone.style.left = e.clientX - sOl  + "px";
              clone.style.top = e.clientY - sOt + "px";
            }.bind(this)
            
            var up = function (e) {
              if(e.target.className == 'case' && e.target.refresh) {
                e.target.refresh(tCase.img.src);
                console.log(["boule",tCase.img.src])
                tCase.changeImage("")
              }
              else if (e.target.parentNode.className == 'case' && e.target.parentNode.refresh) {
                e.target.parentNode.refresh(tCase.img.src);
                console.log(["bill",tCase.img.src])
                tCase.changeImage("")
              }
            clone.parentNode.removeChild(clone);
            document.body.removeEventListener('mousemove', move)
            document.body.removeEventListener('mouseup',up );
              tCase.unfreeze();
            }.bind(this)

            document.body.addEventListener('mousemove', move)
            document.body.addEventListener('mouseup',up );
            
          }
        }.bind(this).curry(tCase))
     }
    }

  });
  return Cover;
});

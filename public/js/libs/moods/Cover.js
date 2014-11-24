sand.define('Moods/Cover', [
  'Seed',
  'DOM/toDOM',
  'DataPackage/Controller->DP',
  'Moods/Case',
  'DOM/handle'
], function(r) {

  var Cover = r.Seed.extend({

    '+init' : function (opt) {
      
      this.collection = [[[75,50,200,200],[375,50,200,200],[75,300,500,200]],[[75,50,200,450],[375,50,200,200],[375,300,200,200]],[[75,50,200,200],[375,50,200,200],[75,300,200,200],[375,300,200,200]]]
      //this.types = [["img","txt","img","img"],["img","txt","img","img"],["img","txt","img","img"]];
      this.cIndex = 0
      this.layout = opt.layout || this.collection[this.cIndex] //[[75,50,200,450],[375,50,200,200],[375,300,200,200]]// [[75,50,200,200],[375,50,200,200],[75,300,200,200],[375,300,200,200]];
      this.el = r.toDOM('.cover');
      this.images = [];
      
      this.setCover();
      

      
    },

    shuffle : function () {
      this.el.innerHTML ="";
      if(this.collection[this.cIndex + 1]) {
        this.cIndex++;
        this.layout = this.collection[this.cIndex];
      } else {
        this.cIndex = 0;
        this.layout = this.collection[this.cIndex];
      }
      this.setCover();
    },

    setCover : function () {
      for (var i = 0, n = this.layout.length; i < n; i++) {
        var tCase = this.create(r.Case,{ width : this.layout[i][2],  height : this.layout[i][3], imgSrc : this.images && this.images[i] ? this.images[i] : "" });
        tCase.el.style.left = this.layout[i][0] +'px'
        tCase.el.style.top = this.layout[i][1] + 'px'
        this.el.appendChild(tCase.el);
        tCase.el.setAttribute("cover",true);
        tCase.el.setAttribute("index",i);

        tCase.on('droppedOn',function (i,src){
          this.images[i] = src
        }.bind(this).curry(i))

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
              if(e.target != tCase.el && e.target.className == 'case' && e.target.refresh) {
                e.target.refresh(tCase.img.src);
                console.log(["boule",tCase.img.src])
                this.images[tCase.el.getAttribute("index")] = "";
                this.images[e.target.getAttribute("index")] = tCase.img.src ;
                tCase.changeImage("");
              }
              else if (e.target.parentNode != tCase.el && e.target.parentNode.className == 'case' && e.target.parentNode.refresh) {
                e.target.parentNode.refresh(tCase.img.src);
                console.log(["bill",tCase.img.src])
                this.images[tCase.el.getAttribute("index")] = ""; 
                this.images[e.target.parentNode.getAttribute("index")] = tCase.img.src; 
                tCase.changeImage("");
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

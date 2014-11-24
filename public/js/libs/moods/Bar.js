sand.define('Moods/Bar', [
  'Seed',
  'DOM/toDOM',
  'Moods/Resource',
  'DOM/handle',
], function(r) {

/*
**Fire: 2
**On:   0
*/
var Bar = r.Seed.extend({

    /*tpl: function() {
      return {
        tag: '.moods-topbar'
      }
    },*/

    '+init' : function(opt) {
      this.side = opt.side;
      this.scope = {}
      this.el = r.toDOM({
        tag : ".moods"+(opt.side ? "-"+opt.side : ""),
        children : [
          {
            tag : ".resources-wrap",
            children : [
            {
              tag : '.resources'+(opt.type || "")
            }
            ]
          },
          {
            tag : ".previous",
            events : {
              mouseup : function (e) {
                this.resourcesDiv.style.left = this.resourcesDiv.style.left || "0px"
                this.resourcesDiv.style.top = this.resourcesDiv.style.top || "0px";
                //console.log($(this.resourcesDiv).width()+parseInt(this.resourcesDiv.style.left),$(this.scope["resources-wrap"]).width())
                if( (opt.side === "topbar" && $(this.resourcesDiv).width() -72 > $(this.scope["resources-wrap"]).width() && $(this.resourcesDiv).width() > - parseInt(this.resourcesDiv.style.left)) ||  ( opt.side === "leftbar" && $(this.resourcesDiv).height() > $(this.scope["resources-wrap"]).height() && $(this.resourcesDiv).height() > - parseInt(this.resourcesDiv.style.top))) opt.side === "topbar" ? this.resourcesDiv.style.left = parseInt(this.resourcesDiv.style.left) + 72 + "px" : this.resourcesDiv.style.top = parseInt(this.resourcesDiv.style.top) + 72 + "px"
                /*var k = 0;
                var inLoop = false;
                var temp = this.resourcesDiv.childNodes ? this.resourcesDiv.childNodes[k] : null
                console.log(temp && k != this.resourcesDiv.childNodes.length - 2 && temp.style.display == "none")
                while(temp && k != this.resourcesDiv.childNodes.length - 2 && temp.style.display == "none") {
                  k++;
                  temp = this.resourcesDiv.childNodes[k];
                  inLoop = true;
                }
                console.log(this.resourcesDiv.childNodes[k],  this.resourcesDiv.childNodes[k].style.display != "none")
                if(this.resourcesDiv.childNodes[k] && this.resourcesDiv.childNodes[k].style.display != "none") {
                  this.resourcesDiv.childNodes[k].style.display = "none";
                  console.log(this.resourcesDiv.childNodes[k]);
                }*/
              }.bind(this)
            }
          },
          {
            tag : ".next",
            events : {
              mouseup : function (e) {
                this.resourcesDiv.style.left = this.resourcesDiv.style.left || "0px";
                this.resourcesDiv.style.top = this.resourcesDiv.style.top || "0px";
                //console.log($(this.resourcesDiv).width(), $(this.scope["resources-wrap"]).width(),$(this.resourcesDiv).width()+parseInt(this.resourcesDiv.style.left),$(this.resourcesDiv).width()+parseInt(this.resourcesDiv.style.left) > 72)
                if( $(this.resourcesDiv).width() >= $(this.scope["resources-wrap"]).width() && $(this.resourcesDiv).width()+parseInt(this.resourcesDiv.style.left) > 72) opt.side === "topbar"  ? this.resourcesDiv.style.left = parseInt(this.resourcesDiv.style.left) - 72 + "px" : this.resourcesDiv.style.top = parseInt(this.resourcesDiv.style.top) - 72 + "px"
                /*var k = 0;
                var j = this.resourcesDiv.childNodes -1;
                var temp = this.resourcesDiv.childNodes ? this.resourcesDiv.childNodes[k] : null
                var temp2 = this.resourcesDiv.childNodes ? this.resourcesDiv.childNodes[j] : null
                console.log("ok",temp,k != this.resourcesDiv.childNodes.length - 1,temp.style.display == "none")
                while(temp && k != this.resourcesDiv.childNodes.length - 2 && temp.style.display == "none") {
                  k++;
                  temp = this.resourcesDiv.childNodes[k];
                }
                while(temp && k != 1 && temp.style.display == "none"){
                  j--;
                  temp2 = this.resourcesDiv.childNodes[j];
                }
                if(!temp.style.display || temp.style.display !== "none") temp.style.display = "none";
                //if(this.resourcesDiv.childNodes[j] && this.resourcesDiv.childNodes[j].style.display == "none") this.resourcesDiv.childNodes[k-1].style.display = "block";*/
              }.bind(this)
            }
          }
        ]
      },this.scope)
      this.resourcesDiv = this.scope['resources'+(opt.type || "")];
      this.resourcesDiv.setAttribute("dropzone",true);
      this.resourcesDiv.setAttribute("side",opt.side);

      this.resourcesDiv.onResourceDropped = function (id,dropIndex) {
          this.fire('onResourceDropped',{id: id, index: dropIndex});
      }.bind(this)
      this.resourcesDiv.onResourceSwaped = function (from, to) {
        if (from === to) return ;
        this.fire('onResourceSwaped', {from: from, to: to});
      }.bind(this)

      this.resourcesDiv.deleteMe = function (el) {
          this.resourcesDiv.removeChild(el);
          if(this.side == "leftbar"){
            for(var i = parseInt(el.scopeMe('label').innerHTML), n = this.resourcesDiv.childNodes.length; i < n; i++) {
              this.resourcesDiv.childNodes[i].scopeMe("label").innerHTML = i;
            }
          }
      }.bind(this);

      if(this.side == "topbar"){
        this.query('dp').resources.on('insert', this.insertResource.bind(this));
        this.query('dp').resources.on('delete', this.deleteResource.bind(this));
      } else if (this.side == "leftbar") {
        //this.resourcesDiv.appendChild(this.create(r.Resource,{ title : "Cover", src : "", static : true },"cover").el);
        
        /*this.resourcesDiv.staticProcess = function () {
          if(resource == this.addPage) this.query('dp').pages.insert({ src : "", index : this.resourcesDiv.childNodes.length - 1});
        }.bind(this);*/

        this.addPage = r.toDOM({
          tag : '.addPage',
          events: {
            mousedown: function () {
              this.query('dp').pages.insert({ src : "", index : this.resourcesDiv.childNodes.length, state : "" });
            }.bind(this)
          }
        });

        this.cover = r.toDOM({
          tag : '.resource',
          children : [
            {
              tag : '.picto',
              style : {
                backgroundImage : 'url(' + "" + ')',
              }
            },
            {
              tag : '.label ' + "Couverture",
            }
          ],
          style : {
            position : "relative",
          },
          events: {
            mousedown: function () {
              console.log("bob")
              $(".moods")[0].changePage(0);
            }.bind(this)
          }
        });

        $(this.cover).hover(function () { this.cover.className = "resource hovered";}.bind(this),function () { this.cover.className = "resource";}.bind(this))

        this.slideBar = r.toDOM({
          tag : '.slideBar',
          children : [
            {
              tag : '.cursor'
            }
          ]
        },this.scope);

        r.handle(this.scope.cursor).drag({
          start : function (e) {
            this.oT = $(this.scope.slideBar).offset().top;
            this.testX = e.xy[0];

            this.cOffsetY = e.xy[1] - $(this.scope.cursor).offset().top;
          }.bind(this),
          drag : function (e) {
            this.scope.cursor.style.top= this.scope.cursor.style.top || "0px"
            if(e.xy[1] - this.oT  - this.cOffsetY >= 0 && e.xy[1] - this.oT  - this.cOffsetY < $(this.scope.slideBar).height() - $(this.scope.cursor).height() ) {
              this.scope.cursor.style.top = e.xy[1] - this.oT  - this.cOffsetY +"px";
              var ratio = parseInt(this.scope.cursor.style.top)/($(this.scope.slideBar).height()+80)
              this.resourcesDiv.style.top = -ratio*$(this.resourcesDiv).height() +"px";
            }
          }.bind(this),
        })
        
        this.resourcesDiv.appendChild(this.cover);
        this.el.insertBefore(this.addPage,this.scope['resources-wrap']);
        this.el.appendChild(this.slideBar);

        this.query('dp').pages.on('insert', function(model) {
          //this.insertResource(this.query('dp').resources.where(function(e) { return e.id === model[0].resourceID}), model[0].id);
          this.insertResource(model);
        }.bind(this));
        this.query('dp').pages.on('delete', this.deleteResource.bind(this));

        this.resourcesDiv.putAt = function (index,el,sIndex) {
          if(index < 1) return;
          if(this.resourcesDiv.childNodes[index]) $(el).insertAfter(this.resourcesDiv.childNodes[index])
          
          this.query('dp').pages.all.splice(index-1,0,this.query('dp').pages.all.splice(parseInt(this.resourcesDiv.childNodes[index-1].scopeMe("label").innerHTML)-1,1)[0]);
          var buff = this.query('dp').pages.all[sIndex-1].src;
          
          //this.query('dp').pages.all[sIndex-1].edit({ src : this.query('dp').pages.all[index-1].src});
          //this.query('dp').pages.all[index-1].edit({ src : buff});
          
          for(var i = 0 , n = this.query('dp').pages.all.length; i < n; i++ ){
            this.query('dp').pages.all[i].edit({ index : i+1 });
            this.resourcesDiv.childNodes[i+1].scopeMe("label").innerHTML = i+1;
          }
        }.bind(this)
        
        this.resourcesDiv.changePage = function (index) {
          $(".moods")[0].changePage(index);
        }.bind(this)
      }

      

    },

    swapResources: function(indexes) {
      var el = this.scope.resources.removeChild(this.scope.resources.childNodes[indexes.from]);
      console.log('virer');
      this.scope.resources.insertBefore(el, this.scope.resources.childNodes[indexes.to]);
    },

    insertResource : function (model) {
      if (this.side === 'topbar') {
        this.scope.resources.appendChild(this.create(r.Resource,{ src: model[0].src,title : model[0].title, id: model[0].id},'lastResource').el);
      } else if (this.side === 'leftbar') {
        var el = this.create(r.Resource,{ src: model[0].src,title : model[0].index},'lastResource').el;
        this.scope.resources.appendChild(el);

        /*var tmp = this.lastResource;
        tmp.el.addEventListener('mousedown', function(e) {
          this.fire('setPage', this.query('dp').pages.one(function(e) {
            return (e.resourceID === tmp.id) && (typeof pageID === 'undefined' ? 1 : e.id === pageID);
          }.bind(this)).index);
        }.bind(this))*/
      }
    },

    deleteResource: function(model, options) {
      ;
    },





  });
  return Bar;
});

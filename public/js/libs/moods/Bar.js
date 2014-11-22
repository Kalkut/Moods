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
            tag : ".previous <<",
            events : {
              mouseup : function (e) {
                this.resourcesDiv.style.left = this.resourcesDiv.style.left || "0px"
                this.resourcesDiv.style.top = this.resourcesDiv.style.top || "0px"
                if( (opt.side === "topbar" && $(this.resourcesDiv).width() > $(this.scope["resources-wrap"]).width() && $(this.resourcesDiv).width() > - parseInt(this.resourcesDiv.style.left)) ||  ( opt.side === "leftbar" && $(this.resourcesDiv).height() > $(this.scope["resources-wrap"]).height() && $(this.resourcesDiv).height() > - parseInt(this.resourcesDiv.style.top))) opt.side === "topbar" ? this.resourcesDiv.style.left = parseInt(this.resourcesDiv.style.left) + 72 + "px" : this.resourcesDiv.style.top = parseInt(this.resourcesDiv.style.top) + 72 + "px"
              }.bind(this)
            }
          },
          {
            tag : ".resources-wrap",
            children : [
            {
              tag : '.resources'+(opt.type || "")
            }
            ]
          },
          {
            tag : ".next >>",
            events : {
              mouseup : function (e) {
                this.resourcesDiv.style.left = this.resourcesDiv.style.left || "0px";
                this.resourcesDiv.style.top = this.resourcesDiv.style.top || "0px";
                if( $(this.resourcesDiv).width() >= $(this.scope["resources-wrap"]).width() ) opt.side === "topbar" ? this.resourcesDiv.style.left = parseInt(this.resourcesDiv.style.left) - 72 + "px" : this.resourcesDiv.style.top = parseInt(this.resourcesDiv.style.top) - 72 + "px"
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

      if(this.side == "topbar"){
        this.query('dp').resources.on('insert', this.insertResource.bind(this));
        this.query('dp').resources.on('delete', this.deleteResource.bind(this));
      } else if (this.side == "leftbar") {
        this.resourcesDiv.appendChild(this.create(r.Resource,{ title : "Cover", src : "", static : true },"cover").el);
        
        /*this.resourcesDiv.staticProcess = function () {
          if(resource == this.addPage) this.query('dp').pages.insert({ src : "", index : this.resourcesDiv.childNodes.length - 1});
        }.bind(this);*/

        this.addPage = r.toDOM({
          tag : '.resource',
          children : [
            {
              tag : '.picto',
              style : {
                backgroundImage : 'url(' + "" + ')',
              }
            },
            {
              tag : '.label ' + "Nouvelle page",
            }
          ],
          style : {
            position : "relative",
          },
          events: {
            mousedown: function () {
              console.log("bob")
              this.query('dp').pages.insert({ src : "", index : this.resourcesDiv.childNodes.length - 1, state : "" });
            }.bind(this)
          }
        });
        
        this.resourcesDiv.appendChild(this.addPage);

        this.query('dp').pages.on('insert', function(model) {
          //this.insertResource(this.query('dp').resources.where(function(e) { return e.id === model[0].resourceID}), model[0].id);
          this.insertResource(model);
        }.bind(this));
        this.query('dp').pages.on('delete', this.deleteResource.bind(this));

        this.resourcesDiv.changePage = function (index) {
          $(".moods")[0].changePage(index);
        }.bind(this)
      }

      /*this.handle = r.handle(this.el);

      this.handle.drag({
        start : function (e) {
          this.sL = this.resourcesDiv.style.left;
          this.sT = this.resourcesDiv.style.top;

          this.oL = $(this.resourcesDiv).offset().left;
          this.oT = $(this.resourcesDiv).offset().top;

          this.cOffsetX = e.xy[0] - $(this.resourcesDiv).offset().left;
          this.cOffsetY = e.xy[1] - $(this.resourcesDiv).offset().top;
        }.bind(this),
        drag : function (e) {
          if(e.shiftKey){
            console.log( e.xy[0] - this.oL  - this.cOffsetX + "px")
            this.resourcesDiv.style.left = e.xy[0] - this.oL - this.cOffsetX + "px";
          }
        }.bind(this)
      }) */

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
        console.log(model[0]);
        this.scope.resources.insertBefore(el, this.addPage);

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

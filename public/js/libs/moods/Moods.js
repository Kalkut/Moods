sand.define('Moods/Master', [
  'Seed',
  'DOM/toDOM',
  'DataPackage/Controller->DP',
  'Moods/Bar',
  'Moods/Upload',
  'Moods/View',
  'Moods/Cover',
  'Review/ComModule'
], function(r) {

  var Moods = r.Seed.extend({

    isMediator: true,
    respondsTo: { dp: function() {return this.dp;} },

    options: function() {
      return {
        dp: new r.DP({
          data: {pages: [], resources: [], comments: []}
        }),
        pages: [],
        cover: this.create(r.Cover),
        current: null
      }
    },

    tpl: function() {
      return {
        tag: '.moods',
        children: [
          this.create(r.Bar, {side : "topbar"}, 'topbar').el,
          this.create(r.Bar, {side : "leftbar"}, 'leftbar').el,
          {
            tag: '.moods-container', as: 'container',
            children: [
            {
              tag: '.moods-container-view', as: 'containerView',
              children: [
              this.create(r.View, null, 'view').el,
              ]
            }
            ]
          }
        ]
      }
    },

    '+init': function() {
      console.log('Init Moods...');

      this.create(r.ComModule, {attachEl: this.containerView, dp: this.dp, id: 'cover'}, 'commentsbar');

      //this.dp.resources.insert({id: 'cover', src: '/img/tex_00.jpg', title: 'cover'});

      this.topbar.el.insertBefore(this.create(r.Upload, {complete: function(file) {
        this.dp.resources.insert({src: file.content, title: file.name});
      }.bind(this)}, 'upload').el,this.topbar.scope["resources-wrap"]);


      /*Listeners*/
      /*this.leftbar.on('setPage', this.setView.bind(this));
      ['insert', 'edit', 'delete'].each(function(e) {
        this.dp.pages.on(e, function(model, options) {
          this[e + 'Page'](model, options);
        }.bind(this))
      }.bind(this));
      this.leftbar.on('onResourceDropped', function(data) {
        console.log('index', data.index)
        if (data.index <= 0) data.index = 1;
        data.resourceID = data.id;
        delete data.id;
        this.insertPageDP(data);
        this.offsetIndexPage([this.pages.length - 1, data.index], data.resourceID);
        this.setView(data.index);
      }.bind(this));

      this.leftbar.on('onResourceSwaped', function(indexes) {
        console.log(indexes.from, indexes.to, this.dp.pages.all);
        var tmp = this.pages.splice(indexes.from, 1);
        this.pages.splice(indexes.to, 0, tmp[0]);
        var tmp = this.dp.pages.one(function(e) { return e.index === indexes.from }.bind(this));
        // this.dp.pages.where(function(e) { return e.index > indexes.from}.bind(this)).each(
        //   function(e) {
        //     e.edit({index: e.index - 1});
        //   }.bind(this))
        this.offsetIndexPage([indexes.from, indexes.to], tmp.resourceID);
        tmp.edit({index: indexes.to});
        this.leftbar.swapResources(indexes);
        console.log(this.pages, this.dp.pages.all);
        this.setView(indexes.to);
      }.bind(this));*/

      this.el.changePage = function (index) {
        this.view.changePage(this.dp.pages.where('index',parseInt(index))[0]);
      }.bind(this);

      /*Insert cover*/
      //this.dp.pages.insert({resourceID: 'cover', index: 0});

      //this.setView(0);
      //this.showCom();
    },

  insertPageDP: function(model) {
    console.log('Insert ', model)
    this.dp.pages.insert(model);
  },
  editPageDP: function(model, options) {
    this.dp.pages.edit(model, options);
  },
  deletePageDP: function(model) {
    this.dp.pages.delete(model);
  },

  /*Page Managing*/
    insertPage: function(model) {
      this.pages.splice(model[0].index, 0, model[0].resourceID);
      // this.pages[model[0].index] = model[0].resourceID;
    },

    editPage: function(model, options) {
      return ;
      /*Should add a lot of stuff to manage arrays*/
      /*Not enough time*/
      for (var i = 0, len = this.pages.length; i < len; i++) {
        if (model.resourceID === this.pages[i]) {
            if (options.index) this.pages[model.index] = model.resourceID;
          return ;
        }
      }
    },

    deletePage: function(model) {
      for (var i = 0, len = this.pages.length; i < len; i++) {
        if (model.id === this.pages[i]) {
          this.pages.splice(i, 1);
          return ;
        }
      }
    },

    offsetIndexPage: function (index, resourceID) {
      var prevIndex = index[0];
      var newIndex = index[1];
      if (prevIndex === newIndex) return ;
      this.dp.pages.where(function(e) {
        console.log(e.resourceID, resourceID)
        return (e.resourceID !== resourceID && e.index <= Math.max(prevIndex, newIndex)
                    && e.index >= Math.min(prevIndex, newIndex));
      }.bind(this)).each(function(e) {
        console.log('push offset ', e.resourceID, e.index);
        e.edit({index: e.index + 1})
      }.bind(this))
    },

    setView: function(pageIndex) {
      console.log('Set view: ', pageIndex)
      if (pageIndex === 0) {
        this.current = 0;
        this.view.setCurrent(this.cover);
        this.commentsbar.setID('cover', this.container);
      } else {
        var res;
        this.current = pageIndex;
        res = this.dp.resources.one(function(e) {
          return e.id === this.pages[pageIndex];
        }.bind(this));
        this.view.setCurrent(res);
        this.commentsbar.setID(this.dp.pages.one(function(e) {return e.index === pageIndex}.bind(this)).id, this.container);
      }
    },

    showCom: function() {
      if (this.commentsbar.el.style.left === '0px') {
        this.hideCom();
        return ;
      }
      this.container.appendChild(this.commentsbar.el);
      this.containerView.style.width = "70%";
      this.commentsbar.el.style.left = "0px";
      this.commentsbar.colCom.display();
    },

    hideCom: function() {
      this.containerView.style.width = "95%";
      this.commentsbar.el.style.left = "20%";
      setTimeout(function() {this.commentsbar.el.remove();}.bind(this), 300);
    },

    getMapResources: function() {
      return null;
    },

    uploadResources: function() {
      ;
    },

    resourceToView : function (ressource) {
      //this.create(r.View,{ src : resources.src})
    },

  });
  return Moods;
});

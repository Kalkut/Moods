sand.define('Moods/View',['Moods/Case','Moods/Cover','DOM/toDOM','Moods/BP','Seed'], function (r) {
	var Case = r.Case;



	return r.Seed.extend({

		'+init' : function (opt) {
			this.scope = {};

			this.el = r.toDOM({
				tag : '.view.',
				children : [
					this.create(r.Case,{ width : 600, height : 500, fit : true, imgSrc : this.src },'pageCase').el,
					this.create(r.Cover, null,"cover").el
				]
			},this.scope);

			this.pageCase.el.style.display = "none";
			this.index = 0;
			this.pageCase.on('case:imageMovedPx', function () {
				this.query('dp').pages.all[this.index-1].edit({state : this.pageCase.saveState() });
			}.bind(this))

			this.pageCase.on('droppedOn', function (src) {
				this.fire('updatePreview',src,this.index)
			}.bind(this))

			/*document.body.addEventListener("keyup", function (e) {
				var dpPages = this.query('dp').pages.all;
				if(e.keyCode == 38){
					this.index--;
					this.changePage(this.index <= 0 ? null : dpPages[this.index-1])
				}else if(e.keyCode == 40){
					if(this.index+1 <= dpPages.length) {
						this.index++;
						this.changePage(dpPages[this.index-1])
					}
				}
			}.bind(this))*/

		},

    setCurrent: function(model) {

    },

    changePage : function (model) {
    	if(model) {
    		this.index = model.index;
    		this.src = model.src;
    		this.cover.el.style.display = "none";
    		this.pageCase.el.style.display = "block";
    		this.pageCase.setState(model.state);
    		if(!model.state) this.pageCase.changeImage(model.src)
    	} else {
    		this.index = 0
    		this.cover.el.style.display = "block";
    		this.pageCase.el.style.display = "none";
    	}
    },

    shuffle : function () {
    	if(this.index == 0) this.cover.shuffle();
    }

  })
})

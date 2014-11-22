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
		},

    setCurrent: function(model) {

    },

    changePage : function (model) {
    	if(model.index) {
    		this.cover.el.style.display = "none";
    		this.pageCase.el.style.display = "block";
    		this.pageCase.setState(model.state);
    	}
    }

  })
})

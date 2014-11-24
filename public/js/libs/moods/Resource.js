sand.define('Moods/Resource', [
	'Seed',
	'DOM/handle',
	'DOM/toDOM',
], function(r) {

		Function.prototype.curry = function () {
		var self = this;
		var args = Array.prototype.slice.call(arguments);
		return function () {
			return self.apply([], args.concat(Array.prototype.slice.call(arguments)));
		};
	}

	var ResourceSeed = r.Seed.extend({

		'options': function () {
			return {
				id: 0
			}
		},

		'+init' : function(input) {
			this.static = input.static;
			this.title = input.title;
			this.scope = {};

			this.el = r.toDOM({
				tag : '.resource',
				children : [
					{
						tag : '.remove',
						/*events : {
							mouseup : function () {
								
							}
						},*/
						style : {
							zIndex : 10
						}
					},
					{
						tag : '.picto',
						style : {
							pointerEvents : "none",
							backgroundImage : 'url(' + input.src + ')',
						}
					},
					{
						tag : '.label ' + (input.title || "No title"),
						style : {
							pointerEvents : "none",
						}
					}
				],
				style : {
					position : "relative",
				},
				events: {
					click: function(e) {
						console.log('Fire set page to resource id ' + this.id);
				}.bind(this)}
			},this.scope);

			this.mask = r.toDOM(".popup-mask");
			
			this.popUp = r.toDOM({
					tag : ".popup#reset-token-expired-popup",
					children : [
						{
							tag : ".popup-header",
							children : [
								{
									tag : '.close',
									events : {
										click : function () {
											$(".moods")[0].removeChild(this.mask);
											$(".moods")[0].removeChild(this.popUp);
										}.bind(this)
									}
								}
							]
						},
						{
							tag : ".popup-content#reset-token-expired-landing-conten",
							children : [
								{
									tag : ".picto.warning-picto"
								},
								{
									tag : ".title ÊTES VOUS SÛR?",
								},
								{
									tag : ".text Vous allez supprimer une page: <span class =\"continue\">Continuer</span> ou <span class =\"cancel\">annuler</span>"
								}
							]
						}
					]
			})

			

			this.el.scopeMe = function(string) {
				return this.scope[string];
			}.bind(this)

			this.src = input.src;

			$(this.el).hover(function () { this.el.className = "resource hovered";}.bind(this),function () { this.el.className = "resource";}.bind(this))

			this.handle = r.handle(this.el);

			this.handle.drag({
				start : function (e){
					e.preventDefault();
					if(e.target == this.scope.remove && this.el.parentNode.getAttribute("side") === "leftbar") {
						$(".moods")[0].appendChild(this.mask);
						$(".moods")[0].appendChild(this.popUp);
						
						$(".continue")[0].onclick = function () {
							this.el.parentNode.changePage(parseInt(this.scope.label.innerHTML)-1);
							this.query('dp').pages.all[parseInt(this.scope.label.innerHTML)-1].remove();
							this.el.parentNode.deleteMe(this.el);
							this.deleted = true;
							$(".moods")[0].removeChild(this.mask);
							$(".moods")[0].removeChild(this.popUp);
							return;
						}.bind(this);

						$(".cancel")[0].onclick = function () {
							$(".moods")[0].removeChild(this.mask);
							$(".moods")[0].removeChild(this.popUp);
							return;
						}.bind(this);

						
					} else if (e.target == this.scope.remove && this.el.parentNode.getAttribute("side") === "topbar") {
						this.query('dp').resources.where("title",this.scope.label.innerHTML)[0].remove();
						this.el.parentNode.deleteMe(this.el);
						this.deleted = true;
						return;
					}


					this.buffEl = this.el.cloneNode(true);
					$('.moods')[0].appendChild(this.buffEl);
					this.buffEl.style.position = "absolute";
					this.buffEl.style.pointerEvents = "none";
					this.buffEl.style.backgroundColor = "#FFFFFF"
					this.buffEl.style.zIndex = 90;
					this.fParent = this.el.parentNode;
					this.sIndex = [].concat.apply([],this.el.parentNode.childNodes).indexOf(this.el);
					//this.el.style.position = "absolute";

					if(!this.hintDiv) this.hintDiv = document.createElement('div');
					/*this.hintDiv.style.width = "1px";
					this.hintDiv.style.height = "66px";
					this.hintDiv.style.cssFloat = "left";
					this.hintDiv.style.backgroundColor = "#B5302b";
					this.hintDiv.style.marginRight = "-1px";*/

					this.sL = this.el.style.left;
					this.sT = this.el.style.top;
					this.oL = /*$(this.el.parentNode)*/$('.moods').offset().left;
					this.oT = /*$(this.el.parentNode)*/$('.moods').offset().top;
					this.width = $(this.el).width();
					this.height = $(this.el).height();

					this.sIndex = Array.prototype.slice.call(this.el.parentNode.childNodes).indexOf(this.el);


					this.cOffsetX = e.xy[0] - $(this.el).offset().left;
					this.cOffsetY = e.xy[1] - $(this.el).offset().top;

					this.buffEl.style.left = e.xy[0] - this.oL /*+ $(document.body).scrollLeft()*/ - this.cOffsetX + "px";
					this.buffEl.style.top = e.xy[1] - this.oT  /*+ $(document.body).scrollTop()*/ - this.cOffsetY  + "px";
					this.sX = parseInt(this.buffEl.style.left);

					//this.el.style.pointerEvents = "none";
				}.wrap(this),
				drag : function (e) {
					if(this.deleted) return;
					this.buffEl.style.left = e.xy[0] - this.oL /*+ $(document.body).scrollLeft()*/ - this.cOffsetX + "px";
					
					this.buffEl.style.top = e.xy[1] - this.oT - this.cOffsetY + "px";
					//else this.buffEl.style.top = $('.resources-wrap').position().top + $('.resources-wrap').offset().top + 'px';

					//else this.buffEl.style.top = parseInt(this.buffEl.style.top) +1 + 'px'
					//this.hint(e,this.hintDiv);
					//console.log(this.contain($(this.buffEl),$('.addPage')))
				}.wrap(this),
				end: function (e) {
					if(this.deleted) return;
					//this.hint(e,this.hintDiv);
					
					if(this.fParent.getAttribute("side") != "leftbar" && e.target.className == 'case' && e.target.refresh) {
						e.target.refresh(this.src);
						if(!e.target.getAttribute("cover")) this.query('dp').pages.all[parseInt($(".moods")[0].getAttribute("page"))-1].edit({state : e.target.saveState() })
						e.target.fire("droppedOn",this.src);
					}
					else if (this.fParent.getAttribute("side") != "leftbar" && e.target.parentNode.className == 'case' && e.target.parentNode.refresh) {
						e.target.parentNode.refresh(this.src);
						if(!e.target.parentNode.getAttribute("cover")) this.query('dp').pages.all[parseInt($(".moods")[0].getAttribute("page"))-1].edit({state : e.target.parentNode.saveState() })
						e.target.parentNode.fire("droppedOn",this.src);
					}

					var index = Array.prototype.slice.call(this.fParent.childNodes).indexOf(this.hint(e))
					if(this.hintDiv.parentNode) this.hintDiv.parentNode.removeChild(this.hintDiv);

					/*if (this.fParent.getAttribute("side") == "leftbar"){
						if(this.sIndex != index && index<this.fParent.childNodes.length) this.fParent.putAt(index,this.el,this.sIndex);
					}*/

					if(this.buffEl && this.buffEl.parentNode) this.buffEl.parentNode.removeChild(this.buffEl);

					this.el.style.pointerEvents = "auto"
					this.el.style.left = null;
					this.el.style.top = null;

					if(this.el.parentNode.getAttribute("side") === "leftbar") this.el.parentNode.changePage(this.title);
				}.wrap(this)
			});

			this.handle.on('click', this.fire.bind(this).curry('click'), this);
		},

		hint : function (e) {
			var next = document.elementFromPoint(e.xy[0],e.xy[1]);
			if (!next) return;
			if (next.parentNode.getAttribute("side") == "leftbar" && (next.className == "resource" || next.className == "resource hovered")){
				//console.log(e.xy[1],$(next).offset().top,$(next).position().top, $(next).height()*0.5)
				//e.xy[1] - $(next).offset().top <  $(next).height()*0.5 ? $(elem).insertBefore($(next)) : $(elem).insertAfter($(next));
				//$(elem).insertAfter($(next));
				return next;
			}else if (next.parentNode.parentNode.getAttribute("side") == "leftbar" && (next.parentNode.className == "resource" || next.parentNode.className == "resource hovered")){
				//$(elem).insertAfter($(next.parentNode));
				return next.parentNode;
			}

			return null;
		},

		contain : function ($div1, $div2) {
      var x1 = $div1.offset().left;
      var y1 = $div1.offset().top;
      var h1 = $div1.outerHeight(true);
      var w1 = $div1.outerWidth(true);
      var b1 = y1 + h1;
      var r1 = x1 + w1;
      var x2 = $div2.offset().left;
      var y2 = $div2.offset().top;
      var h2 = $div2.outerHeight(true);
      var w2 = $div2.outerWidth(true);
      var b2 = y2 + h2;
      var r2 = x2 + w2;

      if (x1 >= x2 && y1 >= y2 && b1 <= b2 && r1 <= r2) return true;
      return false;
    }



	})
		return ResourceSeed
});

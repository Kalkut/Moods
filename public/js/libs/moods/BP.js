sand.define('Moods/BP',['DOM/toDOM','Seed','DOM/handle'], function (r) {

	function placeCaretAtEnd(el) {
		if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
			var range = document.createRange();
			range.selectNodeContents(el);
			range.collapse(false);
			var sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		}else if (typeof document.body.createTextRange != "undefined") {
			var textRange = document.body.createTextRange();
			textRange.moveToElementText(el);
			textRange.collapse(false);
			textRange.select();
		}
	}

	return r.Seed.extend({
		'+init' : function (opt) {

			this.scope = {};
			this.el = r.toDOM('.bp-commentaries',this.scope)
			this.addComment();
		},

		addComment : function () {
			var scope = {};
			var newComment = r.toDOM({
				tag : '.comment',
				children : [
					'.pin-picto',
				{

					tag : '.textfield',
					attr : {
						contentEditable : true
					},
					events : {
						focus : function (e) {
							placeCaretAtEnd(scope.textfield);
						},
						keyup : function (e) {
							if(e.keyCode == 13) {
								e.preventDefault();
								this.addComment();
							}
						}.bind(this),
						keydown : function (e) {
							if(e.keyCode == 13) {
								return false;
							}  else if (e.keyCode == 8 && !scope.textfield.innerHTML) {
								e.preventDefault();
								this.deleteComment(scope.comment);
							}
						}.bind(this),
						dblclick : function (e) {
							this.addResponse(scope.comment)
						}.bind(this)
					}
				}
				]
			},scope)

			this.scope['bp-commentaries'].appendChild(newComment);
			var pinPicto = scope['pin-picto'];

			
			r.handle(pinPicto).drag({
				start : function (e) {

					pinPicto.style.position = "relative"
					if(!pinPicto.oL) pinPicto.oL = $(pinPicto).offset().left;
					if(!pinPicto.oT) pinPicto.oT = $(pinPicto).offset().top;
					if(!pinPicto.line) {
						pinPicto.line = r.toDOM({
							tag : '.line',
							style : {
								position : "absolute",
								height : "1px",
								backgroundColor : "#000000",
							}
						})
						$(pinPicto.line).insertBefore(pinPicto.parentNode.childNodes[0])
					}
					pinPicto.cOffsetX = e.xy[0] - $(pinPicto).offset().left;
					pinPicto.cOffsetY = e.xy[1] - $(pinPicto).offset().top;
					pinPicto.style.left = e.xy[0] + $(document.body).scrollLeft() - pinPicto.oL + "px";
					pinPicto.style.top = e.xy[1] + $(document.body).scrollTop()- pinPicto.oT  + "px";
					pinPicto.style.pointerEvents = "none"


				}.wrap(this),
				drag : function (e) {
					pinPicto.style.left = e.xy[0]  + $(document.body).scrollLeft()- pinPicto.oL + "px";
					pinPicto.style.top = e.xy[1] + $(document.body).scrollTop() - pinPicto.oT  + "px";
					pinPicto.line.style.transformOrigin = "0 0";
					pinPicto.line.style.transform = "rotate("+Math.atan2(parseInt(pinPicto.style.top)+0.5*$(pinPicto).height(),(parseInt(pinPicto.style.left)+0.5*$(pinPicto).width()))*180/Math.PI+"deg)";
					pinPicto.line.style.width = Math.sqrt(Math.pow(parseInt(pinPicto.style.left)+0.5*$(pinPicto).width(),2) + Math.pow(parseInt(pinPicto.style.top)+0.5*$(pinPicto).height(),2)) +"px";
				}.wrap(this),
				end : function (e) {
					pinPicto.style.pointerEvents = "auto";

				}.wrap(this)
			})
			scope.textfield.focus();

			return [newComment,scope];
		},

		deleteComment : function (comment) {
			comment.parentNode.removeChild(comment);
		},

		addResponse : function (comment){
			var scope = {};
			var newResponse = r.toDOM({
				tag : '.response',
				children : [
					'.pin-picto',
				{

					tag : '.textfield',
					attr : {
						contentEditable : true
					},
					events : {
						focus : function (e) {
							placeCaretAtEnd(scope.textfield);
						},
						keyup : function (e) {
							if(e.keyCode == 13) {
								e.preventDefault();
								//this.addComment();
							}
						}.bind(this),
						keydown : function (e) {
							if(e.keyCode == 13) {
								return false;
							}  else if (e.keyCode == 8 && !scope.textfield.innerHTML) {
								e.preventDefault();
								//this.deleteComment(scope.comment);
							}
						}.bind(this)
					}
				}
				]
			},scope)

			comment.appendChild(newResponse);
		},

		setBP : function (comments) {
			/*DATA MODEL
				{
					comment :  
					{
						picto : { left , top },
						text : "",
						responses : [
						{
							picto : { left , top },
							text : "",
						}
						]
					}
				}
			*/

			if(this.el) $(this.el).empty();
			if(this.el.parentNode) {
				var fParent = this.el.parentNode;
				this.el.parentNode.removeChild(this.el);
			}
			this.scope = {};
			this.el = r.toDOM('.bp-commentaries',this.scope);
			
			var commentAndScope = this.addComment();
			var comment = commentAndScope[0];
			var commentScope = commentAndScope[1];

			commentScope.textfield.innerHTML = comments/*[i]*/.text;
			commentScope['pin-picto'].style.position = "relative";
			commentScope['pin-picto'].style.left = comments/*[i]*/.picto.left;
			commentScope['pin-picto'].style.top = comments/*[i]*/.picto.top;
			if( parseInt(commentScope['pin-picto'].style.top) || parseInt(commentScope['pin-picto'].style.left) ){
				var pinPicto = commentScope['pin-picto'];
				pinPicto.line = r.toDOM({
							tag : '.line',
							style : {
								position : "absolute",
								height : "1px",
								backgroundColor : "#000000",
							}
				})
				$(pinPicto.line).insertBefore(pinPicto.parentNode.childNodes[0])
				pinPicto.line.style.transformOrigin = "0 0";
				pinPicto.line.style.transform = "rotate("+Math.atan2(parseInt(pinPicto.style.top)+0.5*$(pinPicto).height(),(parseInt(pinPicto.style.left)+0.5*$(pinPicto).width()))*180/Math.PI+"deg)";
				pinPicto.line.style.width = Math.sqrt(Math.pow(parseInt(pinPicto.style.left)+0.5*$(pinPicto).width(),2) + Math.pow(parseInt(pinPicto.style.top)+0.5*$(pinPicto).height(),2)) +"px";
			}

			if(fParent) fParent.appendChild(this.el);
		}
	})
})

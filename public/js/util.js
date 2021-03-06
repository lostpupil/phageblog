$(function() {
	AV.$ = jQuery;
	AV.initialize( "liy4558tscjsqv4g5ig92196hmo4sjywaxdvjmft2wwni0gm",
		            "2116ukuphlf1ph384xk4badifaemkgovjih47gtgb5972ac1");
	var People = AV.Object.extend("People", {
	// Default attributes for the todo.
	defaults: {
		name:"Doctor Who",
		email:"",
		mobile:"",
		wechat:""
	},
	// Ensure that each todo created has `content`.
	initialize: function() {
		if (!this.get("name")) {
		this.set({
			"name": this.defaults.name
		});
	}
	}

	});
	var PeopleList = AV.Collection.extend({

		// Reference to this collection's model.
		model:People,

		nextOrder: function() {
		if (!this.length) return 1;
		return this.last().get('order') + 1;
		},

		// Todos are sorted by their original insertion order.
		comparator: function(people){
			return people.get('order');
		}

	});

	var HomeView = AV.View.extend({
		 events:{

		 },
		 el: ".content",
		  initialize: function() {
		  	 this.render();
		  },
		render: function() {
			this.$el.html(_.template($("#home-tpl").html()));
			this.delegateEvents();
       		 }
	});
	var AddView = AV.View.extend({
		 events:{
		 	 "click .btn-save": "peoplesave"
		 },
		 el: ".content",
		  initialize: function() {
		  	 this.people = new PeopleList;
		  	  _.bindAll(this, 'render', 'close');
		  	 this.render();
		  },

		render: function() {
			this.$el.html(_.template($("#add-tpl").html()));
			this.delegateEvents();
       		 },
       		peoplesave: function(e) {
			this.close();
		},
		close: function() {
			this.people.create({

			name: $('#name').val(),
			email:$('#email').val(),
			mobile:$('#mobile').val(),
			wechat:$('#wechat').val(),
			 order: this.people.nextOrder()
			});
			alert('New object created');
		}

	});	
	 var SingleView = AV.View.extend({
	        template: _.template($('#single-tpl').html()),
	        // The DOM events specific to an item.
	        events: {
	            "click .btn-del": "clear"
	        },

	        initialize: function() {
		_.bindAll(this, 'render');

	        },
	        clear:function(){
	        	console.log("hi");
	        	 this.model.destroy();
	        },

	        // Re-render the contents of the todo item.
	        render: function() {
	            $(this.el).html(this.template(this.model.toJSON()));
	            return this;
	        },

	    });
	var AllView = AV.View.extend({
		 events:{

		 },
		 el: ".content",
		  initialize: function() {
		  	 var self = this;
		  	 _.bindAll(this, 'addOne', 'addAll');
		  	 this.people = new PeopleList;
			this.people.bind('add', this.addOne);
			this.people.bind('reset', this.addAll);
		  	 this.people.fetch();
		  	
		  	 this.render();
		  },
		addOne: function(people) {
		    var view = new SingleView({
		        model: people
		    });    
		var something =view.render().el;
		this.$("#impress").append(something.innerHTML);
		},

		// Add all items in the Todos collection at once.
		addAll: function(collection) {
		    this.$("#impress").html("");
		    this.people.each(this.addOne);
		},
		render: function() {
			this.$el.html(_.template($("#all-tpl").html()));
			this.delegateEvents();
       		 }

	});	
	// The main view for the app
	var AppView = AV.View.extend({
	// Instead of generating a new element, bind to the existing skeleton of
	// the App already present in the HTML.
		el: $("#main"),

		initialize: function() {
			this.render();
		},

		render: function() {
			new HomeView();
		}
	});

	var AppRouter = AV.Router.extend({
	routes: {
	"all": "all",
	"home": "home",
	"add": "add"

	},
	currentView: null,
	initialize: function(el) {
		this.el = el;
		this.allview = new AllView();
		this.homeview = new HomeView();
		this.addview = new AddView();
	},
	remove: function() {
		// Empty the element and remove it from the DOM while preserving events
		$(this.el).empty().detach();
		return this;
	},
	switchView: function(view) {
		if (this.currentView) {
			// Detach the old view
			this.currentView.remove();
		}
		// Move the view element into the DOM (replacing the old content)
		$('#submain').html(view.el);

		// Render view after it is in the DOM (styles are applied)
		view.render();

		this.currentView = view;
	},
	all: function() {
		this.switchView(this.allview);
		console.log(this);
	},

	home: function() {
		this.switchView(this.homeview);
	},

	add: function() {
		this.switchView(this.addview);
	}
	});
	new AppRouter;
	new AppView;
	AV.history.start();
});


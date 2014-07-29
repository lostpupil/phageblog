$(function() {
	AV.$ = jQuery;
	AV.initialize( "liy4558tscjsqv4g5ig92196hmo4sjywaxdvjmft2wwni0gm",
		            "2116ukuphlf1ph384xk4badifaemkgovjih47gtgb5972ac1");

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

		 },
		 el: ".content",
		  initialize: function() {
		  	 this.render();
		  },
		render: function() {
			this.$el.html(_.template($("#add-tpl").html()));
			this.delegateEvents();
       		 }
	});	
	var AllView = AV.View.extend({
		 events:{

		 },
		 el: ".content",
		  initialize: function() {
		  	 this.render();
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

	initialize: function(options) {},

	all: function() {
		new AllView();
	},

	home: function() {
		new HomeView();
	},

	add: function() {
		new AddView();
	}
	});
	new AppRouter;
	// new AppView;
	AV.history.start();
});


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

	 var SingleView = AV.View.extend({
       	        tagName: "li",
	        template: _.template($('#single-tpl').html()),
	        // The DOM events specific to an item.
	        events: {
	             "click .upd": "updatepeople"
	        },

	        initialize: function() {
		_.bindAll(this, 'render','close');

		this.model.bind('change', this.render);

	        },

	        // Re-render the contents of the todo item.
	        render: function() {

		$(this.el).html(this.template(this.model.toJSON()));
		this.name=this.$("input[name='name']");
		this.email=this.$("input[name='email']");
		this.mobile=this.$("input[name='mobile']");
		this.wechat=this.$("input[name='dataZ']");
	            return this;
	        },
		 updatepeople: function(e) {
			this.close();
		        },
		close: function() {
		this.model.save({
			name:this.name.val(),
			email:this.email.val(),
			mobile:this.mobile.val(),
			wechat:this.wechat.val()
		});
		}

	    });
	var AllView = AV.View.extend({
		 events:{
		 	 "click #save": "createOnEnter"
		 },
		 el: ".content",
		  initialize: function() {
		  	 var self = this;
		  	 _.bindAll(this, 'addOne', 'addAll', 'addSome', 'render', 'createOnEnter');
			this.$el.html(_.template($("#all-tpl").html()));
			this.people = new PeopleList;
			this.people.bind('add', this.addOne);
			this.people.bind('reset', this.addAll);
			this.people.bind('all', this.render);
			this.people.fetch();
		  },
		addOne: function(people) {
		    var view = new SingleView({
		        model: people
		    });    
		var something =view.render().el;
		this.$("#impress").append(something.innerHTML);

		},
		addSome: function() {
		var self = this;
		this.$("#impresst").html("");
		this.people.chain().each(function(item) {
		self.addOne(item)
		});
		},

		// Add all items in the Todos collection at once.
		addAll: function(collection) {
		    this.$("#impress").html("");
		    this.people.each(this.addOne);
		},
		createOnEnter: function() {
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
	// The main view for the app
	var AppView = AV.View.extend({
	// Instead of generating a new element, bind to the existing skeleton of
	// the App already present in the HTML.
		el: $("#main"),

		initialize: function() {
			this.render();
		},

		render: function() {
			new AllView();
		}
	});


	new AppView;
	
});


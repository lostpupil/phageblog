$(function() {
	AV.$ = jQuery;
	AV.initialize( "liy4558tscjsqv4g5ig92196hmo4sjywaxdvjmft2wwni0gm",
		            "2116ukuphlf1ph384xk4badifaemkgovjih47gtgb5972ac1");
 // Todo Model
  // ----------

  // Our basic Todo model has `content`, `order`, and `done` attributes.
  var Todo = AV.Object.extend("Todo", {
    // Default attributes for the todo.
    defaults: {
    	name:"jack frost",
    	mobile:"",
    	email:"",
    	wechat:"",
     	 done: false
    },

    // Ensure that each todo created has `content`.
    initialize: function() {
      if (!this.get("name")) {
        this.set({"name": this.defaults.name});
      }
    },

    // Toggle the `done` state of this todo item.
    toggle: function() {
      this.save({done: !this.get("done")});
    }
  });

  // This is the transient application state, not persisted on AV
  var AppState = AV.Object.extend("AppState", {
    defaults: {

    }
  });

  // Todo Collection
  // ---------------

  var TodoList = AV.Collection.extend({

    // Reference to this collection's model.
    model: Todo,

    // Filter down the list of all todo items that are finished.
    done: function() {
      return this.filter(function(todo){ return todo.get('done'); });
    },

    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
      return this.without.apply(this, this.done());
    },

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

    // Todos are sorted by their original insertion order.
    comparator: function(todo) {
      return todo.get('order');
    }

  });

  var SingleView = AV.View.extend({
            template: _.template($('#single-tpl').html()),
            // The DOM events specific to an item.


            initialize: function() {
        _.bindAll(this, 'render');

            },

            // Re-render the contents of the todo item.
            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
            },

        });
    var AllView = AV.View.extend({
         el: ".content",
          initialize: function() {
             var self = this;
             console.log(self);
             _.bindAll(this, 'addOne', 'addAll');
             this.people = new TodoList;
             this.people.query = new AV.Query(Todo);
             this.people.query.notEqualTo("done",true);
            this.people.bind('add', this.addOne);
            this.people.bind('reset', this.addAll);
             this.people.fetch();
             this.render();
          },
        addOne: function(todo) {
            var view = new SingleView({
                model:todo
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

  // Todo Item View
  // --------------

  // The DOM element for a todo item...
  var TodoView = AV.View.extend({


    tagName:  "div",   // I know it's the default...
   className : 'pure-u-1 pure-u-md-1-2 pure-u-lg-1-3',

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "click .todo-destroy"   : "clear",
      "click .upd": "updateOnEnter", 
      "blur .edit"          : "close"
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a Todo and a TodoView in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      _.bindAll(this, 'render', 'close', 'remove');
      this.model.bind('change', this.render);
      this.model.bind('destroy', this.remove);
    },

    // Re-render the contents of the todo item.
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
          this.name=this.$("input[name='name']");
          this.mobile=this.$("input[name='mobile']");
          this.wechat=this.$("input[name='wechat']");
          this.email=this.$("input[name='email']");
      return this;
    },


    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      this.model.save({
      	name:this.name.val(),
      	mobile:this.mobile.val(),
      	wechat:this.wechat.val(),
      	email:this.email.val(),
      });

    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
	this.close();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }

  });

  // The Application
  // ---------------

  // The main view that lets a user manage their todo items
  var ManageTodosView = AV.View.extend({

    // Our template for the line of statistics at the bottom of the app.


    // Delegated events for creating new items, and clearing completed ones.
    events: {
     "click #save": "createOnEnter",
                 "click .log-out": "logOut",
    },

    el: ".content",

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved to AV.
    initialize: function() {
      var self = this;

      _.bindAll(this, 'addOne', 'addAll', 'addSome', 'render',  'createOnEnter','logOut');

      // Main todo management template
      this.$el.html(_.template($("#manage-todos-template").html()));
      
      this.input = this.$("#new-todo");
      this.allCheckbox = this.$("#toggle-all")[0];

      // Create our collection of Todos
      this.todos = new TodoList;

      // Setup the query for the collection to look for todos from the current user
      this.todos.query = new AV.Query(Todo);
      this.todos.query.equalTo("user", AV.User.current());
        
      this.todos.bind('add',     this.addOne);
      this.todos.bind('reset',   this.addAll);
      this.todos.bind('all',     this.render);

      // Fetch all the todo items for this user
      this.todos.fetch();
      
    },

    // Logs out the user and shows the login view
    logOut: function(e) {
      AV.User.logOut();
      new LogInView();
      this.undelegateEvents();
      delete this;
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      this.delegateEvents();
    },


    // Resets the filters to display all todos
    resetFilters: function() {
      this.$("ul#filters a").removeClass("selected");
      this.$("ul#filters a#all").addClass("selected");
      this.addAll();
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
    },

    // Add all items in the Todos collection at once.
    addAll: function(collection, filter) {
      this.$("#todo-list").html("");
      this.todos.each(this.addOne);
    },

    // Only adds some todos, based on a filtering function that is passed in
    addSome: function(filter) {
      var self = this;
      this.$("#todo-list").html("");
      this.todos.chain().filter(filter).each(function(item) { self.addOne(item) });
    },

    // If you hit return in the main input field, create new Todo model
    createOnEnter: function(e) {
      var self = this;


      this.todos.create({
       name: this.input.val(),
        order:   this.todos.nextOrder(),
        done:    false,
        user:    AV.User.current(),
        ACL:     new AV.ACL(AV.User.current())
      });

      this.input.val('');

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
  var LogInView = AV.View.extend({
    events: {
      "submit form.login-form": "logIn",
      "submit form.signup-form": "signUp"
    },

    el: ".content",
    
    initialize: function() {
      _.bindAll(this, "logIn", "signUp");
      this.render();
    },

    logIn: function(e) {
      var self = this;
      var username = this.$("#login-username").val();
      var password = this.$("#login-password").val();
      
      AV.User.logIn(username, password, {
        success: function(user) {
          new ManageTodosView();
          self.undelegateEvents();
          delete self;
        },

        error: function(user, error) {
          self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
          this.$(".login-form button").removeAttr("disabled");
        }
      });

      this.$(".login-form button").attr("disabled", "disabled");

      return false;
    },

    signUp: function(e) {
      var self = this;
      var username = this.$("#signup-username").val();
      var password = this.$("#signup-password").val();
      
      AV.User.signUp(username, password, {
        success: function(user) {
          new ManageTodosView();
          self.undelegateEvents();
          delete self;
        },

        error: function(user, error) {
          self.$(".signup-form .error").html(error.message).show();
          this.$(".signup-form button").removeAttr("disabled");
        }
      });

      this.$(".signup-form button").attr("disabled", "disabled");

      return false;
    },

    render: function() {
      this.$el.html(_.template($("#login-template").html()));
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
      if (AV.User.current()) {
        new ManageTodosView();
      } else {
        new LogInView();
      }
    }
  });

  var AppRouter = AV.Router.extend({
    routes: {
      "all": "all",
      "active": "active",
      "completed": "completed",
      "home":"home"
    },

    initialize: function(options) {
    },
    home:function(){
      new HomeView();
    },

    all: function() {
      new AllView();
    },

    completed: function() {
      state.set({ filter: "completed" });
    }
  });

  var state = new AppState;

  new AppRouter;
  new AppView;
  AV.history.start();
	
});


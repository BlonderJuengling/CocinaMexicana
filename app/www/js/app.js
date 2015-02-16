var app = {
    // global variables
    currentUser: new User(),
    navHandler: new NavigationHandler(),
    loginHandler: new LoginHandler(),
    userpanel: new Userpanel(),
    // Application Constructor
    initialize: function() {
        $("[data-role=header],[data-role=footer]").toolbar().enhanceWithin();
        $("[data-role=panel]").panel().enhanceWithin();
        $('#registerPopupSuccess').popup(); // init popup to get expected behavior
        $('#errorPopup').popup();

        this.initMainPageSlider();
        this.displayMainQuizHint();
        this.bindEvents();
        this.navHandler.refresh();
    },
    // Bind Event Listeners
    initMainPageSlider: function () {
        $('#main-page-slider').pgwSlider({
            displayControls: true,
            selectionMode: 'mouseOver',
            autoSlide: false,
            adaptiveHeight: false,
            displayControls: true
        });
    },
    displayMainQuizHint: function () {
        if(app.currentUser.isLoggedIn() && !app.currentUser.isClassQuizDone()) {
            $('#home .hint-quiz').show();
        }
    },
    bindEvents: function() {
        $('#login-submit-btn').on('click', function (event) {
            event.preventDefault();

            app.loginHandler.login();
        });

        $('#register-submit-btn').on('click', function (event) {
            event.preventDefault();
            var regHandler = new RegistrationHandler();

            regHandler.register();
        });

        $('#userpanel').on('pagebeforeshow', function () {
            app.userpanel.setUser(app.currentUser);
            app.userpanel.open();
        });

        $('#classQuiz').on('pagebeforeshow', function () {
            var quiz = new Quiz('quiz_classification.json', app.currentUser);
            quiz.load(function(event) {
                quiz.show();
            });
        });

        $('#recipeDetail').on('pagebeforeshow', function () {
            var self = this,
                recipeId = app.getUrlParameterByName('id'),
                recipeController = new RecipeController(recipeId);

            recipeController.init(function (event) {
                recipeController.parse();
            });
        });

        $('#errorPopup .ui-content a').on('click', function () {
            $('#errorPopup').popup('close');
        });

        if(navigator.userAgent.match(/(iPhone|iPad|iPod|Android|Blackberry)/)) {
            console.log('Running on mobile device');
            document.addEventListener('deviceready', this.onDeviceReady, false);
        }
        else {
            console.log('Running on desktop browser');
            app.onDeviceReady();
        }
    },
    getUrlParameterByName: function (name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec($.mobile.path.get())||[,null])[1]
        );
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();


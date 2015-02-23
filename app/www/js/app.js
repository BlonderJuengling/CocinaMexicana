var app = {
    // global variables
    currentUser: new User(),
    navHandler: new NavigationHandler(),
    loginHandler: new LoginHandler(),
    userpanel: new Userpanel(),
    passDataObject: { selectedRecipeId : null, selectedKnowledgeId : null },
    // Application Constructor
    initialize: function() {
        $("[data-role=header],[data-role=footer]").toolbar().enhanceWithin();
        $("[data-role=panel]").panel().enhanceWithin();
        $('#registerPopupSuccess').popup(); // init popup to get expected behavior
        $('#errorPopup').popup();
        $('#feedbackPopup').popup().enhanceWithin();
        $('#detailPopup').popup().enhanceWithin();

        this.displayMainQuizHint();
        this.initMainPageSlider();
        this.bindEvents();
        this.navHandler.refresh();
    },
    // Bind Event Listeners
    initMainPageSlider: function () {
        $('.pgwSlider').pgwSlider({
            displayControls: true,
            selectionMode: 'mouseOver',
            autoSlide: false,
            adaptiveHeight: false,
            displayControls: false
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

        $('#info').on('pagecreate', function (event) {
            event.preventDefault();
            $('#info > .content-wrapper').load('content/info.html');
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

        $('#recipeDatabase').find('a').unbind('click').click(function (event, data) {
            event.preventDefault();
            app.passDataObject.selectedRecipeId = this.id;
            $.mobile.changePage('#recipeDetail');
        });

        $('#recipeDetail').on('pagebeforeshow', function (event, data) {
            var self = this,
            recipeId = app.passDataObject.selectedRecipeId;
                recipeController = new RecipeController(recipeId, app.currentUser);

            recipeController.init(function (event) {
                recipeController.parse();
            });
        });

		$('#knowledgeDatabase').find('a').click(function (event, data) {
            event.preventDefault();

            new KnowledgeHandler($('.knowledge-body'), this.id);
        });

        $('#knowledgeDatabase').on('pagebeforeshow', function (event) {
            if(app.passDataObject.selectedKnowledgeId !== null) {
                new KnowledgeHandler($('.knowledge-body'), app.passDataObject.selectedKnowledgeId);
                app.passDataObject.selectedKnowledgeId = null;
            }
        });

		$("#recipeByIngredient").on('pagebeforecreate',function(event,data){
            $("#recipeByIngredient").load('content/recipe-by-ingredients.html');
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


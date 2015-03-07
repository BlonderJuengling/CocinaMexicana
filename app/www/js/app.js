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
        $('#animationPopup').popup().enhanceWithin();

        this.displayMainQuizHint();
        this.initMainPageSlider();
        this.bindEvents();
        this.navHandler.refresh();

        this.navHandler.observePageShowEvent();
        this.navHandler.setNavpanelOnClickListener();
    },
    // Bind Event Listeners
    initMainPageSlider: function () {
        $('.main-page-slider-wrapper').load('content/slider_main.html', function () {
            $('.pgwSliderMain').pgwSlider({
                selectionMode: 'mouseOver',
                autoSlide: false,
                adaptiveHeight: false,
                displayControls: false
            });
        });
    },
    initInfoPageSlider: function () {
        $('.pgwSliderInfo').pgwSlider({
            autoSlide: true,
            adaptiveHeight: false,
            displayControls: true,
            displayList: false,
            transitionDuration: 1000,
            intervalDuration: 8000
        });
    },
    displayMainQuizHint: function () {
        if(app.currentUser.isLoggedIn() && !app.currentUser.isClassQuizDone()) {
            $('#home .hint-quiz').show();
        }
    },
    bindEvents: function() {
        $('#home').on('pagebeforeshow', function () {
            // workaround for broken slider-layout happens from time to time
            if($('#home').find('.pgwSlider.narrow').length > 0) {
                $('.pgwSliderMain').pgwSlider().destroy();
                app.initMainPageSlider();
            }
        });

        $('.swipe-container').on('swiperight', function (event) {
            if(event.swipestart.coords[0] < 100){
                console.log('swipe-right event received');
                $('#navpanel').panel('open');
            }
        });
        $('#login-submit-btn').on('click', function (event) {
            event.preventDefault();

            app.loginHandler.login();
        });

        $('#register-submit-btn').on('click', function (event) {
            event.preventDefault();
            var regHandler = new RegistrationHandler();

            regHandler.register();
        });

        $('#impressum').on('pagecreate', function (event) {
            event.preventDefault();
            $('#impressum').find('#image-sources').load('content/image-sources.html', function () {
                $('#toggle-sources-btn').on('click', function (event) {
                    event.preventDefault();
                    var sourcesDiv = $('#image-sources');

                    if(sourcesDiv.hasClass('sources-hidden'))
                        sourcesDiv.removeClass().addClass('sources-visible');
                    else
                        sourcesDiv.removeClass().addClass('sources-hidden');
                });
            });
        });

        $('#info').on('pagecreate', function (event) {
            event.preventDefault();
            $('#info > .content-wrapper').load('content/info.html', function () {
                app.initInfoPageSlider();
            });
        });

        $('#info').on('pagebeforeshow', function () {
            // workaround for broken slider-layout happens from time to time
            if($('#info').find('.pgwSlider.narrow').length > 0) {
                $('.pgwSliderInfo').pgwSlider().destroy();
                app.initInfoPageSlider();
            }
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
            $("#recipeByIngredient").load('content/recipe-by-ingredients.html', function () {
                $(this).enhanceWithin();
            });
        });

        $('#errorPopup .ui-content a').on('click', function () {
            $('#errorPopup').popup('close');
        });

        $('#navpanel').find('#quiz-moodle:first').on('click', function (event) {
            event.preventDefault();
            window.open('https://wuecampus2.uni-wuerzburg.de/moodle/course/view.php?id=11275', '_system');
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


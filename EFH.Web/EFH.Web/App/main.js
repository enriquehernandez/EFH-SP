require.config({
    paths: { "text": "durandal/amd/text" }
});

//define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'durandal/plugins/router', 'services/logger'],
//    function (app, viewLocator, system, router, logger) {

define(function (require) {
    var system = require('durandal/system'),
        app = require('durandal/app'),
        router = require('durandal/plugins/router'),
        viewLocator = require('durandal/viewLocator'),
        logger = require('services/logger');

    // Enable debug message to show in the console 
    system.debug(true);

    //app.start().then(function () {
    //    toastr.options.positionClass = 'toast-bottom-right';
    //    toastr.options.backgroundpositionClass = 'toast-bottom-right';

    //    router.handleInvalidRoute = function (route, params) {
    //        logger.logError('No Route Found', route, 'main', true);
    //    };

    //    // When finding a viewmodel module, replace the viewmodel string 
    //    // with view to find it partner view.
    //    router.useConvention();
    //    viewLocator.useConvention();
        
    //    // Adapt to touch devices
    //    app.adaptToDevice();
    //    //Show the app by setting the root view model for our application.
    //    app.setRoot('viewmodels/shell', 'entrance');
    //});

    app.start().then(function () {
        // route will use conventions for modules
        // assuming viewmodels/views folder structure
        router.useConvention();

        // When finding a module, replace the viewmodel string 
        // with view to find it partner view.
        // [viewmodel]s/sessions --> [view]s/sessions.html
        // Otherwise you can pass paths for modules, views, partials
        // Defaults to viewmodels/views/views. 
        viewLocator.useConvention();

        app.setRoot('viewmodels/shell', 'entrance');

        // override bad route behavior to write to 
        // console log and show error toast
        router.handleInvalidRoute = function (route, params) {
            logger.logError('No route found', route, 'main', true);
        };
    });
});
//define(['durandal/system', 'durandal/plugins/router', 'services/logger'],
    //function (system, router, logger) {
//define(['durandal/system', 'services/logger', 'durandal/plugins/router',
//    'durandal/app', 'config', 'services/datacontext'],
//    function (system, logger, router, app, config, datacontext) {
define(['durandal/system', 'services/logger', 'durandal/plugins/router',
    'durandal/app', 'config', 'services/datacontextGenerico'],
    function (system, logger, router, app, config, datacontextGenerico) {

        var usuarioConectado = ko.observable();
        var nameUsuarioConectado = ko.observable();
        var idEmpresa = ko.observable();
        var empresa = ko.observable();
        var varSelectTiposGrupos = ko.observableArray();

        var adminRoutes = ko.computed(function () {
            return router.allRoutes().filter(function (r) {
                return r.settings.admin;
            });
        });

        var mantenedorRoutes = ko.computed(function () {
            return router.allRoutes().filter(function (r) {
                return r.settings.mantenedor;
            });
        });

        var shell = {
            //activate: activate,
            //router: router
            activate: activate,
            addSession: addSession,
            //adminRoutes: adminRoutes,
            mantenedorRoutes: mantenedorRoutes,
            router: router,
            nameUsuarioConectado: nameUsuarioConectado,
            idEmpresa: idEmpresa,
            empresa: empresa,
            varSelectTiposGrupos: varSelectTiposGrupos
        };
        
        return shell;

        //#region Internal Methods
        function activate() {
            app.title = config.appTitle;

            return datacontextGenerico.getUsuarioConectado()
            .then(boot1)
            .fail(failedInitialization);

            //return boot();
        }

        function boot1() {
            usuarioConectado(datacontextGenerico.genericoViewModel.usuarioConectado);
            nameUsuarioConectado(datacontextGenerico.genericoViewModel.nameUsuarioConectado);
            //router.map(config.routes);
            //return router.activate(config.startModule);
            return datacontextGenerico.getEmpresa()
            .then(boot2)
            .fail(failedInitialization);
        }

        function boot2() {
            empresa(datacontextGenerico.genericoViewModel.empresa);
            idEmpresa(datacontextGenerico.genericoViewModel.idEmpresa);

            return datacontextGenerico.getTipoGrupo()
            .then(boot3)
            .fail(failedInitialization);
        }

        function boot3() {
            var unwrapped = ko.toJS(datacontextGenerico.genericoViewModel.tipoGrupo()).map(
            function (entity) {
                delete entity.entityAspect;
                return entity;
            });
            varSelectTiposGrupos(unwrapped);

            router.map(config.routes);
            return router.activate(config.startModule);
        }

        //function log(msg, data, showToast) {
        //    logger.log(msg, data, system.getModuleId(shell), showToast);
        //}

        function addSession(item) {
            router.navigateTo(item.hash);
        }
        function failedInitialization(error) {
            var msg = 'App initialization failed: ' + error.message;
            logger.logError(msg, error, system.getModuleId(shell), true);
        }

        //#endregion
    });

ko.bindingHandlers.navegadorInterno = {
    init: function (element, valueAccessor) {
        $(element.children.navegadorInternoLogin).append($('#loginHidden').html());
    },
    update: function (element, valueAccessor, allBindingAccessor, viewModel) {
    }
}

function waitingFormatter(value) {
    return "...";
}

function requiredFieldValidator(value) {
    if (value == null || value == undefined || !value.length) {
        return { valid: false, msg: "Campo requerido" };
    } else {
        return { valid: true, msg: null };
    }
}

function renderTipoGrupo(cellNode, row, dataContext, colDef) {
    //$(cellNode).empty().html('<div class="control-group info"><label class="control-label del" id="' + dataContext.id + '">Eliminar</label></div>');
    $(cellNode).text($('#varSelectTipoGrupo option[value=' + dataContext.id_tipo_grupo + ']').text());
}

function getClaseError(validarCampos, isValid, claseOK, claseError) {
    if (claseOK == null)
        claseOK = 'control-group';
    if (claseError == null)
        claseError = 'control-group error';
    if (validarCampos)
        if (!isValid)
            return claseError;

    return claseOK;
}
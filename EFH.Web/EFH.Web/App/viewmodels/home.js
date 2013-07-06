define(['services/logger', 'services/datacontextGenerico'], function (logger, datacontextGenerico) {
    var usuarioConectado = ko.observable();
    var nameUsuarioConectado = '';

    var vm = {
        activate: activate,
        title: 'Home View',
        usuarioConectado: usuarioConectado,
        nameUsuarioConectado: nameUsuarioConectado
    };

    return vm;

    //#region Internal Methods
    function activate() {
        //logger.log('Home View Activated', null, 'home', true);
        return true;
        //return datacontextGenerico.getUsuarioConectado()
        //    .then(boot)
        //    .fail(failedInitialization);
    }

    function boot() {
        usuarioConectado(datacontextGenerico.genericoViewModel.usuarioConectado);
        nameUsuarioConectado = datacontextGenerico.genericoViewModel.nameUsuarioConectado;
    }
    //#endregion
});
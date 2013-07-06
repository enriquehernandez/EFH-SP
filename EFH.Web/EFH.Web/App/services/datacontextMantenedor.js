define([
    'durandal/system',
    'config',
    'services/logger',
    'services/breeze.partial-entities'],
    function (system, config, logger, partialMapper) {

        var mantenedorViewModel = {
            usuarios: ko.observableArray(),
            clientes: ko.observableArray(),
            grupos: ko.observableArray(),
            fases: ko.observableArray(),
            roles: ko.observableArray(),
            errorMessage: ko.observable("")//,
        };

        var manager = configureBreezeManager();
        var EntityQuery = breeze.EntityQuery;

        //#region Usuarios
        function GetUsuarios() {

            var query = EntityQuery.from('GetUsuarios');
            return manager.executeQuery(query)
                .then(querySucceededUsuarios)
                .fail(queryFailed);
        }

        function querySucceededUsuarios(data) {
            var count = data.results.length;
            if (!count) {
                log("Sin Datos"); return;
            }
            mantenedorViewModel.usuarios(data);
        }
        //#endregion Usuarios

        //#region Clientes
        function GetClientes() {

            var query = EntityQuery.from('GetClientes');
            return manager.executeQuery(query)
                .then(querySucceededClientes)
                .fail(queryFailed);
        }

        function querySucceededClientes(data) {
            var count = data.results.length;
            if (!count) {
                log("Sin Datos"); return;
            }
            mantenedorViewModel.clientes(data);
        }
        //#endregion Clientes

        //#region Grupos
        function GetGrupos() {

            var query = EntityQuery.from('GetGrupos');
            return manager.executeQuery(query)
                .then(querySucceededGrupos)
                .fail(queryFailed);
        }

        function querySucceededGrupos(data) {
            var count = data.results.length;
            if (!count) {
                log("Sin Datos"); return;
            }
            mantenedorViewModel.grupos(data);
        }
        //#endregion Grupos

        //#region Fases
        function GetFases() {

            var query = EntityQuery.from('GetFases');
            return manager.executeQuery(query)
                .then(querySucceededFases)
                .fail(queryFailed);
        }

        function querySucceededFases(data) {
            var count = data.results.length;
            if (!count) {
                log("Sin Datos"); return;
            }
            mantenedorViewModel.fases(data);
        }
        //#endregion Fases

        //#region Roles
        function GetRoles() {
            
            var query = EntityQuery.from('GetRoles');
            return manager.executeQuery(query)
                .then(querySucceededRoles)
                .fail(queryFailed);
        }

        function querySucceededRoles(data) {
            var count = data.results.length;
            if (!count) {
                log("Sin Datos"); return;
            }
            mantenedorViewModel.roles(data);
        }
        //#endregion Roles

        function queryFailed(error) { mantenedorViewModel.errorMessage(error); }

        function log(text) {
            console.log(text);
        }

        var datacontextMantenedor = {
            GetUsuarios: GetUsuarios,
            GetClientes: GetClientes,
            GetGrupos: GetGrupos,
            GetFases: GetFases,
            GetRoles: GetRoles,
            mantenedorViewModel: mantenedorViewModel
        };
        return datacontextMantenedor;

        function configureBreezeManager() {
            var mgr = new breeze.EntityManager(config.serviciosRemotos.remoteServiceNameMantenedor);
            return mgr;
        }
});
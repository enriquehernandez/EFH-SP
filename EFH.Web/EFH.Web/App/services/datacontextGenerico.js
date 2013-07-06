define([
    'durandal/system',
    'config',
    'services/logger',
    'services/breeze.partial-entities'],
    function (system, config, logger, partialMapper) {

        // ViewModel
        var genericoViewModel = {
            items: ko.observableArray(),
            usuarioConectado: ko.observable(),
            nameUsuarioConectado: '',
            errorMessage: ko.observable(""),
            idEmpresa: 0,
            tipoGrupo: ko.observableArray(),
            responsablesProyecto: ko.observableArray(),
            responsablesCliente: ko.observableArray(),
            empresa: ko.observable()
            //reset: reset
        };

        var manager = configureBreezeManager(); //new breeze.EntityManager(serviceName);
        var EntityQuery = breeze.EntityQuery;

        /***  supporting functions ***/
        
        //#region Usuarios
        function getUsuarioConectado() {
            var query = EntityQuery.from('UsuarioConectado');
            log("Obtener UsuarioConectado");
            return manager.executeQuery(query)
                .then(querySucceededUsuarioConectado)
                .fail(queryFailed);
        }

        function querySucceededUsuarioConectado(data) {
            var count = data.results.length;
            //log("Retrieved " + count);
            if (!count) {
                log("Sin Datos"); return;
            }
            genericoViewModel.usuarioConectado(data.results[0]);
            genericoViewModel.nameUsuarioConectado = genericoViewModel.usuarioConectado().nombre_usuario() + " " + genericoViewModel.usuarioConectado().ap_paterno_usuario();
            //ko.applyBindings(datacontextGenerico.genericoViewModel, window.document.getElementById('navInterno'));
        }
        //#endregion Usuarios

        //#region Empresa
        function getEmpresa() {
            var query = EntityQuery.from('EmpresaActual').where("inactivo", "==", false);
            log("Obtener EmpresaActual");
            return manager.executeQuery(query)
                .then(querySucceededEmp)
                .fail(queryFailed);
        }

        function querySucceededEmp(data) {
            var count = data.results.length;
            if (!count) {
                log("Sin Datos"); return;
            }
            genericoViewModel.empresa(data.results[0]);
            genericoViewModel.idEmpresa = genericoViewModel.empresa().id_empresa();
        }
        //#endregion Empresa

        //#region Tipo Grupo
        function getTipoGrupo() {
            var query = EntityQuery.from('GetTiposGrupos');
            //log("Obtener EmpresaActual");
            return manager.executeQuery(query)
                .then(querySucceededTipoGrupo)
                .fail(queryFailed);
        }

        function querySucceededTipoGrupo(data) {
            var count = data.results.length;
            if (!count) {
                log("Sin Datos"); return;
            }
            genericoViewModel.tipoGrupo(data.results);
        }
        //#endregion Tipo Grupo

        //#region Responsables Proyecto
        function getResponsablesProyecto() {
            var query = EntityQuery.from('GetResponsablesProyecto');
            //log("Obtener EmpresaActual");
            return manager.executeQuery(query)
                .then(querySucceededResponsablesProyecto)
                .fail(queryFailed);
        }

        function querySucceededResponsablesProyecto(data) {
            var count = data.results.length;
            if (!count) {
                log("Sin Datos"); return;
            }
            genericoViewModel.responsablesProyecto(data.results);
        }
        //#endregion Responsables Proyecto

        //#region Responsables Cliente
        function getResponsablesCliente() {
            var query = EntityQuery.from('GetResponsablesCliente');
            //log("Obtener EmpresaActual");
            return manager.executeQuery(query)
                .then(querySucceededResponsablesCliente)
                .fail(queryFailed);
        }

        function querySucceededResponsablesCliente(data) {
            var count = data.results.length;
            if (!count) {
                log("Sin Datos"); return;
            }
            genericoViewModel.responsablesCliente(data.results);
        }
        //#endregion Responsables Cliente

        function queryFailed(error) {
            log(error);
            genericoViewModel.errorMessage(error);
        }

        function log(text) {
            console.log(text);
            //document.getElementById('log').innerHTML += '<li>' + text + '</li>';
        }

        var datacontextGenerico = {
            getUsuarioConectado: getUsuarioConectado,
            getEmpresa: getEmpresa,
            getTipoGrupo: getTipoGrupo,
            getResponsablesProyecto: getResponsablesProyecto,
            getResponsablesCliente: getResponsablesCliente,
            genericoViewModel: genericoViewModel
        };
        return datacontextGenerico;

        function configureBreezeManager() {
            var mgr = new breeze.EntityManager(config.serviciosRemotos.remoteServiceNameGenerico);
            //model.configureMetadataStore(mgr.metadataStore);
            return mgr;
        }
});
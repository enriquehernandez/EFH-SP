define([
    'durandal/system',
    'config',
    'services/logger',
    'services/breeze.partial-entities'],
    function (system, config, logger, partialMapper) {

        // ViewModel
        var proyectoViewModel = {
            estadosKanbanProyecto: ko.observableArray(),
            estadosKanbanTarea: ko.observableArray(),
            historias: ko.observableArray(),
            errorMessage: ko.observable("")
            //reset: reset
        };

        var manager = configureBreezeManager(); //new breeze.EntityManager(serviceName);
        var EntityQuery = breeze.EntityQuery;

        /***  supporting functions ***/
        
        //#region Estados Kanban Proyecto
        function getEstadosKanbanProyecto() {
            var query = EntityQuery.from('GetKanbanProyectoTO');
            //log("Obtener GetEstadosKanbanProyecto");
            return manager.executeQuery(query)
                .then(querySucceededGetEstadosKanbanProyecto)
                .fail(queryFailed);
        }

        function querySucceededGetEstadosKanbanProyecto(data) {
            var count = data.results.length;
            //if (!count) {
            //    log("Sin Datos"); return;
            //}
            proyectoViewModel.estadosKanbanProyecto(data);
        }
        //#endregion Estados Kanban Proyecto

        //#region Estados Kanban Proyecto
        function getEstadosKanbanProyectoFiltro(filtro) {
            if (filtro == null)
                filtro = '';
            var query = EntityQuery.from('GetKanbanProyectoTO')
                .withParameters({ Filtro: filtro })
            //log("Obtener GetEstadosKanbanProyecto");
            //console.log(filtro);
            return manager.executeQuery(query)
                .then(querySucceededGetEstadosKanbanProyectoFiltro)
                .fail(queryFailed);
        }

        function querySucceededGetEstadosKanbanProyectoFiltro(data) {
            var count = data.results.length;
            //if (!count) {
            //    log("Sin Datos"); return;
            //}
            proyectoViewModel.estadosKanbanProyecto(data);
        }
        //#endregion Estados Kanban Proyecto

        //#region Historias
        function getHistorias(idProyecto) {
            //proyectoViewModel.historias.removeAll();
            var query = EntityQuery.from('GetHistoriasTO')
                .withParameters({ idProyecto: idProyecto })

            return manager.executeQuery(query)
                .then(querySucceededGetHistorias)
                .fail(queryFailed);
        }

        function querySucceededGetHistorias(data) {
            var count = data.results.length;
            //if (!count) {
            //    log("Sin Datos"); return;
            //}
            proyectoViewModel.historias(data);
        }
        //#endregion Historias

        //#region Estados Kanban Tarea
        function getEstadosKanbanTareaFiltro(filtro) {
            //if (filtro == null)
            //    filtro = '';
            var query = EntityQuery.from('GetKanbanTareaTO')
                .withParameters(filtro)
            //log("Obtener GetEstadosKanbanProyecto");
            //console.log(filtro);
            return manager.executeQuery(query)
                .then(querySucceededGetEstadosKanbanTareaFiltro)
                .fail(queryFailed);
        }

        function querySucceededGetEstadosKanbanTareaFiltro(data) {
            var count = data.results.length;
            //if (!count) {
            //    log("Sin Datos"); return;
            //}
            proyectoViewModel.estadosKanbanTarea(data);
        }
        //#endregion Estados Kanban Tarea

        function queryFailed(error) {
            log(error);
            proyectoViewModel.errorMessage(error);
        }

        function log(text) {
            console.log(text);
            //document.getElementById('log').innerHTML += '<li>' + text + '</li>';
        }

        var datacontextProyecto = {
            getEstadosKanbanProyecto: getEstadosKanbanProyecto,
            getEstadosKanbanProyectoFiltro: getEstadosKanbanProyectoFiltro,
            getHistorias: getHistorias,
            getEstadosKanbanTareaFiltro: getEstadosKanbanTareaFiltro,
            proyectoViewModel: proyectoViewModel
        };
        return datacontextProyecto;

        function configureBreezeManager() {
            var mgr = new breeze.EntityManager(config.serviciosRemotos.remoteServiceNameProyecto);
            //model.configureMetadataStore(mgr.metadataStore);
            return mgr;
        }
});
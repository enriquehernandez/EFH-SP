var vmProyectos;
define(['services/logger', 'services/datacontextProyectos', 'services/datacontextGenerico', 'services/datacontextMantenedor'], function (logger, datacontextProyectos, datacontextGenerico, datacontextMantenedor) {

    ko.validation.rules.pattern.message = 'Campo Inválido';


    ko.validation.configure({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: false,
        parseInputAttributes: true,
        messageTemplate: null
    });

    var estadosKanbanProyecto = ko.observableArray();
    var title = ko.observable();
    var varSelectResponsablesProyecto = ko.observableArray();
    var varSelectResponsablesCliente = ko.observableArray();
    var varSelectCliente = ko.observableArray();
    var varSearch = ko.observable('');

    //#region Formulario
    var nombreProyecto = ko.observable().extend({ required: true });
    var descProyecto = ko.observable().extend({ required: true });
    var fecIniEstimado = ko.observable().extend({ required: true, date: true });
    var valueResponsablesProyecto = ko.observable().extend({ required: true });
    var valueResponsablesCliente = ko.observable().extend({ required: true });
    var valueCliente = ko.observable().extend({ required: true });
    var horasEstimadas = ko.observable(0).extend({ required: true, min: 0, digit: true });

    var objFormulario = {
        nombreProyecto: nombreProyecto,
        descProyecto: descProyecto,
        fecIniEstimado: fecIniEstimado,
        valueResponsablesProyecto: valueResponsablesProyecto,
        valueResponsablesCliente: valueResponsablesCliente,
        valueCliente: valueCliente,
        horasEstimadas: horasEstimadas,
        validarCampos: ko.observable(false),
        esNuevoProyecto: ko.observable(true),
        idProyecto: ko.observable(0),
        idEstadoKanbanProyecto: ko.observable(0),
        submit: function () {
            objFormulario.validarCampos(true);
            if (objFormulario.errors().length == 0) {
                //alert('Es Nuevo: ' + objFormulario.esNuevoProyecto());
                var datoItem = {
                    //id_proyecto: objFormulario.idProyecto(), //No se tomará en cuenta cuando se modifique
                    id_empresa: $('#idEmpresa').val(), //No se tomará en cuenta cuando se modifique
                    nombre_proyecto: objFormulario.nombreProyecto(),
                    fecha_inicio_estimado: objFormulario.fecIniEstimado(),
                    id_responsable_proyecto: objFormulario.valueResponsablesProyecto(),
                    id_responsable_proyecto_cliente: objFormulario.valueResponsablesCliente(),
                    id_estado_proyecto_kanban: objFormulario.idEstadoKanbanProyecto(), //No se tomará en cuenta cuando se modifique
                    descripcion_proyecto: objFormulario.descProyecto(),
                    id_cliente: objFormulario.valueCliente(), //No se tomará en cuenta cuando se modifique
                    horas_estimadas: objFormulario.horasEstimadas(),
                };

                //console.log(datoItem);
                var json = JSON.stringify(datoItem);

                if (objFormulario.esNuevoProyecto()) {
                    baseUri = urlBaseServiciosBreezeApi + "breeze/Proyecto/AddProyecto/";
                    _type = "POST";
                } else {
                    baseUri = urlBaseServiciosBreezeApi + "breeze/Proyecto/UpdateProyecto/" + objFormulario.idProyecto();
                    _type = "PUT";
                }
                $.ajax({
                    url: baseUri,
                    type: _type,
                    contentType: "application/json; charset=utf-8",
                    data: json,
                    success: function (results) {
                        var message = 'Actualización exitosa';
                        toastr.success(message);
                        $('#myModal').modal('hide');
                        return datacontextProyectos.getEstadosKanbanProyecto().then(refrescarVista)
                            .fail(failedInitialization);
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            } else {
                //alert('Please check your submission.');
                objFormulario.errors.showAllMessages();
            }
        }
    };
    //#endregion

    vmProyectos = {
        activate: activate,
        title: title, //'Proyectos View',
        estadosKanbanProyecto: estadosKanbanProyecto,
        varSelectResponsablesProyecto: varSelectResponsablesProyecto,
        varSelectResponsablesCliente: varSelectResponsablesCliente,
        varSelectCliente: varSelectCliente,
        objFormulario: objFormulario,
        varSearch: varSearch,
        search: function (data, event) {
            var filtro = vmProyectos.varSearch();
            return datacontextProyectos.getEstadosKanbanProyectoFiltro(filtro).then(refrescarVistaSearch)
                            .fail(failedInitialization);
        },
        searchEnter: function (data, event) {
            if (event.keyCode == 13) {
                vmProyectos.varSearch($('#search-query').val());
                $("#btnSearch").click();
            }
            return true;
        }
    };

    vmProyectos.estadosKanbanProyectoCallback = function (elements) {
        setKanban(elements[1]);
    }

    objFormulario.errors = ko.validation.group(objFormulario);

    return vmProyectos;

    //#region Internal Methods
    function activate(context) {
        var filterParam = context.filter;
        alert(filterParam);
        title('Proyectos');
        return datacontextProyectos.getEstadosKanbanProyecto()
            .then(boot)
            .fail(failedInitialization);
    }

    function boot() {
        return true;
    }

    function failedInitialization(error) {
        //var msg = 'App initialization failed: ' + error.message;
        //logger.logError(msg, error, system.getModuleId(shell), true);
    }
    //#endregion
});

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
        AddProyecto: AddProyecto,
        objFormulario: objFormulario,
        OpenCalendar: OpenCalendar,
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
    function activate() {
        title('Proyectos');
        return datacontextProyectos.getEstadosKanbanProyecto()
            .then(boot)
            .fail(failedInitialization);
    }

    function refrescarVistaSearch() {
        var unwrapped = ko.toJS(datacontextProyectos.proyectoViewModel.estadosKanbanProyecto().results).map(
            function (entity) {
                delete entity.entityAspect;
                return entity;
            });

        estadosKanbanProyecto(unwrapped);
    }

    function refrescarVista() {
        var unwrapped = ko.toJS(datacontextProyectos.proyectoViewModel.estadosKanbanProyecto().results).map(
            function (entity) {
                delete entity.entityAspect;
                return entity;
            });

        //countMaxRender = unwrapped.length;
        estadosKanbanProyecto(unwrapped);
    }
    function boot() {
        //console.log('inicio boot');

        var unwrapped = ko.toJS(datacontextProyectos.proyectoViewModel.estadosKanbanProyecto().results).map(
            function (entity) {
                delete entity.entityAspect;
                return entity;
            });

        //countMaxRender = unwrapped.length;
        estadosKanbanProyecto(unwrapped);
        //return true;
        return datacontextGenerico.getResponsablesProyecto()
            .then(boot2)
            .fail(failedInitialization);
    }

    function boot2() {
        var unwrapped = ko.toJS(datacontextGenerico.genericoViewModel.responsablesProyecto()).map(
        function (entity) {
            delete entity.entityAspect;
            return entity;
        });

        var _varSelectResponsablesProyecto = new Array();
        Enumerable.From(unwrapped).ForEach(function (e) {
            _varSelectResponsablesProyecto.push(new objDiccionario(e.id_usuario, e.nombre_usuario + ' ' + e.ap_paterno_usuario));
        })
        varSelectResponsablesProyecto(_varSelectResponsablesProyecto);

        return datacontextGenerico.getResponsablesCliente()
            .then(boot3)
            .fail(failedInitialization);
    }
    function boot3() {
        var unwrapped = ko.toJS(datacontextGenerico.genericoViewModel.responsablesCliente()).map(
        function (entity) {
            delete entity.entityAspect;
            return entity;
        });
        //varSelectResponsablesCliente(unwrapped);
        var _varSelectResponsablesCliente = new Array();
        Enumerable.From(unwrapped).ForEach(function (e) {
            _varSelectResponsablesCliente.push(new objDiccionario(e.id_usuario, e.nombre_usuario + ' ' + e.ap_paterno_usuario));
        })
        varSelectResponsablesCliente(_varSelectResponsablesCliente);

        return datacontextMantenedor.GetClientes()
            .then(boot4)
            .fail(failedInitialization);
    }
    function boot4() {
        var unwrapped = ko.toJS(datacontextMantenedor.mantenedorViewModel.clientes().results).map(
            function (entity) {
                delete entity.entityAspect;
                return entity;
            });
        var _varClientes = new Array();
        Enumerable.From(unwrapped).ForEach(function (e) {
            _varClientes.push(new objDiccionario(e.id_cliente, e.nombre_cliente));
        })
        varSelectCliente(_varClientes);

        return true;
    }

    function failedInitialization(error) {
        //var msg = 'App initialization failed: ' + error.message;
        //logger.logError(msg, error, system.getModuleId(shell), true);
    }

    function AddProyecto() {
        var id_estado_proyecto_kanban = Enumerable.From(vmProyectos.estadosKanbanProyecto()).Flatten()
                .Select(function (x) { return x.kanbanProyecto })
                .First().id_estado_proyecto_kanban;

        setFormulario(0, id_estado_proyecto_kanban, null, null, null, null, null, true, null, 0)
        $('#myModal').modal(varModalOption);
    }

    function OpenCalendar(event, arg) {
        if (arg.target == null || $(arg.target).attr('btnFor') == null)
            return;

        input = "#" + $(arg.target).attr('btnFor');
        $(input).datepicker('show');
    }
    //#endregion
});

function setFormulario(idProyecto, idEstadoKanbanProyecto, nombreProyecto, descProyecto, fecIniEstimado, valueResponsablesProyecto, valueResponsablesCliente, esNuevoProyecto, valueCliente, horasEstimadas) {
    try {
        vmProyectos.objFormulario.idProyecto(idProyecto);
        vmProyectos.objFormulario.idEstadoKanbanProyecto(idEstadoKanbanProyecto);

        vmProyectos.objFormulario.nombreProyecto(nombreProyecto);
        vmProyectos.objFormulario.descProyecto(descProyecto);
        //vmProyectos.objFormulario.fecIniEstimado(fecIniEstimado);
        //if (fecIniEstimado != null)
        //    $("#fecIniEstimado").datepicker("setDate", fecIniEstimado);
        //else
        //    vmProyectos.objFormulario.fecIniEstimado(fecIniEstimado);
        //$("#fecIniEstimado").datepicker("setDate", fecIniEstimado);
        //vmProyectos.objFormulario.fecIniEstimado(fecIniEstimado);
        if (fecIniEstimado != null) {
            $("#fecIniEstimado").datepicker("setDate", fecIniEstimado);
            vmProyectos.objFormulario.fecIniEstimado(fecIniEstimado);
            //    var fecha = fecIniEstimado;
            //    vmProyectos.objFormulario.fecIniEstimado(fecha);
            //    //$("#fecIniEstimado").val(fecha.toLocaleDateString());
            //    //$("#fecIniEstimado").datepicker("setDate", fecha);
        } else {
            $("#fecIniEstimado").datepicker("setDate", null);
            vmProyectos.objFormulario.fecIniEstimado(fecIniEstimado);
        }
        vmProyectos.objFormulario.valueResponsablesProyecto(valueResponsablesProyecto);
        vmProyectos.objFormulario.valueResponsablesCliente(valueResponsablesCliente);
        vmProyectos.objFormulario.validarCampos(false);
        vmProyectos.objFormulario.valueCliente(valueCliente);
        vmProyectos.objFormulario.horasEstimadas(horasEstimadas);
        vmProyectos.objFormulario.errors.showAllMessages(false);

        vmProyectos.objFormulario.esNuevoProyecto(esNuevoProyecto);
    } catch (error) {
        console.log(error.message);
    }
}

ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().datepickerOptions || {};
        console.log(options);
        //$(element).datepicker(options);
        $(element).datepicker({
            dateFormat: 'dd/mm/yy',
            changeMonth: false,
            changeYear: false,
            onSelect: function (date, inst) {
                vmProyectos.objFormulario.fecIniEstimado($(this).datepicker("getDate"));
            }
        });
    },
    update: function (element, valueAccessor) {
        //var value = ko.utils.unwrapObservable(valueAccessor());
        //var date = moment(value);
        //current = $(element).datepicker("getDate");
    }
};

function setKanban(element) {
    try {
        $(element).find('.taskboard').sortable({
            connectWith: [".wipDrop"],
            placeholder: "drop-area",
            items: 'li:not(.ui-state-disabled)',
            receive: function (event, ui) {
                //console.log(ui.item.parent());
                //console.log(ui.sender);
                //console.log('Proyecto: ' + ui.item.attr("id"));
                //console.log('Estado Kanban: ' + ui.item.parent().attr("id"));

                var datoItem = {
                    id_estado_proyecto_kanban: ui.item.parent().attr("id")
                };
                var json = JSON.stringify(datoItem);

                baseUri = urlBaseServiciosBreezeApi + "breeze/Proyecto/UpdateEstadoProyectoKanban/" + ui.item.attr("id");
                $.ajax({
                    url: baseUri,
                    type: 'PUT',
                    contentType: "application/json; charset=utf-8",
                    data: json,
                    success: function (results) {
                        var message = 'Actualización exitosa';
                        toastr.success(message);

                        return false;
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }
        });
        var expandTaskBtn = $(element).find(".expandTask");
        expandTaskBtn.parent().next().hide();
        createButton(expandTaskBtn, function (obj) {
            obj.parent().next().toggle();
            if ($(obj).find('i').hasClass('icon-chevron-right')) {
                $(obj).find('i').removeClass('icon-chevron-right').addClass('icon-chevron-down');
            } else {
                $(obj).find('i').removeClass('icon-chevron-down').addClass('icon-chevron-right');
            }
        });

        createToolTipsProyectos(element);

        $(element).find(".btnEditarProyecto").click(function () {
            var id_estado_proyecto_kanban = $(this).attr('id_estado_proyecto_kanban');
            var id_proyecto = $(this).attr('id_proyecto');

            var preproyectos = Enumerable.From(vmProyectos.estadosKanbanProyecto()).Flatten()
                .Select(function (x) { return x.proyectos })
                .ToArray();

            preproyectos = Enumerable.From(preproyectos).Flatten()
                .Where(function (x) { return x.Key == 'proyecto' })
                .Select(function (x) { return x.Value })
                .ToArray();

            var proyecto = Enumerable.From(preproyectos)
                .Where(function (x) { return x.id_proyecto == id_proyecto })
            .Single();

            setFormulario(id_proyecto, id_estado_proyecto_kanban, proyecto.nombre_proyecto, proyecto.descripcion_proyecto, proyecto.fecha_inicio_estimado, proyecto.id_responsable_proyecto, proyecto.id_responsable_proyecto_cliente, false, proyecto.id_cliente, proyecto.horas_estimadas);
            $('#myModal').modal(varModalOption);
        });

        $(element).find(".btnVerTareas").click(function () {
            var filter = $(this).attr('id_proyecto');
            var url = '#/proyectos/tareas/' + filter;
            var router = require('durandal/plugins/router');
            router.navigateTo(url);
        });
    } catch (err) {
        console.log(err.message);
    }
}


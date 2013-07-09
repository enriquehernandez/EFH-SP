var vmTareas;
define(['services/logger', 'services/datacontextProyectos', 'services/datacontextGenerico', 'services/datacontextMantenedor'], function (logger, datacontextProyectos, datacontextGenerico, datacontextMantenedor) {

    ko.validation.rules.pattern.message = 'Campo Inválido';


    ko.validation.configure({
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: false,
        parseInputAttributes: true,
        messageTemplate: null
    });

    var historias = ko.observableArray();
    var estadosKanbanTarea = ko.observableArray();
    var title = ko.observable();
    var varSelectResponsablesTarea = ko.observableArray();
    var varSelectResponsablesHistoria = ko.observableArray();
    var varSearch = ko.observable('');

    //#region Formulario Historia
    var tituloHistoria = ko.observable().extend({ required: true });
    var descHistoria = ko.observable().extend({ required: true });
    //var fecIniEstimado = ko.observable().extend({ required: true, date: true });
    var codigoHistoria = ko.observable().extend({ required: true });
    var valueResponsablesHistoria = ko.observable().extend({ required: true });
    var horasEstimadas = ko.observable(0).extend({ required: true, min: 0, digit: true });

    var objFormularioHist = {
        tituloHistoria: tituloHistoria,
        descHistoria: descHistoria,
        codigoHistoria: codigoHistoria,
        valueResponsablesHistoria: valueResponsablesHistoria,
        horasEstimadas: horasEstimadas,
        validarCampos: ko.observable(false),
        esNuevoHistoria: ko.observable(true),
        idHistoria: ko.observable(0),
        submit: function () {
            objFormularioHist.validarCampos(true);
            if (objFormularioHist.errors().length == 0) {
                var datoItem = {
                    id_proyecto: idProyecto(),
                    //id_historia: objFormularioHist.idHistoria(), //No se tomará en cuenta cuando se modifique
                    id_empresa: $('#idEmpresa').val(), //No se tomará en cuenta cuando se modifique
                    titulo: objFormularioHist.tituloHistoria(),
                    codigo: objFormularioHist.codigoHistoria(),
                    id_responsable: objFormularioHist.valueResponsablesHistoria(),
                    descripcion: objFormularioHist.descHistoria(),
                    horas_estimadas: objFormularioHist.horasEstimadas(),
                };

                var json = JSON.stringify(datoItem);

                if (objFormularioHist.esNuevoProyecto()) {
                    baseUri = urlBaseServiciosBreezeApi + "breeze/Proyecto/AddHistoria/";
                    _type = "POST";
                } else {
                    baseUri = urlBaseServiciosBreezeApi + "breeze/Proyecto/UpdateHistoria/" + objFormularioHist.idHistoria();
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
                        $('#myModalHistoria').modal('hide');
                        return datacontextProyectos.getEstadosKanbanTareaFiltro(vmTareas.filtro).then(refrescarVista)
                            .fail(failedInitialization);
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            } else {
                //alert('Please check your submission.');
                objFormularioHist.errors.showAllMessages();
            }
        }
    };
    //#endregion

    vmTareas = {
        activate: activate,
        title: title, //'Proyectos View',
        idProyecto: ko.observable(0),
        historias: historias,
        estadosKanbanTarea: estadosKanbanTarea,
        varSelectResponsablesTarea: varSelectResponsablesTarea,
        varSelectResponsablesHistoria: varSelectResponsablesHistoria,
        AddHistoria: AddHistoria,
        AddTarea: AddTarea,
        objFormularioHist: objFormularioHist,
        varSearch: varSearch,
        filtro: {
            idProyecto: 0,
            nombreTarea: ' '
        },
        search: function (data, event) {
            vmTareas.filtro.idProyecto = vmTareas.idProyecto();
            if (vmTareas.varSearch() == '')
                vmTareas.filtro.nombreTarea = ' ';
            else
                vmTareas.filtro.nombreTarea = vmTareas.varSearch();
            return datacontextProyectos.getEstadosKanbanTareaFiltro(vmTareas.filtro).then(refrescarVista)
                            .fail(failedInitialization);
        },
        searchEnter: function (data, event) {
            if (event.keyCode == 13) {
                vmTareas.varSearch($('#search-query').val());
                $("#btnSearch").click();
            }
            return true;
        }
    };

    vmTareas.HistoriaRenderCallback = function (elements) {
        setHistorias(elements[1]);
    }
    vmTareas.estadosKanbanTareaCallback = function (elements) {
        setKanbanTarea(elements[1]);
    }

    //objFormulario.errors = ko.validation.group(objFormulario);

    return vmTareas;

    //#region Internal Methods
    function activate(context) {
        var filterParam = context.filter;
        //alert(filterParam);
        vmTareas.idProyecto(filterParam);
        vmTareas.filtro.idProyecto = filterParam;
        //vmTareas.filtro.idProyecto = filterParam;
        //title('tareas');
        //return datacontextProyectos.getEstadosKanbanTareaFiltro(vmTareas.filtro)
        //    .then(refrescarVista)
        //    .fail(failedInitialization);
        return datacontextProyectos.getHistorias(filterParam)
            .then(boot)
            .fail(failedInitialization);
    }

    function boot() {
        //console.log('inicio boot');
        //historias.removeAll();
        var unwrapped = ko.toJS(datacontextProyectos.proyectoViewModel.historias().results).map(
            function (entity) {
                delete entity.entityAspect;
                return entity;
            });

        //countMaxRender = unwrapped.length;
        historias(unwrapped);
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

        var _varSelectResponsablesHistoria = new Array();
        Enumerable.From(unwrapped).ForEach(function (e) {
            _varSelectResponsablesHistoria.push(new objDiccionario(e.id_usuario, e.nombre_usuario + ' ' + e.ap_paterno_usuario));
        })
        varSelectResponsablesHistoria(_varSelectResponsablesHistoria);

        return datacontextProyectos.getEstadosKanbanTareaFiltro(vmTareas.filtro)
            .then(refrescarVista)
            .fail(failedInitialization);
    }

    function refrescarVista() {
        var unwrapped = ko.toJS(datacontextProyectos.proyectoViewModel.estadosKanbanTarea().results).map(
            function (entity) {
                delete entity.entityAspect;
                return entity;
            });

        //countMaxRender = unwrapped.length;
        estadosKanbanTarea(unwrapped);
        return true;
    }

    function failedInitialization(error) {
        //var msg = 'App initialization failed: ' + error.message;
        //logger.logError(msg, error, system.getModuleId(shell), true);
    }

    function AddHistoria() {
        $('#myModalHistoria').modal(varModalOption);
    }
    function AddTarea() {
        var id_estado_tarea_kanban = Enumerable.From(vmTareas.estadosKanbanTarea()).Flatten()
                .Select(function (x) { return x.kanbanTarea })
                .First().id_estado_tarea_kanban;
        console.log(id_estado_tarea_kanban);
        //setFormulario(0, id_estado_proyecto_kanban, null, null, null, null, null, true, null, 0)
        //$('#myModal').modal(varModalOption);
    }
    //#endregion
});

ko.bindingHandlers.cargarLanesHistorias = {
    init: function (element, valueAccessor) {
        $(element).find("#stories-div").toggle();
        $(element).find("#stories-toggle").click(function () {
            $("#stories-div").toggle(500);
        });

        //var toggleTasksBtn = $(".toggleTasks");
        //$(".story div.tasks").hide();
        //createButton(toggleTasksBtn, function (obj) { obj.parent().next().toggle(); });

        //var toggleTasksBtn = $(element).find(".toggleTasks");
        //toggleTasksBtn.parent().next().hide();
        //createButton(toggleTasksBtn, function (obj) {
        //    obj.parent().next().toggle();
        //    if ($(obj).find('i').hasClass('icon-chevron-right')) {
        //        $(obj).find('i').removeClass('icon-chevron-right').addClass('icon-chevron-down');
        //    } else {
        //        $(obj).find('i').removeClass('icon-chevron-down').addClass('icon-chevron-right');
        //    }
        //});
    },
    update: function (element, valueAccessor) {
    }
}

function setHistorias(element) {
    try {
        var toggleTasksBtn = $(element).find(".toggleTasks");
        toggleTasksBtn.parent().next().hide();
        createButton(toggleTasksBtn, function (obj) {
            obj.parent().next().toggle();
            if ($(obj).find('i').hasClass('icon-chevron-right')) {
                $(obj).find('i').removeClass('icon-chevron-right').addClass('icon-chevron-down');
            } else {
                $(obj).find('i').removeClass('icon-chevron-down').addClass('icon-chevron-right');
            }
        });
        createToolTipsProyectos(element);

        $(element).find(".codigoHistoria").on("mouseover", function () {
            $('#lanesTareas li[id_historia="' + $(this).attr('id_historia') + '"]').addClass('destacado');
        });
        $(element).find(".codigoHistoria").on("mouseout", function () {
            $('#lanesTareas li[id_historia="' + $(this).attr('id_historia') + '"]').removeClass('destacado');
        });

        $(element).find(".btnEditarHistoria").click(function () {
            var id_historia = $(this).attr('id_historia');

            var prehistorias = Enumerable.From(vmTareas.historias()).Flatten()
                .Select(function (x) { return x.historia })
                .ToArray();
            //console.log(prehistorias);
            //prehistorias = Enumerable.From(prehistorias).Flatten()
            //    .Where(function (x) { return x.Key == 'historia' })
            //    .Select(function (x) { return x.Value })
            //    .ToArray();

            var historia = Enumerable.From(prehistorias)
                .Where(function (x) { return x.id_historia == id_historia })
            .Single();
            console.log(historia);
            setFormularioHistoria(id_historia, historia.codigo, historia.titulo, historia.descripcion, historia.id_responsable, false, historia.horas_estimadas);
            $('#myModalHistoria').modal(varModalOption);
        });

        $(element).find(".btnCrearTarea").click(function () {
            //Hacer algo
        });
    } catch (err) {
        console.log(err.message);
    }
}

function setKanbanTarea(element) {
    try {
        $(element).find('.taskboard').sortable({
            connectWith: [".wipDrop"],
            placeholder: "drop-area",
            items: 'li:not(.ui-state-disabled)',
            receive: function (event, ui) {

                var datoItem = {
                    id_estado_tarea_kanban: ui.item.parent().attr("id")
                };
                var json = JSON.stringify(datoItem);

                baseUri = urlBaseServiciosBreezeApi + "breeze/Proyecto/UpdateEstadoTareaKanban/" + ui.item.attr("id");
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
    } catch (err) {
        console.log(err.message);
    }
}

function setFormularioHistoria(idHistoria, codigoHistoria, tituloHistoria, descHistoria, valueResponsablesHistoria, esNuevoHistoria, horasEstimadas) {
    try {
        vmTareas.objFormularioHist.idHistoria(idHistoria);
        vmTareas.objFormularioHist.codigoHistoria(codigoHistoria);
        vmTareas.objFormularioHist.tituloHistoria(tituloHistoria);
        vmTareas.objFormularioHist.descHistoria(descHistoria);
        vmTareas.objFormularioHist.valueResponsablesHistoria(valueResponsablesHistoria);
        vmTareas.objFormularioHist.validarCampos(false);
        vmTareas.objFormularioHist.horasEstimadas(horasEstimadas);
        vmTareas.objFormularioHist.errors.showAllMessages(false);
        vmTareas.objFormulario.esNuevoHistoria(esNuevoHistoria);
    } catch (error) {
        console.log(error.message);
    }
}

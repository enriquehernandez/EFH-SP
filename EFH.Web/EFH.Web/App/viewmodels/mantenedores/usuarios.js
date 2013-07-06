define(['services/logger', 'services/datacontextMantenedor', 'configSlickGrid'], function (logger, datacontextMantenedor, configSlickGrid) {

    var usuarios = ko.observableArray();
    var vm = {
        activate: activate,
        title: 'Usuarios',
        usuarios: usuarios,
        configuracionGrillas: configSlickGrid.configuracionGrillas.mantenedorUsuarios
    };

    return vm;

    //#region Internal Methods
    function activate() {
        return datacontextMantenedor.GetUsuarios()
            .then(boot)
            .fail(failedInitialization);
    }

    function boot() {
        var unwrapped = ko.toJS(datacontextMantenedor.mantenedorViewModel.usuarios().results).map(
            function (entity) {
                delete entity.entityAspect;
                return entity;
            });

        usuarios(unwrapped);

        return true;
    }

    function failedInitialization(error) {
        //var msg = 'App initialization failed: ' + error.message;
        //logger.logError(msg, error, system.getModuleId(shell), true);
    }
    //#endregion
});

var gridUsuarios;
var dataViewUsuarios;
var dataUsuarios = [];

ko.bindingHandlers.slickGridUsuarios = {
    init: function (element, valueAccessor) {
        if (element.children.gridUsuarios === undefined) return true;
        var settings = valueAccessor();
        var _datos = ko.utils.unwrapObservable(settings.datos);
        for (var i = 0; i < _datos.length; i++) {
            var d = (dataUsuarios[i] = {});

            d["id"] = _datos[i].id_usuario;
            d["email_usuario"] = _datos[i].email_usuario;
            d["nombre_usuario"] = _datos[i].nombre_usuario;
            d["ap_paterno_usuario"] = _datos[i].ap_paterno_usuario;
            d["ap_materno_usuario"] = _datos[i].ap_materno_usuario;
            d["inactivo"] = _datos[i].inactivo;
            d["por_confirmar"] = _datos[i].por_confirmar;
            d["id_empresa"] = _datos[i].id_empresa;
        }
        //console.log(data);
        var columns = ko.utils.unwrapObservable(settings.configuracionGrillas.columnas);
        var options = ko.utils.unwrapObservable(settings.configuracionGrillas.opciones) || {};

        dataViewUsuarios = new Slick.Data.DataView({ inlineFilters: true });
        gridUsuarios = new Slick.Grid(element.children.gridUsuarios, dataViewUsuarios, columns, options);
        gridUsuarios.setSelectionModel(new Slick.RowSelectionModel());

        var pagerUsuarios = new Slick.Controls.Pager(dataViewUsuarios, gridUsuarios, $(element.children.pagerUsuarios));
        var columnpicker = new Slick.Controls.ColumnPicker(columns, gridUsuarios, options);

        gridUsuarios.onCellChange.subscribe(function (e, args) {
            var datoItem = {
                id_usuario: args.item.id,
                email_usuario: args.item.email_usuario,
                nombre_usuario: args.item.nombre_usuario,
                ap_paterno_usuario: args.item.ap_paterno_usuario,
                ap_materno_usuario: args.item.ap_materno_usuario,
                inactivo: args.item.inactivo,
                por_confirmar: args.item.por_confirmar,
                id_empresa: args.item.id_empresa
            };
            var json = JSON.stringify(datoItem);

            baseUri = urlBaseServiciosBreezeApi + "breeze/Mantenedor/UpdateUsuario/" + args.item.id;
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
        });

        gridUsuarios.onKeyDown.subscribe(function (e) {
            // select all rows on ctrl-a
            if (e.which != 65 || !e.ctrlKey) {
                return false;
            }

            var rows = [];
            for (var i = 0; i < dataViewUsuarios.getLength() ; i++) {
                rows.push(i);
            }

            gridUsuarios.setSelectedRows(rows);
            e.preventDefault();
        });

        // Subscribe to the grid's onSort event.
        // It only gets fired for sortable columns, so make sure your column definition has `sortable = true`.
        gridUsuarios.onSort.subscribe(function (e, args) {
            // args.multiColumnSort indicates whether or not this is a multi-column sort.
            // If it is, the sort column and direction will be in args.sortCol & args.sortAsc.
            // If not, args.sortCols will have an array of {sortCol:..., sortAsc:...} objects.

            // We'll use a simple comparer function here.
            var comparer = function (a, b) {
                return a[args.sortCol.field] > b[args.sortCol.field];
            }

            // Delegate the sorting to DataView.
            // This will fire the change events and update the grid.
            dataViewUsuarios.sort(comparer, args.sortAsc);
        });

        dataViewUsuarios.onRowCountChanged.subscribe(function (e, args) {
            gridUsuarios.updateRowCount();
            gridUsuarios.render();
        });

        dataViewUsuarios.onRowsChanged.subscribe(function (e, args) {
            gridUsuarios.invalidateRows(args.rows);
            gridUsuarios.render();
        });

        //gridUsuarios.deleteColumn = function () {
        //    data.rem(itemNuevo);
        //};

        dataViewUsuarios.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
            var isLastPage = pagingInfo.pageNum == pagingInfo.totalPages - 1;
            var enableAddRow = isLastPage || pagingInfo.pageSize == 0;
            var options = gridUsuarios.getOptions();

            if (options.enableAddRow != enableAddRow) {
                gridUsuarios.setOptions({ enableAddRow: enableAddRow });
            }
        });

        // initialize the model after all the events have been hooked up
        dataViewUsuarios.beginUpdate();
        dataViewUsuarios.setItems(dataUsuarios);
        dataViewUsuarios.endUpdate();
        //gridUsuarios.render();
    },
    update: function (element, valueAccessor, allBindingAccessor, viewModel) {
        //var settings = valueAccessor();
        //// I can see the correct data here but the grid does not update
        //var data = ko.utils.unwrapObservable(settings.datos);
        ////gridUsuarios.render();
        //dataViewUsuarios.refresh();
        // initialize the model after all the events have been hooked up

    }
}

function requiredFieldValidator(value) {
    if (value == null || value == undefined || !value.length) {
        return { valid: false, msg: "Campo requerido" };
    } else {
        return { valid: true, msg: null };
    }
}

function renderAction(cellNode, row, dataContext, colDef) {
}
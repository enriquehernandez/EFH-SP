define(['services/logger', 'services/datacontextMantenedor', 'configSlickGrid'], function (logger, datacontextMantenedor, configSlickGrid) {
    var fases = ko.observableArray();

    var vm = {
        activate: activate,
        title: 'Fases',
        fases: fases,
        configuracionGrillas: configSlickGrid.configuracionGrillas.mantenedorFases,
        AddFase: AddFase
    };

    return vm;

    //#region Internal Methods
    function activate() {
        return datacontextMantenedor.GetFases()
            .then(boot)
            .fail(failedInitialization);
    }

    function boot() {
        var unwrapped = ko.toJS(datacontextMantenedor.mantenedorViewModel.fases().results).map(
            function (entity) {
                delete entity.entityAspect;
                return entity;
            });

        fases(unwrapped);

        return true;
    }

    function failedInitialization(error) {
        //var msg = 'App initialization failed: ' + error.message;
        //logger.logError(msg, error, system.getModuleId(shell), true);
    }

    function AddFase() {
        var maxOrden = Enumerable.From(dataViewFases.getItems()).Select(function (x) { return x.orden }).Max() + 1;

        var datoItem = {
            id_fase_proyecto: 0,
            nombre_fase: $('#nombreFase').val(),
            inactivo: 0,
            orden: maxOrden,
            id_empresa: $('#idEmpresa').val()
        };
        var json = JSON.stringify(datoItem);

        baseUri = urlBaseServiciosBreezeApi + "breeze/Mantenedor/AddFase/";
        $.ajax({
            url: baseUri,
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: json,
            success: function (results) {
                $('#nombreFase').val('');
                var message = 'Operación exitosa';
                toastr.success(message);

                //gridFases.setOptions({ enableAddRow: true });
                var itemNuevo = [];
                itemNuevo.id = results.id_fase_proyecto;
                itemNuevo.nombreFase = results.nombre_fase;
                itemNuevo.inactivo = results.inactivo;
                itemNuevo.orden = results.orden;
                itemNuevo.id_empresa = results.id_empresa;

                dataViewFases.insertItem(0, itemNuevo);

                return false;
            },
            error: function (e) {
                $('#nombreFase').val('');
                console.log(e);
            }
        });
    };
    //#endregion
});

var gridFases;
var dataViewFases;
var dataFases = [];

ko.bindingHandlers.slickGridFases = {
    init: function (element, valueAccessor) {
        if (element.children.gridFases === undefined) return true;
        var settings = valueAccessor();
        var _datos = ko.utils.unwrapObservable(settings.datos);
        for (var i = 0; i < _datos.length; i++) {
            var d = (dataFases[i] = {});

            d["id"] = _datos[i].id_fase_proyecto;
            d["nombreFase"] = _datos[i].nombre_fase;
            d["inactivo"] = _datos[i].inactivo;
            d["orden"] = _datos[i].orden;
            d["id_empresa"] = _datos[i].id_empresa;
        }
        //console.log(data);
        var columns = ko.utils.unwrapObservable(settings.configuracionGrillas.columnas);
        var options = ko.utils.unwrapObservable(settings.configuracionGrillas.opciones) || {};

        dataViewFases = new Slick.Data.DataView({ inlineFilters: true });
        gridFases = new Slick.Grid(element.children.gridFases, dataViewFases, columns, options);
        gridFases.setSelectionModel(new Slick.RowSelectionModel());

        var pagerFases = new Slick.Controls.Pager(dataViewFases, gridFases, $(element.children.pagerFases));
        var columnpicker = new Slick.Controls.ColumnPicker(columns, gridFases, options);

        gridFases.onCellChange.subscribe(function (e, args) {
            var datoItem = {
                id_fase_proyecto: args.item.id,
                nombre_fase: args.item.nombreFase,
                inactivo: args.item.inactivo,
                orden: args.item.orden,
                id_empresa: args.item.id_empresa
            };
            var json = JSON.stringify(datoItem);

            baseUri = urlBaseServiciosBreezeApi + "breeze/Mantenedor/UpdateFase/" + args.item.id;
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

        gridFases.onKeyDown.subscribe(function (e) {
            // select all rows on ctrl-a
            if (e.which != 65 || !e.ctrlKey) {
                return false;
            }

            var rows = [];
            for (var i = 0; i < dataViewFases.getLength() ; i++) {
                rows.push(i);
            }

            gridFases.setSelectedRows(rows);
            e.preventDefault();
        });

        // Subscribe to the grid's onSort event.
        // It only gets fired for sortable columns, so make sure your column definition has `sortable = true`.
        gridFases.onSort.subscribe(function (e, args) {
            // args.multiColumnSort indicates whether or not this is a multi-column sort.
            // If it is, the sort column and direction will be in args.sortCol & args.sortAsc.
            // If not, args.sortCols will have an array of {sortCol:..., sortAsc:...} objects.

            // We'll use a simple comparer function here.
            var comparer = function (a, b) {
                return a[args.sortCol.field] > b[args.sortCol.field];
            }

            // Delegate the sorting to DataView.
            // This will fire the change events and update the grid.
            dataViewFases.sort(comparer, args.sortAsc);
        });

        dataViewFases.onRowCountChanged.subscribe(function (e, args) {
            gridFases.updateRowCount();
            gridFases.render();
        });

        dataViewFases.onRowsChanged.subscribe(function (e, args) {
            gridFases.invalidateRows(args.rows);
            gridFases.render();
        });

        //gridFases.deleteColumn = function () {
        //    data.rem(itemNuevo);
        //};

        dataViewFases.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
            var isLastPage = pagingInfo.pageNum == pagingInfo.totalPages - 1;
            var enableAddRow = isLastPage || pagingInfo.pageSize == 0;
            var options = gridFases.getOptions();

            if (options.enableAddRow != enableAddRow) {
                gridFases.setOptions({ enableAddRow: enableAddRow });
            }
        });

        // initialize the model after all the events have been hooked up
        dataViewFases.beginUpdate();
        dataViewFases.setItems(dataFases);
        dataViewFases.endUpdate();
        //gridFases.render();
    },
    update: function (element, valueAccessor, allBindingAccessor, viewModel) {
        //var settings = valueAccessor();
        //// I can see the correct data here but the grid does not update
        //var data = ko.utils.unwrapObservable(settings.datos);
        ////gridFases.render();
        //dataViewFases.refresh();
        // initialize the model after all the events have been hooked up

    }
}

//function checkFieldValidator(value) {
//    if (value == null || value == undefined || !value.length) {
//        return { valid: false, msg: "Campo requerido" };
//    } else {
//        return { valid: true, msg: null };
//    }
//}

var idFaseDel;

function renderAction(cellNode, row, dataContext, colDef) {
    $(cellNode).empty().html('<div class="control-group info"><label class="control-label del" id="' + dataContext.id + '">Eliminar</label></div>');
    $('label.control-label.del').unbind('click').click(function () {
        try {
            idFaseDel = $(this).attr("id");
            var item = dataViewFases.getItemById(idFaseDel);
            var msg = "Esta seguro de querer eliminar el dato: \"" + item.nombreFase + "\"?";
            //if (!confirm(msg)) {
            //    return;
            //}
            //DelRol(idRol);
            //var modalDialog = require('durandal/modalDialog');
            var app = require('durandal/app');
            //app.showMessage(msg, "Eliminar", ['Si', 'No']).then(console.log("OK"));
            return app.showMessage(msg, "Eliminar", ['Si', 'No']).then(confirmDel);

            //    alert("Si");
            //else
            //    alert("No");
        } catch (err) {
            console.log(err);
        }
    });
}

function confirmDel(selectedOption) {
    if (selectedOption === 'Si')
        DelFase(idFaseDel);

    return true;
}

function DelFase(idFase) {
    baseUri = urlBaseServiciosBreezeApi + "breeze/Mantenedor/DelFase/" + idFase;
    $.ajax({
        url: baseUri,
        type: 'DELETE',
        contentType: "application/json; charset=utf-8",
        success: function (results) {
            dataViewFases.deleteItem(idFase);
            var message = 'Eliminación exitosa';
            toastr.success(message);
            return false;
        },
        error: function (e) {
            console.log(e);
        }
    });
};
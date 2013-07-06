define(['services/logger', 'services/datacontextMantenedor', 'configSlickGrid'], function (logger, datacontextMantenedor, configSlickGrid) {

    var clientes = ko.observableArray();

    var vm = {
        activate: activate,
        title: 'Clientes',
        clientes: clientes,
        configuracionGrillas: configSlickGrid.configuracionGrillas.mantenedorClientes,
        AddCliente: AddCliente
    };

    return vm;

    //#region Internal Methods
    function activate() {
        return datacontextMantenedor.GetClientes()
            .then(boot)
            .fail(failedInitialization);
    }

    function boot() {
        //console.log('inicio boot');

        var unwrapped = ko.toJS(datacontextMantenedor.mantenedorViewModel.clientes().results).map(
            function (entity) {
                delete entity.entityAspect;
                return entity;
            });

        clientes(unwrapped);

        return true;
    }

    function failedInitialization(error) {
        //var msg = 'App initialization failed: ' + error.message;
        //logger.logError(msg, error, system.getModuleId(shell), true);
    }

    function AddCliente() {
        var datoItem = {
            id_cliente: 0,
            nombre_cliente: $('#nombreCliente').val(),
            id_empresa: $('#idEmpresa').val(),
            inactivo: 0
        };
        var json = JSON.stringify(datoItem);

        baseUri = urlBaseServiciosBreezeApi + "breeze/Mantenedor/AddCliente/";
        $.ajax({
            url: baseUri,
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: json,
            success: function (results) {
                $('#nombreCliente').val('');
                var message = 'Operación exitosa';
                toastr.success(message);

                //gridClientes.setOptions({ enableAddRow: true });
                var itemNuevo = [];
                itemNuevo.id = results.id_cliente;
                itemNuevo.nombre_cliente = results.nombre_cliente;
                itemNuevo.id_empresa = results.id_empresa;
                itemNuevo.inactivo = results.inactivo;

                dataViewClientes.insertItem(0, itemNuevo);

                return false;
            },
            error: function (e) {
                $('#nombreCliente').val('');
                console.log(e);
            }
        });
    };
    //#endregion
});

var gridClientes;
var dataViewClientes;
var dataClientes = [];


ko.bindingHandlers.slickGridClientes = {
    init: function (element, valueAccessor) {
        if (element.children.gridCliente === undefined) return true;
        var settings = valueAccessor();
        var _datos = ko.utils.unwrapObservable(settings.datos);
        for (var i = 0; i < _datos.length; i++) {
            var d = (dataClientes[i] = {});

            d["id"] = _datos[i].id_cliente;
            d["nombre_cliente"] = _datos[i].nombre_cliente;
            d["id_empresa"] = _datos[i].id_empresa;
            d["inactivo"] = _datos[i].inactivo;
        }
        //console.log(data);
        var columns = ko.utils.unwrapObservable(settings.configuracionGrillas.columnas);
        var options = ko.utils.unwrapObservable(settings.configuracionGrillas.opciones) || {};

        dataViewClientes = new Slick.Data.DataView({ inlineFilters: true });
        gridClientes = new Slick.Grid(element.children.gridCliente, dataViewClientes, columns, options);
        gridClientes.setSelectionModel(new Slick.RowSelectionModel());

        var pagerClientes = new Slick.Controls.Pager(dataViewClientes, gridClientes, $(element.children.pagerClientes));

        dataViewClientes.onRowCountChanged.subscribe(function (e, args) {
            gridClientes.updateRowCount();
            gridClientes.render();
        });

        dataViewClientes.onRowsChanged.subscribe(function (e, args) {
            gridClientes.invalidateRows(args.rows);
            gridClientes.render();
        });

        gridClientes.onCellChange.subscribe(function (e, args) {
            var datoItem = {
                id_cliente: args.item.id,
                nombre_cliente: args.item.nombre_cliente,
                id_empresa: args.item.id_empresa,
                inactivo: args.item.inactivo
            };
            var json = JSON.stringify(datoItem);

            baseUri = urlBaseServiciosBreezeApi + "breeze/Mantenedor/UpdateCliente/" + args.item.id;
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

        gridClientes.onKeyDown.subscribe(function (e) {
            // select all rows on ctrl-a
            if (e.which != 65 || !e.ctrlKey) {
                return false;
            }

            var rows = [];
            for (var i = 0; i < dataViewClientes.getLength() ; i++) {
                rows.push(i);
            }

            gridClientes.setSelectedRows(rows);
            e.preventDefault();
        });

        // Subscribe to the grid's onSort event.
        // It only gets fired for sortable columns, so make sure your column definition has `sortable = true`.
        gridClientes.onSort.subscribe(function (e, args) {
            // args.multiColumnSort indicates whether or not this is a multi-column sort.
            // If it is, the sort column and direction will be in args.sortCol & args.sortAsc.
            // If not, args.sortCols will have an array of {sortCol:..., sortAsc:...} objects.

            // We'll use a simple comparer function here.
            var comparer = function (a, b) {
                return a[args.sortCol.field] > b[args.sortCol.field];
            }

            // Delegate the sorting to DataView.
            // This will fire the change events and update the grid.
            dataViewClientes.sort(comparer, args.sortAsc);
        });

        //gridClientes.deleteColumn = function () {
        //    data.rem(itemNuevo);
        //};

        dataViewClientes.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
            var isLastPage = pagingInfo.pageNum == pagingInfo.totalPages - 1;
            var enableAddRow = isLastPage || pagingInfo.pageSize == 0;
            var options = gridClientes.getOptions();

            if (options.enableAddRow != enableAddRow) {
                gridClientes.setOptions({ enableAddRow: enableAddRow });
            }
        });

        dataViewClientes.beginUpdate();
        dataViewClientes.setItems(dataClientes);
        dataViewClientes.endUpdate();
        gridClientes.render();
    },
    update: function (element, valueAccessor, allBindingAccessor, viewModel) {
        //var settings = valueAccessor();
        //// I can see the correct data here but the grid does not update
        //var data = ko.utils.unwrapObservable(settings.datos);
        ////gridClientes.render();
        //dataViewClientes.refresh();
        // initialize the model after all the events have been hooked up

    }
}

var idClienteDel;

function renderAction(cellNode, row, dataContext, colDef) {
    $(cellNode).empty().html('<div class="control-group info"><label class="control-label del" id="' + dataContext.id + '">Eliminar</label></div>');
    $('label.control-label.del').unbind('click').click(function () {
        try {
            idClienteDel = $(this).attr("id");
            var item = dataViewClientes.getItemById(idClienteDel);
            var msg = "Esta seguro de querer eliminar el dato: \"" + item.nombreRol + "\"?";
            //if (!confirm(msg)) {
            //    return;
            //}
            //DelCliente(idRol);
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
        DelCliente(idClienteDel);

    return true;
}

function DelCliente(idCliente) {
    baseUri = urlBaseServiciosBreezeApi + "breeze/Mantenedor/DelCliente/" + idCliente;
    $.ajax({
        url: baseUri,
        type: 'DELETE',
        contentType: "application/json; charset=utf-8",
        success: function (results) {
            dataViewClientes.deleteItem(idCliente);
            var message = 'Eliminación exitosa';
            toastr.success(message);
            return false;
        },
        error: function (e) {
            console.log(e);
        }
    });
};
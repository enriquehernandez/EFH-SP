define(['services/logger', 'services/datacontextMantenedor', 'configSlickGrid'], function (logger, datacontextMantenedor, configSlickGrid) {

    var roles = ko.observableArray();

    var vm = {
        activate: activate,
        title: 'Roles',
        roles: roles,
        configuracionGrillas: configSlickGrid.configuracionGrillas.mantenedorRoles,
        AddRol: AddRol
    };

    return vm;

    //#region Internal Methods
    function activate() {
        return datacontextMantenedor.GetRoles()
            .then(boot)
            .fail(failedInitialization);
    }

    function boot() {
        //console.log('inicio boot');

        var unwrapped = ko.toJS(datacontextMantenedor.mantenedorViewModel.roles().results).map(
            function (entity) {
                delete entity.entityAspect;
                return entity;
            });

        roles(unwrapped);

        return true;
    }

    function failedInitialization(error) {
        //var msg = 'App initialization failed: ' + error.message;
        //logger.logError(msg, error, system.getModuleId(shell), true);
    }

    function AddRol(){
        var datoItem = {
            id_rol: 0,
            nombre_rol: $('#nombreRol').val(),
            id_empresa: $('#idEmpresa').val(),
            inactivo: 0
        };
        var json = JSON.stringify(datoItem);

        baseUri = urlBaseServiciosBreezeApi + "breeze/Mantenedor/AddRol/";
        $.ajax({
            url: baseUri,
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: json,
            success: function (results) {
                $('#nombreRol').val('');
                var message = 'Operación exitosa';
                toastr.success(message);

                //gridRoles.setOptions({ enableAddRow: true });
                var itemNuevo = [];
                itemNuevo.id = results.id_rol;
                itemNuevo.nombreRol = results.nombre_rol;
                itemNuevo.id_empresa = results.id_empresa;
                itemNuevo.inactivo = results.inactivo;

                dataViewRoles.insertItem(0, itemNuevo);

                return false;
            },
            error: function (e) {
                $('#nombreRol').val('');
                console.log(e);
            }
        });
    };
    //#endregion
});

var gridRoles;
var dataViewRoles;
var dataRoles = [];


ko.bindingHandlers.slickGridRoles = {
    init: function (element, valueAccessor) {
        if (element.children.gridRoles === undefined) return true;
        var settings = valueAccessor();
        var _datos = ko.utils.unwrapObservable(settings.datos);
        for (var i = 0; i < _datos.length; i++) {
            var d = (dataRoles[i] = {});

            d["id"] = _datos[i].id_rol;
            d["nombreRol"] = _datos[i].nombre_rol;
            d["id_empresa"] = _datos[i].id_empresa;
            d["inactivo"] = _datos[i].inactivo;
        }
        //console.log(data);
        var columns = ko.utils.unwrapObservable(settings.configuracionGrillas.columnas);
        var options = ko.utils.unwrapObservable(settings.configuracionGrillas.opciones) || {};

        dataViewRoles = new Slick.Data.DataView({ inlineFilters: true });
        gridRoles = new Slick.Grid(element.children.gridRoles, dataViewRoles, columns, options);
        gridRoles.setSelectionModel(new Slick.RowSelectionModel());

        //var pagerRoles = new Slick.Controls.Pager(dataViewRoles, gridRoles, $("#pagerRoles"));
        var pagerRoles = new Slick.Controls.Pager(dataViewRoles, gridRoles, $(element.children.pagerRoles));

        dataViewRoles.onRowCountChanged.subscribe(function (e, args) {
            gridRoles.updateRowCount();
            gridRoles.render();
        });

        dataViewRoles.onRowsChanged.subscribe(function (e, args) {
            gridRoles.invalidateRows(args.rows);
            gridRoles.render();
        });

        gridRoles.onCellChange.subscribe(function (e, args) {
            var datoItem = {
                id_rol: args.item.id,
                nombre_rol: args.item.nombreRol,
                id_empresa: args.item.id_empresa,
                inactivo: args.item.inactivo
            };
            var json = JSON.stringify(datoItem);

            baseUri = urlBaseServiciosBreezeApi + "breeze/Mantenedor/UpdateRol/" + args.item.id;
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

        gridRoles.onKeyDown.subscribe(function (e) {
            // select all rows on ctrl-a
            if (e.which != 65 || !e.ctrlKey) {
                return false;
            }

            var rows = [];
            for (var i = 0; i < dataViewRoles.getLength() ; i++) {
                rows.push(i);
            }

            gridRoles.setSelectedRows(rows);
            e.preventDefault();
        });

        // Subscribe to the grid's onSort event.
        // It only gets fired for sortable columns, so make sure your column definition has `sortable = true`.
        gridRoles.onSort.subscribe(function (e, args) {
            // args.multiColumnSort indicates whether or not this is a multi-column sort.
            // If it is, the sort column and direction will be in args.sortCol & args.sortAsc.
            // If not, args.sortCols will have an array of {sortCol:..., sortAsc:...} objects.

            // We'll use a simple comparer function here.
            var comparer = function (a, b) {
                return a[args.sortCol.field] > b[args.sortCol.field];
            }

            // Delegate the sorting to DataView.
            // This will fire the change events and update the grid.
            dataViewRoles.sort(comparer, args.sortAsc);
        });

        //gridRoles.deleteColumn = function () {
        //    data.rem(itemNuevo);
        //};

        dataViewRoles.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
            var isLastPage = pagingInfo.pageNum == pagingInfo.totalPages - 1;
            var enableAddRow = isLastPage || pagingInfo.pageSize == 0;
            var options = gridRoles.getOptions();

            if (options.enableAddRow != enableAddRow) {
                gridRoles.setOptions({ enableAddRow: enableAddRow });
            }
        });

        dataViewRoles.beginUpdate();
        dataViewRoles.setItems(dataRoles);
        dataViewRoles.endUpdate();
        gridRoles.render();
    },
    update: function (element, valueAccessor, allBindingAccessor, viewModel) {
        //var settings = valueAccessor();
        //// I can see the correct data here but the grid does not update
        //var data = ko.utils.unwrapObservable(settings.datos);
        ////gridRoles.render();
        //dataViewRoles.refresh();
        // initialize the model after all the events have been hooked up
        
    }
}

var idRolDel;

function renderAction(cellNode, row, dataContext, colDef) {
    $(cellNode).empty().html('<div class="control-group info"><label class="control-label del" id="' + dataContext.id + '">Eliminar</label></div>');
    $('label.control-label.del').unbind('click').click(function () {
        try {
            idRolDel = $(this).attr("id");
            var item = dataViewRoles.getItemById(idRolDel);
            var msg = "Esta seguro de querer eliminar el dato: \"" + item.nombreRol + "\"?";
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
    if(selectedOption === 'Si')
        DelRol(idRolDel);

    return true;
}

function DelRol(idRol) {
    baseUri = urlBaseServiciosBreezeApi + "breeze/Mantenedor/DelRol/" + idRol;
    $.ajax({
        url: baseUri,
        type: 'DELETE',
        contentType: "application/json; charset=utf-8",
        success: function (results) {
            dataViewRoles.deleteItem(idRol);
            var message = 'Eliminación exitosa';
            toastr.success(message);
            return false;
        },
        error: function (e) {
            console.log(e);
        }
    });
};
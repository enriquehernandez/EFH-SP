define(['services/logger', 'services/datacontextMantenedor', 'configSlickGrid'], function (logger, datacontextMantenedor, configSlickGrid) {

    var grupos = ko.observableArray();

    var vm = {
        activate: activate,
        title: 'Grupos',
        grupos: grupos,
        configuracionGrillas: configSlickGrid.configuracionGrillas.mantenedorGrupos,
        AddGrupo: AddGrupo
    };

    return vm;

    //#region Internal Methods
    function activate() {
        return datacontextMantenedor.GetGrupos()
            .then(boot)
            .fail(failedInitialization);
    }

    function boot() {
        //console.log('inicio boot');

        var unwrapped = ko.toJS(datacontextMantenedor.mantenedorViewModel.grupos().results).map(
            function (entity) {
                delete entity.entityAspect;
                return entity;
            });

        grupos(unwrapped);

        return true;
    }

    function failedInitialization(error) {
        //var msg = 'App initialization failed: ' + error.message;
        //logger.logError(msg, error, system.getModuleId(shell), true);
    }

    function AddGrupo() {
        var datoItem = {
            id_grupo: 0,
            nombre_grupo: $('#nombreGrupo').val(),
            id_empresa: $('#idEmpresa').val(),
            inactivo: 0,
            id_tipo_grupo: 0
        };
        var json = JSON.stringify(datoItem);

        baseUri = urlBaseServiciosBreezeApi + "breeze/Mantenedor/AddGrupo/";
        $.ajax({
            url: baseUri,
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: json,
            success: function (results) {
                $('#nombreGrupo').val('');
                var message = 'Operación exitosa';
                toastr.success(message);

                //gridGrupos.setOptions({ enableAddRow: true });
                var itemNuevo = [];
                itemNuevo.id = results.id_grupo;
                itemNuevo.nombre_grupo = results.nombre_grupo;
                itemNuevo.id_empresa = results.id_empresa;
                itemNuevo.inactivo = results.inactivo;
                itemNuevo.id_tipo_grupo = results.id_tipo_grupo;

                dataViewGrupos.insertItem(0, itemNuevo);

                return false;
            },
            error: function (e) {
                $('#nombreGrupo').val('');
                console.log(e);
            }
        });
    };
    //#endregion
});

var gridGrupos;
var dataViewGrupos;
var dataGrupos = [];


ko.bindingHandlers.slickGridGrupos = {
    init: function (element, valueAccessor) {
        if (element.children.gridGrupo === undefined) return true;
        var settings = valueAccessor();
        var _datos = ko.utils.unwrapObservable(settings.datos);
        for (var i = 0; i < _datos.length; i++) {
            var d = (dataGrupos[i] = {});

            d["id"] = _datos[i].id_grupo;
            d["nombre_grupo"] = _datos[i].nombre_grupo;
            d["id_empresa"] = _datos[i].id_empresa;
            d["inactivo"] = _datos[i].inactivo;
            d["id_tipo_grupo"] = _datos[i].id_tipo_grupo;
        }
        //console.log(data);
        var columns = ko.utils.unwrapObservable(settings.configuracionGrillas.columnas);
        var options = ko.utils.unwrapObservable(settings.configuracionGrillas.opciones) || {};

        dataViewGrupos = new Slick.Data.DataView({ inlineFilters: true });
        gridGrupos = new Slick.Grid(element.children.gridGrupo, dataViewGrupos, columns, options);
        gridGrupos.setSelectionModel(new Slick.RowSelectionModel());

        var pagerGrupos = new Slick.Controls.Pager(dataViewGrupos, gridGrupos, $(element.children.pagerGrupos));

        dataViewGrupos.onRowCountChanged.subscribe(function (e, args) {
            gridGrupos.updateRowCount();
            gridGrupos.render();
        });

        dataViewGrupos.onRowsChanged.subscribe(function (e, args) {
            gridGrupos.invalidateRows(args.rows);
            gridGrupos.render();
        });

        gridGrupos.onCellChange.subscribe(function (e, args) {
            var datoItem = {
                id_grupo: args.item.id,
                nombre_grupo: args.item.nombre_grupo,
                id_empresa: args.item.id_empresa,
                inactivo: args.item.inactivo,
                id_tipo_grupo: args.item.id_tipo_grupo
            };
            var json = JSON.stringify(datoItem);

            baseUri = urlBaseServiciosBreezeApi + "breeze/Mantenedor/UpdateGrupo/" + args.item.id;
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

        gridGrupos.onKeyDown.subscribe(function (e) {
            // select all rows on ctrl-a
            if (e.which != 65 || !e.ctrlKey) {
                return false;
            }

            var rows = [];
            for (var i = 0; i < dataViewGrupos.getLength() ; i++) {
                rows.push(i);
            }

            gridGrupos.setSelectedRows(rows);
            e.preventDefault();
        });

        // Subscribe to the grid's onSort event.
        // It only gets fired for sortable columns, so make sure your column definition has `sortable = true`.
        gridGrupos.onSort.subscribe(function (e, args) {
            // args.multiColumnSort indicates whether or not this is a multi-column sort.
            // If it is, the sort column and direction will be in args.sortCol & args.sortAsc.
            // If not, args.sortCols will have an array of {sortCol:..., sortAsc:...} objects.

            // We'll use a simple comparer function here.
            var comparer = function (a, b) {
                return a[args.sortCol.field] > b[args.sortCol.field];
            }

            // Delegate the sorting to DataView.
            // This will fire the change events and update the grid.
            dataViewGrupos.sort(comparer, args.sortAsc);
        });

        //gridGrupos.deleteColumn = function () {
        //    data.rem(itemNuevo);
        //};

        dataViewGrupos.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
            var isLastPage = pagingInfo.pageNum == pagingInfo.totalPages - 1;
            var enableAddRow = isLastPage || pagingInfo.pageSize == 0;
            var options = gridGrupos.getOptions();

            if (options.enableAddRow != enableAddRow) {
                gridGrupos.setOptions({ enableAddRow: enableAddRow });
            }
        });

        dataViewGrupos.beginUpdate();
        dataViewGrupos.setItems(dataGrupos);
        dataViewGrupos.endUpdate();
        gridGrupos.render();
    },
    update: function (element, valueAccessor, allBindingAccessor, viewModel) {
        //var settings = valueAccessor();
        //// I can see the correct data here but the grid does not update
        //var data = ko.utils.unwrapObservable(settings.datos);
        ////gridGrupos.render();
        //dataViewGrupos.refresh();
        // initialize the model after all the events have been hooked up

    }
}

var idGrupoDel;

function renderAction(cellNode, row, dataContext, colDef) {
    $(cellNode).empty().html('<div class="control-group info"><label class="control-label del" id="' + dataContext.id + '">Eliminar</label></div>');
    $('label.control-label.del').unbind('click').click(function () {
        try {
            idGrupoDel = $(this).attr("id");
            var item = dataViewGrupos.getItemById(idGrupoDel);
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
    if (selectedOption === 'Si')
        DelGrupo(idGrupoDel);

    return true;
}

function DelGrupo(idGrupo) {
    baseUri = urlBaseServiciosBreezeApi + "breeze/Mantenedor/DelGrupo/" + idGrupo;
    $.ajax({
        url: baseUri,
        type: 'DELETE',
        contentType: "application/json; charset=utf-8",
        success: function (results) {
            dataViewGrupos.deleteItem(idGrupo);
            var message = 'Eliminación exitosa';
            toastr.success(message);
            return false;
        },
        error: function (e) {
            console.log(e);
        }
    });
};
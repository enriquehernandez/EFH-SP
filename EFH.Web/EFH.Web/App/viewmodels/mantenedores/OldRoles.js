define(['services/logger', 'services/datacontextMantenedor', 'configSlickGrid'], function (logger, datacontextMantenedor, configSlickGrid) {

    var roles = ko.observableArray();
    //var gridViewModel;

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
        //logger.log('Roles View Activated', null, 'home', true);
        //return true;
        return datacontextMantenedor.GetRoles()
            .then(boot)
            .fail(failedInitialization);
    }

    function boot() {
        console.log('inicio boot');

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

    //function Item(id_rol, nombre_rol, id_empresa) {
    //    this.id_rol = id_rol;
    //    this.c = nombre_rol;
    //    this.id_empresa = id_empresa;
    //}


    function AddRol(){
        var datoItem = {
            id_rol: 0,
            nombre_rol: $('#nombreRol').val(),
            id_empresa: $('#idEmpresa').val()
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
                var message = 'Actualización exitosa';
                toastr.info(message);

                //gridRoles.setOptions({ enableAddRow: true });
                var itemNuevo = [];
                itemNuevo.id_rol = results.id_rol;
                itemNuevo.nombre_rol = results.nombre_rol;
                itemNuevo.id_empresa = results.id_empresa;
                
                gridRoles.invalidateRow(data.length);
                data.push(itemNuevo);
                gridRoles.updateRowCount();
                gridRoles.render();

                //gridRoles.invalidate();
                //gridRoles.render();
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
var data = [];
ko.bindingHandlers.slickGrid = {
    init: function (element, valueAccessor) {
        var settings = valueAccessor();
        data = ko.utils.unwrapObservable(settings.datos);
        var columns = ko.utils.unwrapObservable(settings.configuracionGrillas.columnas);
        var options = ko.utils.unwrapObservable(settings.configuracionGrillas.opciones) || {};

        gridRoles = new Slick.Grid(element, data, columns, options);
        gridRoles.setSelectionModel(new Slick.CellSelectionModel());
        //grid.setSelectionModel(new Slick.RowSelectionModel());

        gridRoles.onCellChange.subscribe(function (e, args) {
            var datoItem = {
                id_rol: args.item.id_rol,
                nombre_rol: args.item.nombre_rol,
                id_empresa: args.item.id_empresa
            };
            var json = JSON.stringify(datoItem);

            baseUri = urlBaseServiciosBreezeApi + "breeze/Mantenedor/UpdateRol/" + args.item.id_rol;
            $.ajax({
                url: baseUri,
                type: 'PUT',
                contentType: "application/json; charset=utf-8",
                data: json,
                success: function (results) {
                    //if (results.status != "ok") {
                    //    alert(results.msg);
                    //    undo();
                    //} else {
                    //    alert(results.msg);
                    //}
                    //return false;
                   
                    var message = 'Actualización exitosa';
                    toastr.info(message);
                    gridRoles.invalidate();
                    gridRoles.render();

                    return false;
                },
                error: function (e) {
                    console.log(e);
                }
            });
        });

        gridRoles.onSort.subscribe(function (e, args) {
            var cols = args.sortCols;

            data.sort(function (dataRow1, dataRow2) {
                for (var i = 0, l = cols.length; i < l; i++) {
                    var field = cols[i].sortCol.field;
                    var sign = cols[i].sortAsc ? 1 : -1;
                    var value1 = dataRow1[field], value2 = dataRow2[field];
                    var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
                    if (result != 0) {
                        return result;
                    }
                }
                return 0;
            });
            gridRoles.invalidate();
            gridRoles.render();
        });

        gridRoles.deleteColumn = function () {
            data.rem(itemNuevo);
        };

    },
    update: function (element, valueAccessor, allBindingAccessor, viewModel) {
        var settings = valueAccessor();
        // I can see the correct data here but the grid does not update
        var data = ko.utils.unwrapObservable(settings.datos);
        gridRoles.render();
    }
}

function waitingFormatter(value) {
    return "...";
}

function renderAction(cellNode, row, dataContext, colDef) {
    $(cellNode).empty().html('<div class="control-group info"><label class="control-label del" id="' + dataContext.id_rol + '">Eliminar</label></div>');
    $('label.control-label.del').unbind('click').click(function () {
        //gridRoles.deleteColumn();
        var idRol = $(this).attr("id");
        //gridRoles.invalidateRow(data.length);
        //for (var i = 0, l = data.length; i < l; i++) {
        //    if (data[i].id_rol == idRol)
        //        delete data[i];
        //}
        //for (var i = 0; i < data.length; i++) if (data[i].id_rol === idRol) data.splice(i, 1);
        //for (var i = 0; i < data.length; i++) if (data[i].id_rol === idRol) dataViewRoles
        //gridRoles.updateRowCount();
        //gridRoles.render();
        //var currItem = dataViewRoles.getItemById(idRol);
        //var msg = "Are you sure you want to delete \"" + currItem.nombre_rol + "\"?";
        //if (!confirm(msg)) {
        //    return;
        //}
        //dataViewRoles.deleteItem(idRol);


        //gridRoles.invalidateRow(data.length);
        //gridRoles.removeRow(gridRow);
        //gridRoles.updateRowCount();
        //gridRoles.render();
        
        var selrow = gridRoles.getSelectedRows();;
        for (var i = 0, l = data.length; i < l; i++) {
            if (data[i].id_rol == idRol)
                selrow.push(i);
        }
        //var selrow = gridRoles.getSelectedRows();
        //console.log(data);
        //gridRoles.invalidateRow(data.length);
        //gridRoles.invalidate();
        data.splice(selrow, 1);
        //gridRoles.invalidate();
        gridRoles.updateRowCount();
        //console.log(data);
        //gridRoles.updateRowCount();
        gridRoles.render();
    });
}

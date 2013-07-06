
define(function () {

    //#region Usuarios
    var columnasUsuarios = [
        { id: "email_usuario", name: "Email", field: "email_usuario", headerCssClass: "cell-title", sortable: true, selectable: false, cannotTriggerInsert: true },
        { id: "nombre_usuario", name: "Nombre", field: "nombre_usuario", headerCssClass: "cell-title", sortable: true, editor: Slick.Editors.Text, validator: requiredFieldValidator },
        { id: "ap_paterno_usuario", name: "Apellido Paterno", field: "ap_paterno_usuario", headerCssClass: "cell-title", sortable: true, editor: Slick.Editors.Text, validator: requiredFieldValidator },
        { id: "ap_materno_usuario", name: "Apellido Materno", field: "ap_materno_usuario", headerCssClass: "cell-title", sortable: true, editor: Slick.Editors.Text, validator: requiredFieldValidator },
        { id: "inactivo", name: "Inactivo", field: "inactivo", cssClass: "cell-effort-driven", headerCssClass: "cell-title", width: 80, minWidth: 20, maxWidth: 80, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox, cannotTriggerInsert: true, sortable: true },
        { id: "por_confirmar", name: "Por Confirmar", field: "por_confirmar", cssClass: "cell-effort-driven", headerCssClass: "cell-title", width: 130, minWidth: 80, maxWidth: 130, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox, cannotTriggerInsert: true, sortable: true }
    ];

    //#endregion Usuarios

    //#region Clientes
    var columnasClientes = [
        { id: "id", name: "ID", field: "id", headerCssClass: "cell-title", sortable: true, width: 40, minWidth: 20, maxWidth: 40, selectable: false, cannotTriggerInsert: true },
        { id: "nombre_cliente", name: "Cliente", field: "nombre_cliente", headerCssClass: "cell-title", sortable: true, editor: Slick.Editors.Text, validator: requiredFieldValidator },
        { id: "inactivo", name: "Inactivo", field: "inactivo", cssClass: "cell-effort-driven", headerCssClass: "cell-title", width: 80, minWidth: 20, maxWidth: 80, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox, cannotTriggerInsert: true, sortable: true }
    ];
    //#endregion Clientes

    //#region Grupos
    var columnasGrupos = [
        { id: "id", name: "ID", field: "id", headerCssClass: "cell-title", sortable: true, width: 40, minWidth: 20, maxWidth: 40, selectable: false, cannotTriggerInsert: true },
        { id: "nombre_grupo", name: "Grupo", field: "nombre_grupo", headerCssClass: "cell-title", sortable: true, editor: Slick.Editors.Text, validator: requiredFieldValidator },
        { id: "inactivo", name: "Inactivo", field: "inactivo", cssClass: "cell-effort-driven", headerCssClass: "cell-title", width: 80, minWidth: 20, maxWidth: 80, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox, cannotTriggerInsert: true, sortable: true },
        { id: "id_tipo_grupo", name: "Tipo Grupo", field: "id_tipo_grupo", cssClass: "", headerCssClass: "cell-title", sortable: true, width: 250, minWidth: 120, maxWidth: 250, formatter: Slick.Formatters.TipoGrupoSelect, editor: Slick.Editors.TipoGrupoSelect, validator: requiredFieldValidator, asyncPostRender: renderTipoGrupo }
    ];
    //#endregion Grupos

    //#region Fases
    var columnasFases = [
        { id: "id", name: "ID", field: "id", headerCssClass: "cell-title", sortable: true, width: 40, minWidth: 20, maxWidth: 40, selectable: false, cannotTriggerInsert: true },
        { id: "nombreFase", name: "Fase", field: "nombreFase", headerCssClass: "cell-title", sortable: true, editor: Slick.Editors.Text, validator: requiredFieldValidator },
        //{ id: "inactivo", name: "Inactivo", field: "inactivo", cssClass: "cell-effort-driven", headerCssClass: "cell-texto", sortable: true, width: 15, validator: checkFieldValidator, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox },
        { id: "inactivo", name: "Inactivo", field: "inactivo", cssClass: "cell-effort-driven", headerCssClass: "cell-title", width: 80, minWidth: 20, maxWidth: 80, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox, cannotTriggerInsert: true, sortable: true },
        { id: "orden", name: "Orden", field: "orden", cssClass: "cell-effort-driven", headerCssClass: "cell-title", sortable: true, width: 80, minWidth: 20, maxWidth: 80, editor: Slick.Editors.Integer, validator: requiredFieldValidator }
        //{ id: "accion", name: "Acción", field: "accion", cssClass: "cell-action", headerCssClass: "cell-title", sortable: false, selectable: false, width: 100, minWidth: 80, maxWidth: 100, formatter: waitingFormatter, rerenderOnResize: true, asyncPostRender: renderAction }
    ];
    //#endregion Fases

    //#region Roles
    var columnasRoles = [
        { id: "id", name: "ID", field: "id", sortable: true, width: 15, selectable: false, cannotTriggerInsert: true },
        { id: "nombreRol", name: "Rol", field: "nombreRol", headerCssClass: "cell-texto", sortable: true, editor: Slick.Editors.Text, validator: requiredFieldValidator },
        { id: "inactivo", name: "Inactivo", field: "inactivo", cssClass: "cell-effort-driven", headerCssClass: "cell-title", width: 80, minWidth: 20, maxWidth: 80, formatter: Slick.Formatters.Checkmark, editor: Slick.Editors.Checkbox, cannotTriggerInsert: true, sortable: true }
        //{ id: "accion", name: "Acción", field: "accion", cssClass: "cell-action", sortable: false, selectable: false, width: 15, formatter: waitingFormatter, rerenderOnResize: true, asyncPostRender: renderAction }
    ];

    //#endregion Roles

    var opcionesGenericas = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: false,
        multiColumnSort: false,
        forceFitColumns: true
    };
    var opcionesGenericasAsync = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: false,
        multiColumnSort: false,
        forceFitColumns: true,
        enableAsyncPostRender: true
    };
    

    var configuracionGrillas = {
        mantenedorUsuarios: {
            columnas: columnasUsuarios,
            opciones: opcionesGenericas
        }, mantenedorClientes: {
            columnas: columnasClientes,
            opciones: opcionesGenericas
        }, mantenedorGrupos: {
            columnas: columnasGrupos,
            opciones: opcionesGenericasAsync
        }, mantenedorFases: {
            columnas: columnasFases,
            opciones: opcionesGenericas
        },
        mantenedorRoles: {
            columnas: columnasRoles,
            opciones: opcionesGenericas
        }
    };

    return {
        configuracionGrillas: configuracionGrillas
    };
});

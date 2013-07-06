
define(function () {

    var columnasRoles = [
        { headerText: "ID", rowText: "id_rol" },
        { headerText: "Rol", rowText: "nombre_rol" },
        { headerText: "IdEmpresa", rowText: "id_empresa" }
    ];

    var opcionesRoles = {
        pageSize: 4
    };

    var configuracionGrillas = {
        mantenedorRoles: {
            columnas: columnasRoles,
            opciones: opcionesRoles
        }
    };

    
    return {
        configuracionGrillas: configuracionGrillas
    };
});

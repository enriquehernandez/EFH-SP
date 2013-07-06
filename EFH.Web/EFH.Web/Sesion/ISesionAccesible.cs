using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EFH.Web.Sesion
{
    /// <summary>
    /// Define una interfaz que permite acceder a la información básica de sesión
    /// </summary>
    public interface ISesionAccesible
    {
        long varIdEmpresa { get; set; }
        object varEmpresa { get; set; }
        object varUsuarioConectado { get; set; }
        string varNombreUsuarioConectado { get; set; }
    }
}
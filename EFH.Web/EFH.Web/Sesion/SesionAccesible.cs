using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using EFH.Web.Models.BD;

namespace EFH.Web.Sesion
{
    public class MiSesionAccesible : ISesionAccesible
    {
        public MiSesionAccesible() { }

        #region sesion global
        public long varIdEmpresa
        {
            get
            {
                return (long)HttpContext.Current.Session["varIdEmpresa"];
            }
            set
            {
                HttpContext.Current.Session["varIdEmpresa"] = value;
            }
        }

        public object varEmpresa
        {
            get
            {
                return (object)HttpContext.Current.Session["varEmpresa"];
            }
            set
            {
                HttpContext.Current.Session["varEmpresa"] = value;
            }
        }

        public object varUsuarioConectado
        {
            get
            {
                return (object)HttpContext.Current.Session["varUsuarioConectado"];
            }
            set
            {
                HttpContext.Current.Session["varUsuarioConectado"] = value;
            }
        }

        public string varNombreUsuarioConectado
        {
            get
            {
                return (string)HttpContext.Current.Session["varNombreUsuarioConectado"];
            }
            set
            {
                HttpContext.Current.Session["varNombreUsuarioConectado"] = value;
            }
        }
        #endregion
    }
}
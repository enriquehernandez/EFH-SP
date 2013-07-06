using EFH.Web.Models.BD;
using EFH.Web.Sesion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EFH.Web.Controllers
{
    public class BaseController : Controller, Sesion.ISesionAccesible
    {
        private EFHEntities db = new EFHEntities();

        #region sesion global
        MiSesionAccesible MiSesion = new MiSesionAccesible();

        public long varIdEmpresa
        {
            get
            {
                try{
                    long retorno = MiSesion.varIdEmpresa;
                    return retorno;
                }
                catch
                {
                    var empresa = db.tb_empresa.AsEnumerable().Where(e => e.inactivo.Equals(false));
                    if (empresa.Count() > 0)
                    {
                        MiSesion.varIdEmpresa = empresa.SingleOrDefault().id_empresa;
                    }
                    return MiSesion.varIdEmpresa;
                }
            }
            set
            {
                MiSesion.varIdEmpresa = value;
            }
        }

        public object varEmpresa
        {
            get
            {
                if (MiSesion.varEmpresa != null)
                    return MiSesion.varEmpresa;
                else
                {
                    var empresa = db.tb_empresa.AsEnumerable().Where(e => e.inactivo.Equals(false));
                    if (empresa.Count() > 0)
                    {
                        MiSesion.varEmpresa = empresa.SingleOrDefault();
                    }
                    return MiSesion.varEmpresa;
                }
            }
            set
            {
                MiSesion.varEmpresa = value;
            }
        }

        public object varUsuarioConectado
        {
            get
            {
                if (MiSesion.varUsuarioConectado != null)
                    return MiSesion.varUsuarioConectado;
                else
                {
                    var usuarioConectado = db.tb_usuario.AsEnumerable().Where(e => e.email_usuario.Equals(User.Identity.Name));
                    if (usuarioConectado.Count() > 0)
                    {
                        MiSesion.varUsuarioConectado = usuarioConectado.SingleOrDefault();
                    }
                    return MiSesion.varUsuarioConectado;
                }
            }
            set
            {
                MiSesion.varUsuarioConectado = value;
            }
        }

        public string varNombreUsuarioConectado
        {
            get
            {
                if (!string.IsNullOrEmpty(MiSesion.varNombreUsuarioConectado))
                    return MiSesion.varNombreUsuarioConectado;
                else
                {
                    var usuarioConectado = db.tb_usuario.AsEnumerable().Where(e => e.email_usuario.Equals(User.Identity.Name));
                    if (usuarioConectado.Count() > 0)
                    {
                        MiSesion.varNombreUsuarioConectado = string.Format("{0} {1} {2}", usuarioConectado.SingleOrDefault().nombre_usuario, usuarioConectado.SingleOrDefault().ap_paterno_usuario, usuarioConectado.SingleOrDefault().ap_materno_usuario);
                    }
                    return MiSesion.varNombreUsuarioConectado;
                }
            }
            set
            {
                MiSesion.varNombreUsuarioConectado = value;
            }
        }
        #endregion
    }
}

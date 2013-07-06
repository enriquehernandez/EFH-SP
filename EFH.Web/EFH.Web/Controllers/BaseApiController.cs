using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Breeze.WebApi;
using EFH.Web.Models.BD;
using EFH.Web.Sesion;
using Newtonsoft.Json.Linq;

namespace EFH.Web.Controllers
{
    public class BaseApiController : ApiController
    {
        private EFHEntities db = new EFHEntities();

        #region sesion global
        public long varIdEmpresa
        {
            get
            {

                var empresa = db.tb_empresa.AsEnumerable().Where(e => e.inactivo.Equals(false));
                if (empresa.Count() > 0)
                {
                    return empresa.SingleOrDefault().id_empresa;
                }
                return 0;
            }
        }

        public object varEmpresa
        {
            get
            {
                var empresa = db.tb_empresa.AsEnumerable().Where(e => e.inactivo.Equals(false));
                if (empresa.Count() > 0)
                {
                    return empresa.SingleOrDefault();
                }
                return null;
            }
        }

        public long varIdUsuarioConectado
        {
            get
            {
                var usuarioConectado = db.tb_usuario.AsEnumerable().Where(e => e.email_usuario.Equals(User.Identity.Name));
                if (usuarioConectado.Count() > 0)
                {
                    return usuarioConectado.SingleOrDefault().id_usuario;
                }
                return 0;
            }
        }

        public object varUsuarioConectado
        {
            get
            {
                var usuarioConectado = db.tb_usuario.AsEnumerable().Where(e => e.email_usuario.Equals(User.Identity.Name));
                if (usuarioConectado.Count() > 0)
                {
                    return usuarioConectado.SingleOrDefault();
                }
                return null;
            }
        }

        public string varNombreUsuarioConectado
        {
            get
            {
                var usuarioConectado = db.tb_usuario.AsEnumerable().Where(e => e.email_usuario.Equals(User.Identity.Name));
                if (usuarioConectado.Count() > 0)
                {
                    return string.Format("{0} {1} {2}", usuarioConectado.SingleOrDefault().nombre_usuario, usuarioConectado.SingleOrDefault().ap_paterno_usuario, usuarioConectado.SingleOrDefault().ap_materno_usuario);
                }
                return "Error";
            }
        }
        #endregion
    }
}

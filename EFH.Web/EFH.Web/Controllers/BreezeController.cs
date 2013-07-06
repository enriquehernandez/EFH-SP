using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Breeze.WebApi;
using EFH.Web.Models.BD;
using Newtonsoft.Json.Linq;

namespace EFH.Web.Controllers
{
    [BreezeController]
    public class BreezeController : BaseApiController
    {
        readonly EFContextProvider<EFHEntities> _contextProvider = new EFContextProvider<EFHEntities>();
        private EFHEntities db = new EFHEntities();

        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        [HttpGet]
        public IQueryable<tb_usuario> UsuarioConectado()
        {
            return _contextProvider.Context.tb_usuario.Include("tb_detalle_agenda_telefonica")
                .Include("tb_agenda_telefonica").Where(e => e.email_usuario.Equals(User.Identity.Name));
        }
    }
}

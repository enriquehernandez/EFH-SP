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
    public class GenericoController : BaseApiController
    {
        readonly EFContextProvider<EFHEntities> _contextProvider = new EFContextProvider<EFHEntities>();
        //private EFHEntities db = new EFHEntities();

        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        [HttpGet]
        public IQueryable<tb_usuario> UsuarioConectado()
        {
            return _contextProvider.Context.tb_usuario.Where(e => e.email_usuario.Equals(User.Identity.Name));
        }

        [HttpGet]
        public IQueryable<tb_empresa> EmpresaActual()
        {
            return _contextProvider.Context.tb_empresa.Where(e => e.id_empresa.Equals(varIdEmpresa));
        }

        [HttpGet]
        public IQueryable<tb_tipo_grupo> GetTiposGrupos()
        {
            return _contextProvider.Context.tb_tipo_grupo.Where(g => g.id_empresa.Equals(varIdEmpresa));
        }

        [HttpGet]
        public IQueryable<tb_usuario> GetResponsablesProyecto()
        {
            List<long> idesGrupos = _contextProvider.Context.tb_grupo.AsEnumerable().Where(g => Convert.ToInt64(g.id_tipo_grupo).Equals(2)).Select(g => Convert.ToInt64(g.id_grupo)).ToList();
            List<long> idesUsuarios = _contextProvider.Context.tb_grupo_usuario.AsEnumerable().Where(g => g.id_empresa.Equals(varIdEmpresa) && idesGrupos.Contains(g.id_grupo)).Select(g => Convert.ToInt64(g.id_usuario)).ToList();
            return _contextProvider.Context.tb_usuario.Where(g => g.id_empresa.Equals(varIdEmpresa)
                && idesUsuarios.Contains(g.id_usuario));
        }

        [HttpGet]
        public IQueryable<tb_usuario> GetResponsablesCliente()
        {
            List<long> idesGrupos = _contextProvider.Context.tb_grupo.AsEnumerable().Where(g => Convert.ToInt64(g.id_tipo_grupo).Equals(3)).Select(g => Convert.ToInt64(g.id_grupo)).ToList();
            List<long> idesUsuarios = _contextProvider.Context.tb_grupo_usuario.AsEnumerable().Where(g => g.id_empresa.Equals(varIdEmpresa) && idesGrupos.Contains(g.id_grupo)).Select(g => Convert.ToInt64(g.id_usuario)).ToList();
            return _contextProvider.Context.tb_usuario.Where(g => g.id_empresa.Equals(varIdEmpresa)
                && idesUsuarios.Contains(g.id_usuario));
        }
    }
}


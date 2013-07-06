using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
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
    public class MantenedorController : BaseApiController
    {
        readonly EFContextProvider<EFHEntities> _contextProvider = new EFContextProvider<EFHEntities>();
        private EFHEntities db = new EFHEntities();

        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        #region Usuario
        [HttpGet]
        public IQueryable<tb_usuario> GetUsuarios()
        {
            return _contextProvider.Context.tb_usuario.Where(u => u.id_empresa.Equals(varIdEmpresa));
        }

        [HttpPut]
        [ActionName("UpdateUsuario")]
        public HttpResponseMessage UpdateUsuario(long id, tb_usuario tb_usuario)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != tb_usuario.id_usuario)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            db.Entry(tb_usuario).State = System.Data.EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpPost]
        [ActionName("AddUsuario")]
        public HttpResponseMessage AddUsuario(tb_usuario tb_usuario)
        {
            if (ModelState.IsValid)
            {
                db.tb_usuario.Add(tb_usuario);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, tb_usuario);
                response.Headers.Location = new Uri(Url.Link("BreezeApi", new { id = tb_usuario.id_usuario }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        [HttpDelete]
        [ActionName("DelUsuario")]
        public HttpResponseMessage DelUsuario(long id)
        {
            tb_usuario tb_usuario = db.tb_usuario.Find(id);
            if (tb_usuario == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.tb_usuario.Remove(tb_usuario);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, tb_usuario);
        }
        #endregion

        #region Cliente
        [HttpGet]
        public IQueryable<tb_cliente_empresa> GetClientes()
        {
            return _contextProvider.Context.tb_cliente_empresa.Where(u => u.id_empresa.Equals(varIdEmpresa));
        }

        [HttpPut]
        [ActionName("UpdateCliente")]
        public HttpResponseMessage UpdateCliente(long id, tb_cliente_empresa tb_cliente_empresa)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != tb_cliente_empresa.id_cliente)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            db.Entry(tb_cliente_empresa).State = System.Data.EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpPost]
        [ActionName("AddCliente")]
        public HttpResponseMessage AddCliente(tb_cliente_empresa tb_cliente_empresa)
        {
            if (ModelState.IsValid)
            {
                db.tb_cliente_empresa.Add(tb_cliente_empresa);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, tb_cliente_empresa);
                response.Headers.Location = new Uri(Url.Link("BreezeApi", new { id = tb_cliente_empresa.id_cliente }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        [HttpDelete]
        [ActionName("DelCliente")]
        public HttpResponseMessage DelCliente(long id)
        {
            tb_cliente_empresa tb_cliente_empresa = db.tb_cliente_empresa.Find(id);
            if (tb_cliente_empresa == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.tb_cliente_empresa.Remove(tb_cliente_empresa);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, tb_cliente_empresa);
        }
        #endregion

        #region Grupo
        [HttpGet]
        public IQueryable<tb_grupo> GetGrupos()
        {
            return _contextProvider.Context.tb_grupo.Where(u => u.id_empresa.Equals(varIdEmpresa));
        }

        [HttpPut]
        [ActionName("UpdateGrupo")]
        public HttpResponseMessage UpdateGrupo(long id, tb_grupo tb_grupo)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != tb_grupo.id_grupo)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            db.Entry(tb_grupo).State = System.Data.EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpPost]
        [ActionName("AddGrupo")]
        public HttpResponseMessage AddGrupo(tb_grupo tb_grupo)
        {
            if (ModelState.IsValid)
            {
                db.tb_grupo.Add(tb_grupo);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, tb_grupo);
                response.Headers.Location = new Uri(Url.Link("BreezeApi", new { id = tb_grupo.id_grupo }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        [HttpDelete]
        [ActionName("DelGrupo")]
        public HttpResponseMessage DelGrupo(long id)
        {
            tb_grupo tb_grupo = db.tb_grupo.Find(id);
            if (tb_grupo == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.tb_grupo.Remove(tb_grupo);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, tb_grupo);
        }
        #endregion

        #region Rol
        [HttpGet]
        public IQueryable<tb_roles> GetRoles()
        {
            return _contextProvider.Context.tb_roles.Where(r => r.id_empresa.Equals(varIdEmpresa));
        }

        // PUT api/PruebaRoles/UpdateRol/5
        [HttpPut]
        [ActionName("UpdateRol")]
        public HttpResponseMessage UpdateRol(long id, tb_roles tb_roles)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != tb_roles.id_rol)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            db.Entry(tb_roles).State = System.Data.EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        // POST api/PruebaRoles
        [HttpPost]
        [ActionName("AddRol")]
        public HttpResponseMessage AddRol(tb_roles tb_roles)
        {
            if (ModelState.IsValid)
            {
                db.tb_roles.Add(tb_roles);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, tb_roles);
                response.Headers.Location = new Uri(Url.Link("BreezeApi", new { id = tb_roles.id_rol }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        // DELETE api/PruebaRoles/5
        [HttpDelete]
        [ActionName("DelRol")]
        public HttpResponseMessage DelRol(long id)
        {
            tb_roles tb_roles = db.tb_roles.Find(id);
            if (tb_roles == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.tb_roles.Remove(tb_roles);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, tb_roles);
        }
        #endregion

        #region Fase
        [HttpGet]
        public IQueryable<tb_fases_proyecto> GetFases()
        {
            return _contextProvider.Context.tb_fases_proyecto.Where(f => f.id_empresa.Equals(varIdEmpresa));
        }

        [HttpPut]
        [ActionName("UpdateFase")]
        public HttpResponseMessage UpdateFase(long id, tb_fases_proyecto tb_fases_proyecto)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != tb_fases_proyecto.id_fase_proyecto)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            db.Entry(tb_fases_proyecto).State = System.Data.EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HttpPost]
        [ActionName("AddFase")]
        public HttpResponseMessage AddFase(tb_fases_proyecto tb_fases_proyecto)
        {
            if (ModelState.IsValid)
            {
                db.tb_fases_proyecto.Add(tb_fases_proyecto);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, tb_fases_proyecto);
                response.Headers.Location = new Uri(Url.Link("BreezeApi", new { id = tb_fases_proyecto.id_fase_proyecto }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        // DELETE api/PruebaRoles/5
        [HttpDelete]
        [ActionName("DelFase")]
        public HttpResponseMessage DelFase(long id)
        {
            tb_fases_proyecto tb_fases_proyecto = db.tb_fases_proyecto.Find(id);
            if (tb_fases_proyecto == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.tb_fases_proyecto.Remove(tb_fases_proyecto);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, tb_fases_proyecto);
        }
        #endregion

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}

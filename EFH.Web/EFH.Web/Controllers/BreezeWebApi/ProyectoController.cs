using System;
using System.Collections.Generic;
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
    public class ProyectoController : BaseApiController
    {
        readonly EFContextProvider<EFHEntities> _contextProvider = new EFContextProvider<EFHEntities>();
        private EFHEntities db = new EFHEntities();

        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        //[HttpGet]
        //public IQueryable<tb_estado_proyecto_kanban> GetEstadosKanbanProyecto()
        //{

        //    var estados = _contextProvider.Context.tb_estado_proyecto_kanban.Where(p => p.id_empresa.Equals(varIdEmpresa)).OrderBy(p => p.orden);
        //    foreach (var e in estados)
        //    {
        //        var proyectos =_contextProvider.Context.tb_proyecto.Where(p => p.id_estado_proyecto_kanban.Equals(e.id_estado_proyecto_kanban));
        //        foreach (var p in proyectos)
        //        {
        //            e.tb_proyecto.Add(p);
        //        }
        //    }
        //    return estados;
        //}

        [HttpGet]
        public IQueryable<CustomModel.KanbanProyectoTO> GetKanbanProyectoTO()
        {
            try
            {
                List<CustomModel.KanbanProyectoTO> listKanban = new List<CustomModel.KanbanProyectoTO>();

                var estados = _contextProvider.Context.tb_estado_proyecto_kanban.Where(p => p.id_empresa.Equals(varIdEmpresa)).OrderBy(p => p.orden);
                foreach (var e in estados)
                {
                    CustomModel.KanbanProyectoTO kanban = new CustomModel.KanbanProyectoTO();
                    kanban.kanbanProyecto = e;
                    kanban.proyectos = new List<CustomModel.ProyectoTO>();
                    var proyectos = _contextProvider.Context.tb_proyecto.Where(p => p.id_estado_proyecto_kanban.Equals(e.id_estado_proyecto_kanban));
                    foreach (var p in proyectos)
                    {
                        long id_responsable_proyecto = Convert.ToInt64(p.id_responsable_proyecto);
                        long id_responsable_proyecto_cliente = Convert.ToInt64(p.id_responsable_proyecto_cliente);
                        long id_usuario_creador = Convert.ToInt64(p.id_usuario_creador);
                        CustomModel.ProyectoTO proyecto = new CustomModel.ProyectoTO();
                        proyecto.proyecto = p;
                        var tabla = _contextProvider.Context.tb_usuario.Where(u => u.id_usuario.Equals(id_responsable_proyecto));
                        proyecto.nombreResponsable = FormatoNombreUsuario(_contextProvider.Context.tb_usuario.Where(u => u.id_usuario.Equals(id_responsable_proyecto)).Single());
                        proyecto.nombreResponsableCliente = FormatoNombreUsuario(_contextProvider.Context.tb_usuario.Where(u => u.id_usuario.Equals(id_responsable_proyecto_cliente)).Single());
                        proyecto.nombreCreador = FormatoNombreUsuario(_contextProvider.Context.tb_usuario.Where(u => u.id_usuario.Equals(id_usuario_creador)).Single());
                        proyecto.nombreCliente = _contextProvider.Context.tb_cliente_empresa.Where(c => c.id_cliente.Equals(p.id_cliente)).Single().nombre_cliente;
                        proyecto.nemoCliente = _contextProvider.Context.tb_cliente_empresa.Where(c => c.id_cliente.Equals(p.id_cliente)).Single().nemo;
                        kanban.proyectos.Add(proyecto);
                    }

                    listKanban.Add(kanban);
                }
                return listKanban.AsQueryable();
            }
            catch(Exception ex) {
                throw ex;
            }
        }

        [HttpGet]
        public IQueryable<CustomModel.KanbanProyectoTO> GetKanbanProyectoTO(string Filtro)
        {
            try
            {
                List<CustomModel.KanbanProyectoTO> listKanban = new List<CustomModel.KanbanProyectoTO>();

                var estados = _contextProvider.Context.tb_estado_proyecto_kanban.Where(p => p.id_empresa.Equals(varIdEmpresa)).OrderBy(p => p.orden);
                foreach (var e in estados)
                {
                    CustomModel.KanbanProyectoTO kanban = new CustomModel.KanbanProyectoTO();
                    kanban.kanbanProyecto = e;
                    kanban.proyectos = new List<CustomModel.ProyectoTO>();
                    var proyectos = _contextProvider.Context.tb_proyecto.Where(p => p.id_estado_proyecto_kanban.Equals(e.id_estado_proyecto_kanban));
                    foreach (var p in proyectos)
                    {
                        if (p.nombre_proyecto.ToUpper().Contains(Filtro.ToUpper()))
                        {
                            long id_responsable_proyecto = Convert.ToInt64(p.id_responsable_proyecto);
                            long id_responsable_proyecto_cliente = Convert.ToInt64(p.id_responsable_proyecto_cliente);
                            long id_usuario_creador = Convert.ToInt64(p.id_usuario_creador);
                            CustomModel.ProyectoTO proyecto = new CustomModel.ProyectoTO();
                            proyecto.proyecto = p;
                            var tabla = _contextProvider.Context.tb_usuario.Where(u => u.id_usuario.Equals(id_responsable_proyecto));
                            proyecto.nombreResponsable = FormatoNombreUsuario(_contextProvider.Context.tb_usuario.Where(u => u.id_usuario.Equals(id_responsable_proyecto)).Single());
                            proyecto.nombreResponsableCliente = FormatoNombreUsuario(_contextProvider.Context.tb_usuario.Where(u => u.id_usuario.Equals(id_responsable_proyecto_cliente)).Single());
                            proyecto.nombreCreador = FormatoNombreUsuario(_contextProvider.Context.tb_usuario.Where(u => u.id_usuario.Equals(id_usuario_creador)).Single());
                            proyecto.nombreCliente = _contextProvider.Context.tb_cliente_empresa.Where(c => c.id_cliente.Equals(p.id_cliente)).Single().nombre_cliente;
                            proyecto.nemoCliente = _contextProvider.Context.tb_cliente_empresa.Where(c => c.id_cliente.Equals(p.id_cliente)).Single().nemo;
                            kanban.proyectos.Add(proyecto);
                        }
                    }

                    listKanban.Add(kanban);
                }
                return listKanban.AsQueryable();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPut]
        [ActionName("UpdateEstadoProyectoKanban")]
        public HttpResponseMessage UpdateEstadoProyectoKanban(long id, tb_proyecto tb_proyecto2)
        {
            tb_proyecto tb_proyecto = db.tb_proyecto.Find(id);
            if (tb_proyecto == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            tb_proyecto.id_estado_proyecto_kanban = tb_proyecto2.id_estado_proyecto_kanban;
            db.Entry(tb_proyecto).State = System.Data.EntityState.Modified;
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, tb_proyecto);
        }

        [HttpPut]
        [ActionName("UpdateProyecto")]
        public HttpResponseMessage UpdateProyecto(long id, tb_proyecto tb_proyecto2)
        {
            tb_proyecto tb_proyecto = db.tb_proyecto.Find(id);
            if (tb_proyecto == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            tb_proyecto.nombre_proyecto = tb_proyecto2.nombre_proyecto;
            tb_proyecto.descripcion_proyecto = tb_proyecto2.descripcion_proyecto;
            tb_proyecto.fecha_inicio_estimado = tb_proyecto2.fecha_inicio_estimado;
            tb_proyecto.id_responsable_proyecto = tb_proyecto2.id_responsable_proyecto;
            tb_proyecto.id_responsable_proyecto_cliente = tb_proyecto2.id_responsable_proyecto_cliente;
            tb_proyecto.id_cliente = tb_proyecto2.id_cliente;
            tb_proyecto.horas_estimadas = tb_proyecto2.horas_estimadas;

            db.Entry(tb_proyecto).State = System.Data.EntityState.Modified;
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, tb_proyecto);
        }

        [HttpPost]
        [ActionName("AddProyecto")]
        public HttpResponseMessage AddProyecto(tb_proyecto tb_proyecto)
        {
            tb_proyecto.inactivo = false;
            tb_proyecto.fecha_creacion = DateTime.Now;
            tb_proyecto.es_tutorial = false;
            tb_proyecto.id_usuario_creador = varIdUsuarioConectado;

            if (ModelState.IsValid)
            {
                db.tb_proyecto.Add(tb_proyecto);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, tb_proyecto);
                response.Headers.Location = new Uri(Url.Link("BreezeApi", new { id = tb_proyecto.id_proyecto }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        private string FormatoNombreUsuario(tb_usuario user)
        {
            return string.Format("{0} {1}", user.nombre_usuario, user.ap_paterno_usuario);
        }
        private string FormatoNombreUsuarioFull(tb_usuario user)
        {
            return string.Format("{0} {1} {2}", user.nombre_usuario, user.ap_paterno_usuario, user.ap_materno_usuario);
        }
    }
}

namespace EFH.Web.Controllers.CustomModel
{
    using System;
    using System.Collections.Generic;
    
    public class KanbanProyectoTO
    {
        public tb_estado_proyecto_kanban kanbanProyecto { get; set; }
        public List<ProyectoTO> proyectos { get; set; }
    }

    public class ProyectoTO
    {
        public tb_proyecto proyecto { get; set; }
        public string nombreResponsable { get; set; }
        public string nombreResponsableCliente { get; set; }
        public string nombreCreador { get; set; }
        public string nombreCliente { get; set; }
        public string nemoCliente { get; set; }
    }
}
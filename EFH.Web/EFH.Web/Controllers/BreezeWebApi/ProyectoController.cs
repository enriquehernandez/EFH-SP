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

        #region Proyectos
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
                        //var tabla = _contextProvider.Context.tb_usuario.Where(u => u.id_usuario.Equals(id_responsable_proyecto));
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
            catch (Exception ex)
            {
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

        #endregion

        #region Tareas
        [HttpGet]
        public IQueryable<CustomModel.KanbanTareaTO> GetKanbanTareaTO(long idProyecto, string nombreTarea)
        {
            try
            {
                List<CustomModel.KanbanTareaTO> listKanban = new List<CustomModel.KanbanTareaTO>();

                var estados = _contextProvider.Context.tb_estado_tarea_kanban.Where(t => t.id_empresa.Equals(varIdEmpresa)).OrderBy(t => t.orden);
                foreach (var e in estados)
                {
                    CustomModel.KanbanTareaTO kanban = new CustomModel.KanbanTareaTO();
                    kanban.kanbanTarea = e;
                    kanban.tareas = new List<CustomModel.TareaTO>();
                    var tareas = _contextProvider.Context.tb_tarea.Where(t =>
                        t.id_proyecto.Equals(idProyecto) &&
                        t.id_estado_tarea_kanban.Equals(e.id_estado_tarea_kanban));
                    foreach (var t in tareas)
                    {
                        if (string.IsNullOrEmpty(nombreTarea) || t.nombre_tarea.ToUpper().Contains(nombreTarea.ToUpper()))
                        {
                            long id_responsable_tarea = Convert.ToInt64(t.id_responsable_tarea);
                            long id_usuario_creador = Convert.ToInt64(t.id_usuario_creador);
                            
                            CustomModel.TareaTO tarea = new CustomModel.TareaTO();
                            tarea.tarea = t;
                            //var tabla = _contextProvider.Context.tb_usuario.Where(u => u.id_usuario.Equals(id_responsable_proyecto));
                            tarea.nombreResponsable = FormatoNombreUsuario(_contextProvider.Context.tb_usuario.Where(u => u.id_usuario.Equals(id_responsable_tarea)).Single());
                            tarea.nombreCreador = FormatoNombreUsuario(_contextProvider.Context.tb_usuario.Where(u => u.id_usuario.Equals(id_usuario_creador)).Single());
                            try
                            {
                                long id_historia = Convert.ToInt64(t.id_historia);
                                tarea.codigo = _contextProvider.Context.tb_historia_usuario.Where(h => h.id_historia.Equals(id_historia)).Single().codigo + "-" + t.id_tarea.ToString();
                            }
                            catch
                            {
                                tarea.codigo = t.id_tarea.ToString();
                            }
                            kanban.tareas.Add(tarea);
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
        [ActionName("UpdateEstadoTareaKanban")]
        public HttpResponseMessage UpdateEstadoTareaKanban(long id, tb_tarea tb_tarea2)
        {
            tb_tarea tb_tarea = db.tb_tarea.Find(id);
            if (tb_tarea == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            tb_tarea.id_estado_tarea_kanban = tb_tarea2.id_estado_tarea_kanban;
            db.Entry(tb_tarea).State = System.Data.EntityState.Modified;
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, tb_tarea);
        }
        #endregion

        #region Historias
        [HttpGet]
        public IQueryable<CustomModel.HistoriaTO> GetHistoriasTO(long idProyecto)
        {
            try
            {
                List<CustomModel.HistoriaTO> listHistorias = new List<CustomModel.HistoriaTO>();

                var historias = _contextProvider.Context.tb_historia_usuario.Where(h => h.id_proyecto.Equals(idProyecto)).OrderBy(h => h.orden);
                foreach (var h in historias)
                {

                    long id_responsable = Convert.ToInt64(h.id_responsable);
                    long id_usuario_creador = Convert.ToInt64(h.id_usuario_creador);
                    CustomModel.HistoriaTO historia = new CustomModel.HistoriaTO();
                    historia.historia = h;
                    //var tabla = _contextProvider.Context.tb_usuario.Where(u => u.id_usuario.Equals(id_responsable_proyecto));
                    historia.nombreResponsable = FormatoNombreUsuario(_contextProvider.Context.tb_usuario.Where(u => u.id_usuario.Equals(id_responsable)).Single());
                    historia.nombreCreador = FormatoNombreUsuario(_contextProvider.Context.tb_usuario.Where(u => u.id_usuario.Equals(id_usuario_creador)).Single());
                    listHistorias.Add(historia);
                }
                return listHistorias.AsQueryable();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPut]
        [ActionName("UpdateHistoria")]
        public HttpResponseMessage UpdateHistoria(long id, tb_historia_usuario tb_historia_usuario2)
        {
            tb_historia_usuario tb_historia_usuario = db.tb_historia_usuario.Find(id);
            if (tb_historia_usuario == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            tb_historia_usuario.codigo = tb_historia_usuario2.codigo;
            tb_historia_usuario.titulo = tb_historia_usuario2.titulo;
            tb_historia_usuario.descripcion = tb_historia_usuario2.descripcion;
            tb_historia_usuario.id_responsable = tb_historia_usuario2.id_responsable;
            tb_historia_usuario.horas_estimadas = tb_historia_usuario2.horas_estimadas;

            db.Entry(tb_historia_usuario).State = System.Data.EntityState.Modified;
            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, tb_historia_usuario);
        }
        #endregion

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

    #region Proyectos
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
    #endregion

    #region Tareas
    public class KanbanTareaTO
    {
        public tb_estado_tarea_kanban kanbanTarea { get; set; }
        public List<TareaTO> tareas { get; set; }
    }

    public class TareaTO
    {
        public tb_tarea tarea { get; set; }
        public string nombreResponsable { get; set; }
        public string nombreCreador { get; set; }
        public string codigo { get; set; }
    }
    #endregion

    #region Historias
    public class HistoriaTO
    {
        public tb_historia_usuario historia { get; set; }
        public string nombreResponsable { get; set; }
        public string nombreCreador { get; set; }
    }
    #endregion

}
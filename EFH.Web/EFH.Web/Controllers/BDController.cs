using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using EFH.Web.Models.BD;

namespace EFH.Web.Controllers
{
    public class BDController : ApiController
    {
        private EFHEntities db = new EFHEntities();

        // GET api/BD
        public IEnumerable<tb_empresa> Gettb_empresa()
        {
            return db.tb_empresa.AsEnumerable();
        }

        // GET api/BD/5
        public tb_empresa Gettb_empresa(long id)
        {
            tb_empresa tb_empresa = db.tb_empresa.Find(id);
            if (tb_empresa == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return tb_empresa;
        }

        // PUT api/BD/5
        public HttpResponseMessage Puttb_empresa(long id, tb_empresa tb_empresa)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != tb_empresa.id_empresa)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            db.Entry(tb_empresa).State = EntityState.Modified;

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

        // POST api/BD
        public HttpResponseMessage Posttb_empresa(tb_empresa tb_empresa)
        {
            if (ModelState.IsValid)
            {
                db.tb_empresa.Add(tb_empresa);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, tb_empresa);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = tb_empresa.id_empresa }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        // DELETE api/BD/5
        public HttpResponseMessage Deletetb_empresa(long id)
        {
            tb_empresa tb_empresa = db.tb_empresa.Find(id);
            if (tb_empresa == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.tb_empresa.Remove(tb_empresa);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, tb_empresa);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}
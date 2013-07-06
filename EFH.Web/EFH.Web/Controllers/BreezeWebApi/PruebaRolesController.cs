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

namespace EFH.Web.Controllers.BreezeWebApi
{
    public class PruebaRolesController : ApiController
    {
        private EFHEntities db = new EFHEntities();

        // GET api/PruebaRoles
        public IEnumerable<tb_roles> Gettb_roles()
        {
            var tb_roles = db.tb_roles.Include(t => t.tb_empresa);
            return tb_roles.AsEnumerable();
        }

        // GET api/PruebaRoles/5
        public tb_roles Gettb_roles(long id)
        {
            tb_roles tb_roles = db.tb_roles.Find(id);
            if (tb_roles == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return tb_roles;
        }

        // PUT api/PruebaRoles/5
        public HttpResponseMessage Puttb_roles(long id, tb_roles tb_roles)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != tb_roles.id_rol)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            db.Entry(tb_roles).State = EntityState.Modified;

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
        public HttpResponseMessage Posttb_roles(tb_roles tb_roles)
        {
            if (ModelState.IsValid)
            {
                db.tb_roles.Add(tb_roles);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, tb_roles);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = tb_roles.id_rol }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        // DELETE api/PruebaRoles/5
        public HttpResponseMessage Deletetb_roles(long id)
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

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}
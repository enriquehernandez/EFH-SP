using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using EFH.Web.Models.BD;

namespace EFH.Web.Controllers
{
    public class HomeController : BaseController
    {
        private EFHEntities db = new EFHEntities();

        public ActionResult Index()
        {
            //Iniciar empresas asincronamente, significa agregar plantillas a esta
            Helper.Generico helper = new Helper.Generico();
            helper.IniciarEmpresasPrincipal();


            var empresa = db.tb_empresa.AsEnumerable().Where(e => e.inactivo.Equals(false));
            if (empresa.Count() > 0)
            {
                varEmpresa = empresa.SingleOrDefault();
                ViewBag.Empresa = ((tb_empresa)varEmpresa).nombre_empresa;
            }
            else
                ViewBag.Empresa = "Debe agregar una Empresa";
            
            ViewBag.Message = "";
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";
            ViewBag.Empresa = ((tb_empresa)varEmpresa).nombre_empresa;

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";
            ViewBag.Empresa = ((tb_empresa)varEmpresa).nombre_empresa;
            return View();
        }
    }
}

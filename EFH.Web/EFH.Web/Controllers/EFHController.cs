using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using EFH.Web.Helper;

namespace EFH.Web.Controllers
{
    [NoCache]
    [Authorize]
    public class EFHController : Controller
    {
        //
        // GET: /EFH/
        public ActionResult Index()
        {
            return View();
        }

    }
}

using System.Web.Mvc;

namespace EFH.Web.Controllers
{
    [Authorize(Roles = "CEO,HR")]
    public class HotTowelController : Controller
    {
        //
        // GET: /HotTowel/

        public ActionResult Index()
        {
            return View();
        }

    }
}

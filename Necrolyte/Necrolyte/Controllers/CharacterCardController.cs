using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Necrolyte.Controllers
{
    public class CharacterCardController : Controller
    {
        //
        // GET: /CharacterCard/

        public ActionResult Index()
        {
            return View();
        }

    }
}

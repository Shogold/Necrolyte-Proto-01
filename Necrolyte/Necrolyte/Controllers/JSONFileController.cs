using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Necrolyte.Controllers
{
    public class JSONFileController : Controller
    {
        [HttpPost]
        public ActionResult Save(string JSONData, string fileName)
        {
            Session["TempFile"] = JSONData;
            Session["TempFileName"] = (fileName == null ? "File.TXT" : Path.ChangeExtension(fileName, "TXT"));
            return new EmptyResult();
            
        }
        public ActionResult Save()
        {
            var contentDisposition = "attachment; filename=\"" + Session["TempFileName"].ToString() + "\"";
            HttpContext.Response.AddHeader("Content-Disposition", contentDisposition);

            return File(Encoding.UTF8.GetBytes(Session["TempFile"].ToString()),
                 System.Net.Mime.MediaTypeNames.Application.Octet);
        }
        [HttpPost]
        public ActionResult Load(HttpPostedFileBase file)
        {
            if (file != null)
            {
                StreamReader reader = new StreamReader(file.InputStream);
                string text = reader.ReadToEnd();
                return new ContentResult { Content = text, ContentType = "application/json" };
            }
            return new EmptyResult();
        }

    }
}

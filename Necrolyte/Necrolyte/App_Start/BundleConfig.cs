using System.Web;
using System.Web.Optimization;

namespace Necrolyte
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            var generalScriptBundler = new ScriptBundle("~/bundles/scripts").Include(
                "~/Scripts/jquery.js");
            generalScriptBundler.Include(
                "~/Scripts/jquery.minicolors.js",
                "~/Scripts/knockout-2.2.1.js",
                "~/Scripts/knockout.mapping-latest.js",
                "~/Scripts/jquery.form.js",
                "~/Scripts/jquery.fileDownload.js",
                "~/Scripts/Util.js",
                "~/Scripts/owenge.equation-beta.js");
            bundles.Add(generalScriptBundler);

            bundles.Add(new ScriptBundle("~/bundles/scripts/dice").Include("~/Scripts/DiceViewModel.js"));
            bundles.Add(new ScriptBundle("~/bundles/scripts/characterCard").Include("~/Scripts/CharacterCardViewModel.js"));
            bundles.Add(new ScriptBundle("~/bundles/scripts/codex").Include("~/Scripts/CharacterCardViewModel.js", "~/Scripts/Codex.js"));

            bundles.Add(new StyleBundle("~/bundles/styles").Include(
                "~/Content/Necrolyte.css",
                "~/Content/jquery.minicolors.css",
                "~/Content/jQueryUI/jquery-ui-1.8.18.custom.css"
                ));
        }
    }
}
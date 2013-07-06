using System;
using System.Web.Optimization;

namespace EFH.Web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.IgnoreList.Clear();
            AddDefaultIgnorePatterns(bundles.IgnoreList);

            bundles.Add(
              new ScriptBundle("~/scripts/vendor")
                .Include("~/scripts/jquery-{version}.js")
                .Include("~/scripts/jquery-ui-{version}.js")
                .Include("~/scripts/knockout-{version}.debug.js")
                .Include("~/scripts/sammy-{version}.js")
                .Include("~/scripts/toastr.js")
                .Include("~/scripts/Q.js")
                .Include("~/scripts/breeze.debug.js")
                .Include("~/scripts/bootstrap.js")
                .Include("~/scripts/moment.js")
                .Include("~/scripts/configuraciones.js")
              );

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(
              new StyleBundle("~/Content/css")
                .Include("~/Content/themes/base/jquery.ui*")
                .Include("~/Content/ie10mobile.css")
                .Include("~/Content/bootstrap.css")
                .Include("~/Content/bootstrap-responsive.css")
                .Include("~/Content/durandal.css")
                .Include("~/Content/toastr.css")
                .Include("~/Content/font-awesome*")
                .Include("~/Content/app.css")
              );

            bundles.Add(
              new ScriptBundle("~/scripts/tool")
                .Include("~/scripts/jquery.event.drag*")
                .Include("~/scripts/SlickGrid/slick*")
                .Include("~/scripts/SlickGrid/Controls/slick*")
                .Include("~/scripts/SlickGrid/Plugins/slick*")
                .Include("~/scripts/linq*")
                .Include("~/scripts/libs/qtip2/jquery.qtip.min.js")
                .Include("~/scripts/plugin/jshashtable.js")
                .Include("~/scripts/plugin/jquery.numberformatter-1.2.3.jsmin.js")
                .Include("~/scripts/knockout.validation.js")
                .Include("~/scripts/Localization/es-ES.js")
                .Include("~/scripts/i18n/jquery.ui.datepicker-es.js")
              );

            bundles.Add(
              new StyleBundle("~/Content/tool")
                //.Include("~/Content/bootstrapThemes/flatly/bootstrap*")
                .Include("~/Content/slick*")
                .Include("~/scripts/libs/qtip2/jquery.qtip.min.css")
                .Include("~/Content/kanban/tasks.css")
              );
        }

        public static void AddDefaultIgnorePatterns(IgnoreList ignoreList)
        {
            if (ignoreList == null)
            {
                throw new ArgumentNullException("ignoreList");
            }

            ignoreList.Ignore("*.intellisense.js");
            ignoreList.Ignore("*-vsdoc.js");

            //ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
            //ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
            //ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
        }
    }
}
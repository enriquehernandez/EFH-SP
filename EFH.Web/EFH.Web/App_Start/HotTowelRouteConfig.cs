using System.Web.Mvc;

[assembly: WebActivator.PreApplicationStartMethod(
    typeof(EFH.Web.App_Start.HotTowelRouteConfig), "RegisterHotTowelPreStart", Order = 2)]

namespace EFH.Web.App_Start {
  ///<summary>
  /// Inserts the HotTowel SPA sample view controller to the front of all MVC routes
  /// so that the HotTowel SPA sample becomes the default page.
  ///</summary>
  ///<remarks>
  /// This class is discovered and run during startup
  /// http://blogs.msdn.com/b/davidebb/archive/2010/10/11/light-up-your-nupacks-with-startup-code-and-webactivator.aspx
  ///</remarks>
  public static class HotTowelRouteConfig {

    public static void RegisterHotTowelPreStart() {

      // Preempt standard default MVC page routing to go to HotTowel Sample
      System.Web.Routing.RouteTable.Routes.MapRoute(
          name: "EFHMvc",
          url: "{controller}/{action}/{id}",
          defaults: new
          {
              controller = "EFH",
              action = "Index",
              id = UrlParameter.Optional
          }
      );
    }
  }
}
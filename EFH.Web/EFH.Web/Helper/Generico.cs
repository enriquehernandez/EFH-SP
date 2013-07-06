using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Web.Http;
using EFH.Web.Models.BD;
using NLog;

namespace EFH.Web.Helper
{
    public class Generico : ApiController, IDisposable
    {
        private EFHEntities db = new EFHEntities();

        public void IniciarEmpresasPrincipal()
        {
            logger.Info("IniciarEmpresasAsync");
            IniciarEmpresasBD();

            
        }

        public async void IniciarEmpresas()
        {
            logger.Info("IniciarEmpresasAsync");
            await IniciarEmpresasAsync();
        }

        // The following method runs asynchronously. The UI thread is not
        // blocked during the delay. You can move or resize the Form1 window 
        // while Task.Delay is running.
        private async Task IniciarEmpresasAsync()
        {
            await Task.Delay(2000);
            IniciarEmpresasBD();
        }

        private void IniciarEmpresasBD()
        {
            var empresas = db.tb_empresa.AsEnumerable().Where(e=>e.iniciada.Equals(false)).ToList();
            foreach (tb_empresa e in empresas)
            {
                db.efh_sp_iniciar_empresa(e.id_empresa);
            }
        }

        private static Logger logger = LogManager.GetCurrentClassLogger();


        //public void Dispose()
        //{
        //    db.Dispose();
        //    //throw new NotImplementedException();
        //    base.Dispose(true);
        //}
        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}
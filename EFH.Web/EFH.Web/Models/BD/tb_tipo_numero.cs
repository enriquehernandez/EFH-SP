//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace EFH.Web.Models.BD
{
    using System;
    using System.Collections.Generic;
    
    public partial class tb_tipo_numero
    {
        public tb_tipo_numero()
        {
            this.tb_agenda_telefonica = new HashSet<tb_agenda_telefonica>();
        }
    
        public int id_tipo_numero { get; set; }
        public string tipo_numero { get; set; }
    
        public virtual ICollection<tb_agenda_telefonica> tb_agenda_telefonica { get; set; }
    }
}
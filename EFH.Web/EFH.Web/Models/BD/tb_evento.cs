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
    
    public partial class tb_evento
    {
        public long id_evento { get; set; }
        public Nullable<System.DateTime> fecha_evento { get; set; }
        public string nombre_evento { get; set; }
        public string detalle_evento { get; set; }
        public Nullable<bool> inactivo { get; set; }
        public Nullable<long> usuario_creador { get; set; }
        public Nullable<System.DateTime> fecha_creacion { get; set; }
        public long id_proyecto { get; set; }
    
        public virtual tb_proyecto tb_proyecto { get; set; }
    }
}
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
    
    public partial class tb_tarea
    {
        public long id_tarea { get; set; }
        public string nombre_tarea { get; set; }
        public string detalle_tarea { get; set; }
        public Nullable<System.DateTime> fecha_inicio_tarea { get; set; }
        public Nullable<long> id_responsable_tarea { get; set; }
        public Nullable<bool> inactivo { get; set; }
        public long id_estado_tarea_kanban { get; set; }
        public long id_proyecto { get; set; }
        public long id_fase_proyecto { get; set; }
        public Nullable<System.DateTime> fecha_creacion { get; set; }
        public Nullable<long> id_usuario_creador { get; set; }
        public Nullable<long> id_historia { get; set; }
        public Nullable<double> horas_estimadas { get; set; }
        public long id_empresa { get; set; }
        public Nullable<int> orden { get; set; }
    
        public virtual tb_estado_tarea_kanban tb_estado_tarea_kanban { get; set; }
        public virtual tb_fases_proyecto tb_fases_proyecto { get; set; }
        public virtual tb_proyecto tb_proyecto { get; set; }
    }
}

/*==============================================================*/
/* DBMS name:      PostgreSQL 8                                 */
/* Created on:     02/04/2012 15:03:37                          */
/*==============================================================*/


drop index CLIENTE_PK;

drop table cliente;

drop index CLIENTECONTRAPARTE_FK;

drop index CONTRAPARTE_PK;

drop table contraparte;

drop index PROPUESTADOCUMENTO_FK;

drop index TIPODOCUMENTODOC_FK;

drop index DOCUMENTO_PK;

drop table documento;

drop index ESTADO_PK;

drop table estado;

drop index PROPUESTACONTRAPARTE_FK;

drop index ESTADOPROPUESTA_FK;

drop index PROPUESTA_PK;

drop table propuesta;

drop index TIPO_DOCUMENTO_PK;

drop table tipo_documento;

/*==============================================================*/
/* table: cliente                                               */
/*==============================================================*/
create table cliente (
   cliente_id           serial               not null,
   nombre               varchar(75)          not null,
   es_recurrente        bool                 not null,
   constraint pk_cliente primary key (cliente_id)
);

/*==============================================================*/
/* index: cliente_pk                                            */
/*==============================================================*/
create unique index cliente_pk on cliente (
cliente_id
);

/*==============================================================*/
/* table: contraparte                                           */
/*==============================================================*/
create table contraparte (
   cliente_id           int4                 not null,
   contraparte_id       serial               not null,
   nombre               varchar(75)          not null,
   cargo                varchar(75)          not null,
   decide               bool                 not null,
   constraint pk_contraparte primary key (cliente_id, contraparte_id)
);

/*==============================================================*/
/* index: contraparte_pk                                        */
/*==============================================================*/
create unique index contraparte_pk on contraparte (
cliente_id,
contraparte_id
);

/*==============================================================*/
/* index: clientecontraparte_fk                                 */
/*==============================================================*/
create  index clientecontraparte_fk on contraparte (
cliente_id
);

/*==============================================================*/
/* table: documento                                             */
/*==============================================================*/
create table documento (
   documento_id         serial               not null,
   propuesta_id         int4                 null,
   tipo_id              int4                 null,
   nombre               varchar(75)          not null,
   archivo              varchar(100)         not null,
   constraint pk_documento primary key (documento_id)
);

/*==============================================================*/
/* index: documento_pk                                          */
/*==============================================================*/
create unique index documento_pk on documento (
documento_id
);

/*==============================================================*/
/* index: tipodocumentodoc_fk                                   */
/*==============================================================*/
create  index tipodocumentodoc_fk on documento (
tipo_id
);

/*==============================================================*/
/* index: propuestadocumento_fk                                 */
/*==============================================================*/
create  index propuestadocumento_fk on documento (
propuesta_id
);

/*==============================================================*/
/* table: estado                                                */
/*==============================================================*/
create table estado (
   estado_id            serial               not null,
   nombre               varchar(75)          not null,
   es_inicial           bool                 not null,
   es_final             bool                 not null,
   es_ganado            bool                 not null,
   es_perdido           bool                 not null,
   orden                int4                 not null,
   constraint pk_estado primary key (estado_id)
);

/*==============================================================*/
/* index: estado_pk                                             */
/*==============================================================*/
create unique index estado_pk on estado (
estado_id
);

/*==============================================================*/
/* table: propuesta                                             */
/*==============================================================*/
create table propuesta (
   propuesta_id         serial               not null,
   cliente_id           int4                 null,
   contraparte_id       int4                 null,
   estado_id            int4                 null,
   nombre               varchar(75)          not null,
   fecha_ingreso        date                 not null,
   fecha_entrega        date                 not null,
   fecha_envio          date                 not null,
   esfuerzo             int4                 not null,
   horas_ingenieria     int4                 not null,
   horas_diseno         int4                 not null,
   ejecutivo_id         int4                 not null,
   constraint pk_propuesta primary key (propuesta_id)
);

/*==============================================================*/
/* index: propuesta_pk                                          */
/*==============================================================*/
create unique index propuesta_pk on propuesta (
propuesta_id
);

/*==============================================================*/
/* index: estadopropuesta_fk                                    */
/*==============================================================*/
create  index estadopropuesta_fk on propuesta (
estado_id
);

/*==============================================================*/
/* index: propuestacontraparte_fk                               */
/*==============================================================*/
create  index propuestacontraparte_fk on propuesta (
cliente_id,
contraparte_id
);

/*==============================================================*/
/* table: tipo_documento                                        */
/*==============================================================*/
create table tipo_documento (
   tipo_id              serial               not null,
   nombre               varchar(75)          not null,
   constraint pk_tipo_documento primary key (tipo_id)
);

/*==============================================================*/
/* index: tipo_documento_pk                                     */
/*==============================================================*/
create unique index tipo_documento_pk on tipo_documento (
tipo_id
);

alter table contraparte
   add constraint fk_contrapa_clienteco_cliente foreign key (cliente_id)
      references cliente (cliente_id)
      on delete restrict on update restrict;

alter table documento
   add constraint fk_document_propuesta_propuest foreign key (propuesta_id)
      references propuesta (propuesta_id)
      on delete restrict on update restrict;

alter table documento
   add constraint fk_document_tipodocum_tipo_doc foreign key (tipo_id)
      references tipo_documento (tipo_id)
      on delete restrict on update restrict;

alter table propuesta
   add constraint fk_propuest_estadopro_estado foreign key (estado_id)
      references estado (estado_id)
      on delete restrict on update restrict;

alter table propuesta
   add constraint fk_propuest_propuesta_contrapa foreign key (cliente_id, contraparte_id)
      references contraparte (cliente_id, contraparte_id)
      on delete restrict on update restrict;


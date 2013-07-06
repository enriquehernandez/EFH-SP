/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     01/10/2012 15:27:02                          */
/*==============================================================*/


drop table if exists cliente;

drop table if exists contraparte;

drop table if exists documento;

drop table if exists estado;

drop table if exists propuesta;

drop table if exists tipo_documento;

drop table if exists tipo_propuesta;

/*==============================================================*/
/* Table: cliente                                               */
/*==============================================================*/
create table cliente
(
   cliente_id           int not null auto_increment,
   nombre               varchar(75) not null,
   es_recurrente        boolean not null,
   primary key (cliente_id)
);

/*==============================================================*/
/* Table: contraparte                                           */
/*==============================================================*/
create table contraparte
(
   cliente_id           int not null,
   contraparte_id       int not null auto_increment,
   nombre               varchar(75) not null,
   cargo                varchar(75) not null,
   decide               boolean not null,
   primary key (cliente_id),
   key AK_KCONTRAPARTE_ID (contraparte_id),
   key AK_KCONTRAPARTE_ID2 (contraparte_id)
);

/*==============================================================*/
/* Table: documento                                             */
/*==============================================================*/
create table documento
(
   documento_id         int not null auto_increment,
   propuesta_id         int not null,
   nombre               varchar(75) not null,
   archivo              varchar(75) not null,
   primary key (documento_id)
);

/*==============================================================*/
/* Table: estado                                                */
/*==============================================================*/
create table estado
(
   estado_id            int not null auto_increment,
   est_estado_id        int,
   nombre               varchar(75) not null,
   es_inicial           boolean not null,
   es_final             boolean not null,
   es_ganado            boolean not null,
   es_perdido           boolean not null,
   orden                integer not null,
   primary key (estado_id)
);

/*==============================================================*/
/* Table: propuesta                                             */
/*==============================================================*/
create table propuesta
(
   propuesta_id         int not null auto_increment,
   tipo_id              int not null,
   estado_id            int not null,
   cliente_id           int not null,
   nombre               varchar(75) not null,
   fecha_ingreso        date not null,
   fecha_entrega        date,
   fecha_envio          date,
   esfuerzo             integer not null,
   horas_ingenieria     integer not null,
   horas_diseno         integer not null,
   ejecutivo_id         integer not null,
   primary key (propuesta_id)
);

/*==============================================================*/
/* Table: tipo_documento                                        */
/*==============================================================*/
create table tipo_documento
(
   tipo_id              int not null auto_increment,
   nombre               varchar(75) not null,
   key AK_KTIPO_ID (tipo_id)
);

/*==============================================================*/
/* Table: tipo_propuesta                                        */
/*==============================================================*/
create table tipo_propuesta
(
   tipo_id              int not null auto_increment,
   nombre               varchar(75) not null,
   incluir_estadisticas bool not null,
   primary key (tipo_id)
);

alter table contraparte add constraint FK_CONTRAPARTE_CLIENTE foreign key (cliente_id)
      references cliente (cliente_id) on delete restrict on update restrict;

alter table documento add constraint FK_PROPUESTA_DOCUMENTO foreign key (propuesta_id)
      references propuesta (propuesta_id) on delete restrict on update restrict;

alter table estado add constraint FK_ESTADO_SIGUIENTE foreign key (est_estado_id)
      references estado (estado_id) on delete restrict on update restrict;

alter table propuesta add constraint FK_CONTRAPARTE_PROPUESTA foreign key (cliente_id)
      references contraparte (cliente_id) on delete restrict on update restrict;

alter table propuesta add constraint FK_ESTADO_PROPUESTA foreign key (estado_id)
      references estado (estado_id) on delete restrict on update restrict;

alter table propuesta add constraint FK_TIPO_P_PROPUESTA foreign key (tipo_id)
      references tipo_propuesta (tipo_id) on delete restrict on update restrict;


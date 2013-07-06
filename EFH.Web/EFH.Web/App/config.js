
define(function () {
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';
    var imageSettings = {
        imageBasePath: '../content/images/photos/',
        unknownPersonImageSource: 'unknown_person.jpg'
    };
    
    //var app = require('../app');
    //app.get
    //var urlBase = location.hostname + location.pathname + "/";

    //Servicios Breeze
    //var remoteServiceNameGenerico = 'breeze/Generico';
    //var remoteServiceNameMantenedor = 'breeze/Mantenedor';

    var serviciosRemotos = {
        remoteServiceNameGenerico: urlBaseServiciosBreezeApi + 'breeze/Generico',
        remoteServiceNameMantenedor: urlBaseServiciosBreezeApi + 'breeze/Mantenedor',
        remoteServiceNameProyecto: urlBaseServiciosBreezeApi + 'breeze/Proyecto'
        //remoteServiceNameGenerico: '~/breeze/Generico',
        //remoteServiceNameMantenedor: '~/breeze/Mantenedor'
    };

    var appTitle = 'EFH';
    var routes = [{
        url: 'home',
        moduleId: 'viewmodels/home',
        name: 'Inicio',
        visible: true,
        caption: 'Home',
        settings: { caption: '<i class="icon-home"></i> Inicio' }
    }, {
        url: 'proyectos',
        moduleId: 'viewmodels/proyectos',
        name: 'Proyectos',
        caption: 'Proyectos',
        visible: true,
        settings: { caption: '<i class="icon-list"></i> Proyectos' }
    }, {
        url: 'tareas/:filter',
        moduleId: 'viewmodels/proyectos/tareas',
        name: 'Tareas',
        caption: 'Tareas',
        visible: false,
        settings: { caption: '<i class="icon-tasks"></i> Tareas' }
    }, {
        url: 'mantenedores/usuarios',
        moduleId: 'viewmodels/mantenedores/usuarios',
        name: 'Usuarios',
        visible: false,
        caption: 'Usuarios',
        settings: { mantenedor: true, caption: '<i class="icon-cog"></i> Usuarios' }
    }, {
        url: 'mantenedores/clientes',
        moduleId: 'viewmodels/mantenedores/clientes',
        name: 'Clientes',
        visible: false,
        caption: 'Clientes',
        settings: { mantenedor: true, caption: '<i class="icon-cog"></i> Clientes' }
    }, {
        url: 'mantenedores/grupos',
        moduleId: 'viewmodels/mantenedores/grupos',
        name: 'Grupos',
        visible: false,
        caption: 'Grupos',
        settings: { mantenedor: true, caption: '<i class="icon-cog"></i> Grupos' }
    }, {
        url: 'mantenedores/fases',
        moduleId: 'viewmodels/mantenedores/fases',
        name: 'Fases',
        visible: false,
        caption: 'Fases',
        settings: { mantenedor: true, caption: '<i class="icon-cog"></i> Fases' }
    }, {
        url: 'mantenedores/roles',
        moduleId: 'viewmodels/mantenedores/roles',
        name: 'Roles',
        visible: false,
        caption: 'Roles',
        settings: { mantenedor: true, caption: '<i class="icon-cog"></i> Roles' }
    }];
    var startModule = 'home';
    return {
        appTitle: appTitle,
        debugEnabled: ko.observable(true),
        imageSettings: imageSettings,
        serviciosRemotos: serviciosRemotos,
        routes: routes,
        startModule: startModule
    };
});


/*
\u00e1 -> á
\u00e9 -> é
\u00ed -> í
\u00f3 -> ó
\u00fa -> ú
\u00c1 -> Á
\u00c9 -> É
\u00cd -> Í
\u00d3 -> Ó
\u00da -> Ú
\u00f1 -> ñ
\u00d1 -> Ñ
\u00bf -> ¿ 
*/
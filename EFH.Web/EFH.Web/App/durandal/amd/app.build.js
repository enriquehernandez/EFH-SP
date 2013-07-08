{
  "name": "durandal/amd/almond-custom",
  "inlineText": true,
  "stubModules": [
    "durandal/amd/text"
  ],
  "paths": {
    "text": "durandal/amd/text"
  },
  "baseUrl": "I:\\Github\\EFH-SP\\EFH.Web\\EFH.Web\\App",
  "mainConfigFile": "I:\\Github\\EFH-SP\\EFH.Web\\EFH.Web\\App\\main.js",
  "include": [
    "config",
    "configGrid",
    "configSlickGrid",
    "main-built",
    "main",
    "durandal/app",
    "durandal/composition",
    "durandal/events",
    "durandal/http",
    "text!durandal/messageBox.html",
    "durandal/messageBox",
    "durandal/modalDialog",
    "durandal/system",
    "durandal/viewEngine",
    "durandal/viewLocator",
    "durandal/viewModel",
    "durandal/viewModelBinder",
    "durandal/widget",
    "durandal/plugins/router",
    "durandal/transitions/entrance",
    "services/breeze.partial-entities",
    "services/datacontext",
    "services/datacontextEFH",
    "services/datacontextGenerico",
    "services/datacontextMantenedor",
    "services/datacontextProyectos",
    "services/logger",
    "services/model",
    "services/modelEFH",
    "viewmodels/details",
    "viewmodels/home",
    "viewmodels/mantenedores",
    "viewmodels/proyectos",
    "viewmodels/shell",
    "viewmodels/mantenedores/clientes",
    "viewmodels/mantenedores/fases",
    "viewmodels/mantenedores/grupos",
    "viewmodels/mantenedores/OldRoles",
    "viewmodels/mantenedores/roles",
    "viewmodels/mantenedores/usuarios",
    "viewmodels/proyectos/tareas",
    "text!views/details.html",
    "text!views/footer.html",
    "text!views/home.html",
    "text!views/mantenedores.html",
    "text!views/nav.html",
    "text!views/proyectos.html",
    "text!views/shell.html",
    "text!views/variables.html",
    "text!views/mantenedores/clientes.html",
    "text!views/mantenedores/fases.html",
    "text!views/mantenedores/grupos.html",
    "text!views/mantenedores/roles.html",
    "text!views/mantenedores/usuarios.html",
    "text!views/proyectos/tareas.html"
  ],
  "exclude": [],
  "keepBuildDir": true,
  "optimize": "uglify2",
  "out": "I:\\Github\\EFH-SP\\EFH.Web\\EFH.Web\\App\\main-built.js",
  "pragmas": {
    "build": true
  },
  "wrap": true,
  "insertRequire": [
    "main"
  ]
}
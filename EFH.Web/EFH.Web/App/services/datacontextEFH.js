﻿define([
    'durandal/system',
    'services/modelEFH',
    'config',
    'services/logger',
    'services/breeze.partial-entities'],
    function (system, model, config, logger, partialMapper) {
        var EntityQuery = breeze.EntityQuery;
        var manager = configureBreezeManager();
        var orderBy = model.orderBy;
        var entityNames = model.entityNames;
        
        var getSessionName = function() {
            // 1st - fetchEntityByKey will look in local cache 
            // first (because 3rd parm is true) 
            // if not there then it will go remote

            //return manager.fetchEntityByKey(
            //    entityNames.nombreUsuarioConectado, sessionName, true)
            //    .then(fetchSucceeded)
            //    .fail(queryFailed);
            //return fetchSucceeded(entityNames.nombreUsuarioConectado).fail(queryFailed);
            var query = EntityQuery.from('UsuarioConectado');
            var user = manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);
            return user;

            // 2nd - Refresh the entity from remote store (if needed)
            function fetchSucceeded(data) {
                log('Retrieved [Sessions] from remote data source',
                    data, true);
                //var s = data.entity;
                //return s.isPartial() ? refreshSession(s) : sessionObservable(s);
            }
            
            function refreshSession(usuarioConectado) {
                return EntityQuery.fromEntities(usuarioConectado)
                    .using(manager).execute()
                    .then(querySucceeded)
                    .fail(queryFailed);
            }
            
            function querySucceeded(data) {
                var s = data.results[0];
                //s.isPartial(false);
                log('Retrieved [Session] from remote data source', s, true);
                return sessionObservable(s);
            }

        };

        var createSession = function() {
            return manager.createEntity(entityNames.usuarioConectado);
        };

        var hasChanges = ko.observable(false);

        manager.hasChangesChanged.subscribe(function(eventArgs) {
            hasChanges(eventArgs.hasChanges);
        });

        var datacontext = {
            getSessionName: getSessionName,
            createSession: createSession,
            //getSessionPartials: getSessionPartials,
            //getSpeakerPartials: getSpeakerPartials,
            hasChanges: hasChanges,
            //getSessionById: getSessionById,
            //primeData: primeData,
            //cancelChanges: cancelChanges,
            //saveChanges: saveChanges
        };

        return datacontext;

        //#region Internal methods        
        
        function getLocal(resource, ordering, includeNullos) {
            var query = EntityQuery.from(resource)
                .orderBy(ordering);
            if (!includeNullos) {
                query = query.where('id', '!=', 0);
            }
            return manager.executeQueryLocally(query);
        }
        
        function getErrorMessages(error) {
            var msg = error.message;
            if (msg.match(/validation error/i)) {
                return getValidationMessages(error);
            }
            return msg;
        }
        
        function getValidationMessages(error) {
            try {
                //foreach entity with a validation error
                return error.entitiesWithErrors.map(function(entity) {
                    // get each validation error
                    return entity.entityAspect.getValidationErrors().map(function(valError) {
                        // return the error message from the validation
                        return valError.errorMessage;
                    }).join('; <br/>');
                }).join('; <br/>');
            }
            catch (e) { }
            return 'validation error';
        }

        function queryFailed(error) {
            var msg = 'Error retreiving data. ' + error.message;
            logError(msg, error);
            throw error;
        }

        function configureBreezeManager() {
            //breeze.NamingConvention.camelCase.setAsDefault();
            var mgr = new breeze.EntityManager(config.remoteServiceNameGenerico);
            model.configureMetadataStore(mgr.metadataStore);
            return mgr;
        }

        function getLookups() {
            return EntityQuery.from('Lookups')
                .using(manager).execute()
                .then(processLookups)
                .fail(queryFailed);
        }
        
        function processLookups() {
            model.createNullos(manager);
        }


        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(datacontext), showToast);
        }

        function logError(msg, error) {
            logger.logError(msg, error, system.getModuleId(datacontext), true);
        }
        //#endregion
});
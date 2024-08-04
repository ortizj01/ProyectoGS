import Handlebars from 'handlebars';

Handlebars.registerHelper('hasPermission', function(permisos, permiso, options) {
    if (permisos.includes(permiso)) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
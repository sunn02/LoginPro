const { randomBytes } = require('crypto');

// Genera un token CSRF y lo asigna a la sesión del usuario
exports.generateCSRFToken = (req, res) => {
    const csrfToken = randomBytes(20).toString('hex'); // Token aleatorio
    req.session.csrfToken = csrfToken; // Guardar en la sesión
    res.cookie('csrf_token', csrfToken, { httpOnly: false, secure: false, sameSite: 'Strict' }); // Enviar como cookie
};

// Probar res.cookie('csrf_token', csrfToken, { httpOnly: true, secure: true, sameSite: 'Strict' });


// Valida el token CSRF enviado en las solicitudes protegidas
exports.validateCSRFToken = (req, res, next) => {
    const csrfTokenHeader = req.get('CSRF-Token'); // Token enviado en el encabezado
    const csrfTokenSession = req.session.csrfToken; // Token guardado en sesión

    if (!csrfTokenHeader || csrfTokenHeader !== csrfTokenSession) {
        return res.status(403).json({ message: "Invalid or missing CSRF token" });
    }
    next();
};

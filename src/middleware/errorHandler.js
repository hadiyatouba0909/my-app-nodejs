// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    let errors = {};
  
    // Gérer les erreurs de validation Mongoose
    if (err.name === "ValidationError") {
      statusCode = 400;
      message = "Erreur de validation des données";
      
      // Extraire les messages d'erreur par champ
      Object.keys(err.errors).forEach((field) => {
        errors[field] = err.errors[field].message;
      });
    }
  
    // Gérer les erreurs de clé dupliquée (unique)
    if (err.code === 11000) {
      statusCode = 400;
      message = "Cette valeur existe déjà";
      
      // Extraire le champ en doublon
      const field = Object.keys(err.keyValue)[0];
      errors[field] = `La valeur '${err.keyValue[field]}' est déjà utilisée`;
    }
  
    // Gérer les erreurs de casting (ID invalide, etc.)
    if (err.name === "CastError") {
      statusCode = 400;
      message = `Ressource invalide: ${err.value}`;
    }
  
    // Gérer les erreurs JWT
    if (err.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Token invalide";
    }
  
    if (err.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token expiré";
    }
  
    res.status(statusCode).json({
      success: false,
      message,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
  };
  
  export default errorHandler;
module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non autorisé, aucun utilisateur authentifié' });
    }
    if (requiredRole && req.user.role !== requiredRole) {
      return res.status(403).json({ message: `Accès refusé, rôle requis: ${requiredRole}` });
    }
    next();
  };
};

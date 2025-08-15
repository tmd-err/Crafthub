const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Pour le hachage des mots de passe




const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Supprime les espaces inutiles
    minlength: 3, // Longueur minimale du nom d'utilisateur
    maxlength: 30, // Longueur maximale du nom d'utilisateur
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // Convertit l'email en minuscules
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer un email valide'], // Validation de l'email
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Longueur minimale du mot de passe
  },
  role: {
    type: String,
    enum: ['customer', 'provider', 'admin'], // Rôles possibles
    default: 'customer', // Rôle par défaut
  },
  createdAt: {
    type: Date,
    default: Date.now, // Date de création automatique
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Date de mise à jour automatique
  },
});

// Middleware pour hacher le mot de passe avant de sauvegarder l'utilisateur
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10); // Génère un salt
    this.password = await bcrypt.hash(this.password, salt); // Hache le mot de passe
  }
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Exportation du modèle
module.exports = mongoose.model('User', userSchema);
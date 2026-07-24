const Knowledge = require("../models/Knowledge");
const { generateDiagnostic, addDocumentToVectorStore } = require("../services/aiService");

// Poser une question à l'IA pour le diagnostic
exports.diagnoseProblem = async (req, res) => {
    try {
        const { description, module } = req.body;
        if (!description || !module) {
            return res.status(400).json({ message: "Veuillez fournir une description et le module concerné" });
        }

        const diagnosticResult = await generateDiagnostic(description, module);
        res.json(diagnosticResult);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ajouter une nouvelle entrée dans la base de connaissances (MongoDB + ChromaDB)
exports.addKnowledge = async (req, res) => {
    try {
        const { title, description, module, solution, tags } = req.body;
        if (!title || !description || !module || !solution) {
            return res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires" });
        }

        // 1. Enregistrer dans MongoDB
        const newKnowledge = await Knowledge.create({
            title,
            description,
            module,
            solution,
            tags
        });

        // 2. Indexer dans ChromaDB via LangChain
        await addDocumentToVectorStore(title, description, module, solution);

        res.status(201).json({ message: "Solution ajoutée avec succès", knowledge: newKnowledge });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

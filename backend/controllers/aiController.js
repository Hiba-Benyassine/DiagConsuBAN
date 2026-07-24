const Knowledge = require("../models/Knowledge");
const Incident = require("../models/Incident");
const { generateDiagnostic, addDocumentToVectorStore } = require("../services/aiService");

// POST /api/ai/diagnose — Analyser un incident avec l'IA
exports.diagnoseProblem = async (req, res) => {
    try {
        const { erp, module, titre, messageErreur, priorite, description, infoComplementaires } = req.body;

        if (!description || !module) {
            return res.status(400).json({ message: "Veuillez fournir une description et le module concerné" });
        }

        // Rechercher des incidents similaires dans MongoDB
        const incidentsSimilaires = await Incident.find({
            module: { $regex: module, $options: "i" },
            status: "Résolu"
        }).limit(5).select("titre erp module status createdAt");

        // Générer le diagnostic via IA (Ollama + ChromaDB)
        let diagnosticResult;
        try {
            diagnosticResult = await generateDiagnostic(
                `ERP: ${erp || "Oracle"} | Module: ${module} | Titre: ${titre || ""} | Erreur: ${messageErreur || ""} | ${description}`,
                module
            );
        } catch (aiError) {
            console.warn("⚠️ IA indisponible, mode dégradé:", aiError.message);
            diagnosticResult = {
                solution: null,
                contextUsed: ""
            };
        }

        // Construire une réponse structurée
        const rawText = diagnosticResult.solution?.content || diagnosticResult.solution || "";

        // Parser la réponse IA en sections structurées
        const parseSection = (text, keyword) => {
            const regex = new RegExp(`${keyword}[:\\s\\n]+([\\s\\S]*?)(?=\\n\\d+\\.|\\n[A-Z]|$)`, "i");
            const match = text.match(regex);
            return match ? match[1].trim() : "";
        };

        const response = {
            resume: `L'incident est lié au module ${module} sur ${erp || "Oracle EBS"}. ${titre || description}`,
            erp: erp || "Oracle E-Business Suite",
            modules: [module],
            causesProbables: rawText
                ? [
                    "Configuration incorrecte du module " + module,
                    "Données manquantes ou incohérentes",
                    "Problème de paramétrage système",
                    "Conflit entre modules liés"
                  ]
                : [
                    "Vérifier le statut des enregistrements concernés",
                    "Contrôler les paramètres du module " + module,
                    "Analyser les logs d'erreurs",
                    "Vérifier les droits d'accès utilisateur"
                  ],
            controlesAEffectuer: [
                `Vérifier le statut de l'enregistrement dans ${module}`,
                "Contrôler les données liées et les relations entre tables",
                "Vérifier les paramètres de configuration du module",
                "Consulter les journaux d'erreurs (logs)",
                "Tester avec un utilisateur ayant les droits complets"
            ],
            etapesResolution: [
                `Identifier l'enregistrement concerné dans ${erp || "Oracle"} ${module}`,
                "Vérifier l'état et le statut de chaque élément lié",
                "Corriger les données ou paramètres incorrects",
                "Relancer le traitement ou l'opération bloquée",
                "Valider le résultat et documenter la solution"
            ],
            requetesSQL: messageErreur
                ? [
                    `-- Vérifier le statut dans ${module}\nSELECT * FROM ${module.toLowerCase().replace(/\s/g, "_")}_all WHERE status = 'OPEN';`,
                    `-- Rechercher les enregistrements liés\nSELECT a.*, b.status \nFROM ap_invoices_all a\nJOIN po_headers_all b ON a.po_header_id = b.po_header_id\nWHERE a.invoice_num = :invoice_num;`,
                    `-- Vérifier les distributions\nSELECT * FROM ap_invoice_distributions_all\nWHERE invoice_id = :invoice_id;`
                  ]
                : [
                    `-- Requête de diagnostic générale pour le module ${module}\nSELECT * FROM all_objects WHERE object_type = 'TABLE' AND object_name LIKE '%${module.toUpperCase().substring(0, 3)}%';`
                  ],
            rawIA: rawText || null,
            incidentsSimilaires: incidentsSimilaires.map(inc => ({
                id: inc._id,
                titre: inc.titre,
                erp: inc.erp,
                module: inc.module,
                status: inc.status,
                date: inc.createdAt
            })),
            contextUsed: diagnosticResult.contextUsed || ""
        };

        res.json(response);
    } catch (error) {
        console.error("Erreur diagnoseProblem:", error);
        res.status(500).json({ message: error.message });
    }
};

// POST /api/ai/knowledge — Ajouter dans la base de connaissances
exports.addKnowledge = async (req, res) => {
    try {
        const { title, description, module, solution, tags } = req.body;
        if (!title || !description || !module || !solution) {
            return res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires" });
        }

        const newKnowledge = await Knowledge.create({
            title,
            description,
            module,
            solution,
            tags
        });

        // Indexer dans ChromaDB si disponible
        try {
            await addDocumentToVectorStore(title, description, module, solution);
        } catch (chromaError) {
            console.warn("⚠️ ChromaDB indisponible:", chromaError.message);
        }

        res.status(201).json({ message: "Solution ajoutée avec succès", knowledge: newKnowledge });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

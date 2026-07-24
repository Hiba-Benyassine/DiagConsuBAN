const { OllamaEmbeddings, ChatOllama } = require("@langchain/ollama");
const { Chroma } = require("@langchain/community/vectorstores/chroma");

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const CHROMADB_URL = process.env.CHROMADB_URL || "http://localhost:8000";

// Instancier les embeddings Ollama (Nomic Embed par défaut)
const embeddings = new OllamaEmbeddings({
    baseUrl: OLLAMA_URL,
    model: "nomic-embed-text"
});

// Instancier le LLM Ollama (Llama 3.1 par défaut)
const model = new ChatOllama({
    baseUrl: OLLAMA_URL,
    model: "llama3.1"
});

// Ajouter un document technique ou incident résolu dans la base de connaissances ChromaDB
async function addDocumentToVectorStore(title, description, module, solution) {
    try {
        const text = `Module: ${module}\nProblème: ${title}\nDescription: ${description}\nSolution: ${solution}`;
        await Chroma.fromTexts(
            [text],
            [{ title, module, solution }],
            embeddings,
            {
                url: CHROMADB_URL,
                collectionName: "erp-knowledge"
            }
        );
        return true;
    } catch (error) {
        console.error("⚠️ Erreur d'insertion ChromaDB :", error.message);
        return false;
    }
}

// Recherche RAG + Diagnostic avec Ollama
async function generateDiagnostic(problemDescription, module) {
    try {
        let context = "";
        try {
            const vectorStore = await Chroma.fromExistingCollection(embeddings, {
                url: CHROMADB_URL,
                collectionName: "erp-knowledge"
            });
            const results = await vectorStore.similaritySearch(problemDescription, 2);
            context = results.map(r => r.pageContent).join("\n\n");
        } catch (chromaError) {
            console.warn("⚠️ ChromaDB indisponible, exécution sans RAG :", chromaError.message);
        }

        const prompt = `
Vous êtes un agent IA expert en diagnostic d'incidents ERP (Oracle EBS et Odoo).
Voici le contexte des incidents similaires résolus :
${context || "Aucun incident similaire trouvé dans la base de connaissances."}

Problème rencontré sur le module "${module}" :
"${problemDescription}"

Proposez une solution structurée avec :
1. Causes probables
2. Contrôles à faire
3. Étapes de résolution
4. Requêtes SQL utiles
5. Recommandations techniques
`;

        const response = await model.invoke(prompt);
        return {
            solution: response,
            contextUsed: context
        };
    } catch (error) {
        console.error("⚠️ Erreur Ollama :", error.message);
        return {
            solution: `[Mode dégradé] Impossible de joindre l'agent IA Ollama local. Veuillez vérifier le module ${module}.`,
            contextUsed: ""
        };
    }
}

module.exports = {
    addDocumentToVectorStore,
    generateDiagnostic
};

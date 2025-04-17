import { useEffect, useState, useRef } from 'react';
import prettifyXml from 'prettify-xml';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup'; 
import 'prismjs/themes/prism-funky.css'; 

function XmlPreview({ xmlContent, onProcess, isProcessing, title }) {
    const [formattedXml, setFormattedXml] = useState('');
    const codeRef = useRef(null);
    
    useEffect(() => {
        if (xmlContent) {
            try {
                // Formatear el XML
                const options = {
                    indent: 2,
                    newline: '\n',
                    maxWidth: 120
                };
                
                const formatted = prettifyXml(xmlContent, options);
                setFormattedXml(formatted);
            } catch (error) {
                console.error("Error al formatear XML:", error);
                setFormattedXml(xmlContent);
            }
        }
    }, [xmlContent]);
    
    // Aplicar resaltado de sintaxis cuando cambie el XML formateado
    useEffect(() => {
        if (formattedXml && codeRef.current) {
            Prism.highlightElement(codeRef.current);
        }
    }, [formattedXml]);
    
    return (
        <div className="bg-background-card rounded-lg shadow-card p-6 flex flex-col h-full">
            <h2 className="text-xl font-semibold text-text-dark mb-4">
                {title || "Vista previa del XML"}
            </h2>
            
            {/* Contenedor con altura fija para garantizar que ambos paneles tengan la misma altura */}
            <div className="h-[450px] bg-black p-4 rounded overflow-auto mb-4 font-mono text-xs">
                {xmlContent ? (
                    <pre className="language-markup">
                        <code ref={codeRef} className="language-markup">
                            {formattedXml}
                        </code>
                    </pre>
                ) : (
                    <div className="text-gray-400 h-full flex items-center justify-center">
                        No hay contenido XML para mostrar
                    </div>
                )}
            </div>
            
            <button
                type="button"
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={onProcess}
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                    </>
                ) : (
                    'Procesar XML'
                )}
            </button>
        </div>
    );
}

export default XmlPreview;
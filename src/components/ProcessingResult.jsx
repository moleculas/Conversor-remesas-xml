import { useEffect, useState, useRef } from 'react';
import prettifyXml from 'prettify-xml';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup'; 
import 'prismjs/themes/prism-funky.css'; 

function ProcessingResult({ data, title }) {
  const [formattedXml, setFormattedXml] = useState('');
  const codeRef = useRef(null);
  
  useEffect(() => {
    if (data && data.sample) {
      try {
        const options = {
          indent: 2,
          newline: '\n',
          maxWidth: 120
        };
        
        const formatted = prettifyXml(data.sample, options);
        setFormattedXml(formatted);
      } catch (error) {
        console.error("Error al formatear XML:", error);
        setFormattedXml(data.sample);
      }
    }
  }, [data]);
  
  useEffect(() => {
    if (formattedXml && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [formattedXml]);
  
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([data.sample], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "resultado-procesado.xml";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="bg-background-card rounded-lg shadow-card p-6 flex flex-col h-full">
      {/* Encabezado solo con título (eliminamos el mensaje de éxito) */}
      <h2 className="text-xl font-semibold text-text-dark mb-4">
        {title || "Resultado del procesamiento"}
      </h2>
      
      {/* Contenedor del XML con altura fija */}
      <div className="h-[450px] bg-black p-4 rounded overflow-auto mb-4 font-mono text-xs">
        {data && data.sample ? (
          <pre className="language-markup">
            <code ref={codeRef} className="language-markup">
              {formattedXml}
            </code>
          </pre>
        ) : (
          <div className="text-gray-400 h-full flex items-center justify-center">
            No hay resultado para mostrar
          </div>
        )}
      </div>
      
      {data && data.sample && (
        <button
          type="button"
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-success transition-colors hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success"
          onClick={handleDownload}
        >
          Descargar resultado
        </button>
      )}
    </div>
  );
}

export default ProcessingResult;
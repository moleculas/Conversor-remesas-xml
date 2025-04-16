import { useEffect, useState } from 'react';
import prettifyXml from 'prettify-xml';

function ProcessingResult({ data, title }) {
  const [formattedXml, setFormattedXml] = useState('');
  
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
      {/* Encabezado con título y mensaje de éxito integrado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-text-dark">
          {title || "Resultado del procesamiento"}
        </h2>
        <div className="flex items-center bg-success-50 text-success-800 text-sm font-medium px-2 py-1 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {data.message}
        </div>
      </div>
      
      {/* Contenedor del XML con altura fija */}
      <div className="h-[450px] bg-gray-900 p-4 rounded overflow-auto mb-4 font-mono text-xs">
        <pre className="text-gray-200 whitespace-pre-wrap">
          {formattedXml}
        </pre>
      </div>
      
      <button
        type="button"
        className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-success transition-colors hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success"
        onClick={handleDownload}
      >
        Descargar resultado
      </button>
    </div>
  );
}

export default ProcessingResult;
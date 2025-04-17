import { useState } from 'react';
import FileUploader from './components/FileUploader';
import XmlPreview from './components/XmlPreview';
import ProcessingResult from './components/ProcessingResult';
import { useRemesa } from './context/RemesaContext';
import toast from 'react-hot-toast';

function App() {
  const [xmlFile, setXmlFile] = useState(null);
  const [xmlContent, setXmlContent] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedData, setConvertedData] = useState(null);
  const [isFileValid, setIsFileValid] = useState(true);

  const { numRemesa, setRemesaFromFileName } = useRemesa();

  const handleFileUpload = (file, content) => {
    const extractedNumRemesa = setRemesaFromFileName(file.name);

    if (!extractedNumRemesa) {
      toast.error("Error: El formato del archivo debe ser 'Remesa_R000000.xml'", {
        duration: 4000,
        style: {
          border: '1px solid #e53e3e',
          padding: '16px',
        },
      });

      setIsFileValid(false);
      setXmlFile(file);
      setXmlContent(null);
      setConvertedData(null);
      return;
    }

    setIsFileValid(true);
    setXmlFile(file);
    setXmlContent(content);
    setConvertedData(null);

    toast.success(`Número de remesa detectado: ${extractedNumRemesa}`, {
      duration: 3000,
      style: {
        border: '1px solid #3182ce',
        padding: '16px',
      },
    });
  };

  const processXML = () => {
    if (!xmlContent || !numRemesa) return;

    setIsProcessing(true);

    setTimeout(() => {
      setConvertedData({
        sample: xmlContent
      });
      setIsProcessing(false);

      toast.success(`XML procesado correctamente. Número de remesa: ${numRemesa}`, {
        duration: 3000,
        style: {
          border: '1px solid #3182ce',
          padding: '16px',
        },
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary mb-1">
            Conversor de Remesas XML
          </h1>
          <p className="text-lg text-gray-600">
            Convierte archivos XML de remesas según especificaciones requeridas
          </p>
        </header>

        {/* Componente para cargar archivos */}
        <FileUploader onFileUpload={handleFileUpload} isFileValid={isFileValid} />

        {/* Contenedor de visualización lado a lado */}
        {xmlContent && (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="h-full">
              <XmlPreview
                xmlContent={xmlContent}
                onProcess={processXML}
                isProcessing={isProcessing}
                title="Vista previa del XML"
              />
            </div>

            <div className="h-full">
              {convertedData ? (
                <ProcessingResult
                  data={convertedData}
                  title="Resultado del procesamiento"
                />
              ) : (
                <div className="bg-background-card rounded-lg shadow-card p-6 flex items-center justify-center h-[563px]">
                  <p className="text-gray-500 italic">El resultado se mostrará aquí después del procesamiento</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
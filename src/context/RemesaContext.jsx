import { createContext, useState, useContext } from 'react';

const RemesaContext = createContext();

export const useRemesa = () => useContext(RemesaContext);

export const RemesaProvider = ({ children }) => {
    const [numRemesa, setNumRemesa] = useState(null);
    const [diaRemesa, setDiaRemesa] = useState(null);

    const setRemesaFromFileName = (fileName) => {
        const regex = /^Remesa_R(\d+)\.xml$/;
        const match = fileName.match(regex);

        if (match) {
            const extractedNum = match[1];
            const lastFiveDigits = extractedNum.slice(-5);

            setNumRemesa(lastFiveDigits);
            return lastFiveDigits;
        }

        setNumRemesa(null);
        return null;
    };

    return (
        <RemesaContext.Provider value={{
            numRemesa,
            setNumRemesa,
            setRemesaFromFileName,
            diaRemesa,
            setDiaRemesa
        }}>
            {children}
        </RemesaContext.Provider>
    );
};
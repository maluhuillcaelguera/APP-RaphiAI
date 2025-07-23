import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CameraContextType {
isCameraMode: boolean;
setCameraMode: (mode: boolean) => void;
onCameraAction: (action: string) => void;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const useCameraContext = () => {
const context = useContext(CameraContext);
if (!context) {
throw new Error('useCameraContext must be used within a CameraProvider');
}
return context;
};

export const CameraProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
const [isCameraMode, setCameraMode] = useState(false);

const onCameraAction = (action: string) => {
switch (action) {
case 'capture':
console.log('📸 Capturing photo...');
break;
case 'flip':
console.log('🔄 Flipping camera...');
break;
case 'flash':
console.log('⚡ Toggling flash...');
break;
case 'close':
console.log('❌ Closing camera...');
setCameraMode(false);
break;
default:
break;
}
};

return (
<CameraContext.Provider value={{ isCameraMode, setCameraMode, onCameraAction }}>
{children}
</CameraContext.Provider>
);
};
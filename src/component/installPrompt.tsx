"use client";
import { useEffect, useState } from "react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [closePrompt, setClosePrompt] = useState(false)

  useEffect(() => {
    const handler = (event: any) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("PWA Installed");
        }
        setDeferredPrompt(null);
        setShowPrompt(false);
      });
    }
  };

  if (!showPrompt || closePrompt) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 
    bg-black/30 backdrop-blur-md text-white px-4 py-2 z-30 shadow-md flex flex-col gap-1 items-start rounded-lg">
      <span className="self-end cursor-pointer" onClick={()=>setClosePrompt(true)}>X</span>
      <p className="mb-2">Install Weather Rush for a better experience!</p>
      <button onClick={installPWA} className="bg-white text-blue-600 px-3 py-1 rounded">
        Install
      </button>
    </div>
  );
}


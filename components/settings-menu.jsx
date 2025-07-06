"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsMenu({ 
  settings, 
  setSettings,
  onResetHistory
}) {
  // Ensure tempSettings has inspectionDuration, defaulting to 15 if not present
  const [tempSettings, setTempSettings] = useState({
    ...settings,
    inspectionDuration: settings.inspectionDuration || 15
  });
  const [open, setOpen] = useState(false);
  
  const handleSave = () => {
    setSettings(tempSettings);
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('cuboSettings', JSON.stringify(tempSettings));
    }
    // Close the dialog
    setOpen(false);
  };
  
  const handleResetHistory = () => {
    onResetHistory();
    // Keep dialog open
  };
  
  const handleResetSettings = () => {
    const defaultSettings = {
      useSpaceBar: true,
      useInspection: false,
      inspectionDuration: 15,
      useSounds: true,
      darkMode: true,
      debugMode: false,
      hideDuringSolve: false,
      useHoldDelay: true
    };
    
    // Update temp settings with defaults
    setTempSettings(defaultSettings);
    
    // Apply the settings immediately
    setSettings(defaultSettings);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('cuboSettings', JSON.stringify(defaultSettings));
    }
  };
  
  const handleToggle = (key) => {
    setTempSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className={`${settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} max-w-xl`}>
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        
        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          {/* Timer Settings Tab */}
          <TabsContent value="timer" className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex-1">
                Space bar starts/stops timer
              </label>
              <div 
                onClick={() => handleToggle('useSpaceBar')} 
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${tempSettings.useSpaceBar ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${tempSettings.useSpaceBar ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex-1 text-sm">
                (When disabled, click timer to start/stop)
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex-1">
                Use hold delay (0.5s)
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  Requires holding spacebar for 0.5s before starting timer
                </span>
              </label>
              <div 
                onClick={() => handleToggle('useHoldDelay')} 
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${tempSettings.useHoldDelay ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${tempSettings.useHoldDelay ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex-1">
                Inspection time
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  Enable to use WCA-style inspection before timing
                </span>
              </label>
              <div 
                onClick={() => handleToggle('useInspection')} 
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${tempSettings.useInspection ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${tempSettings.useInspection ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </div>
            </div>
            
            {tempSettings.useInspection && (
              <div className="flex items-center justify-between ml-4 mt-2 mb-4">
                <label className="flex-1">
                  Inspection duration (seconds)
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Default: 15s (WCA standard)
                  </span>
                </label>
                <div className="flex items-center">
                  <button 
                    onClick={() => {
                      if (tempSettings.inspectionDuration > 1) {
                        setTempSettings(prev => ({
                          ...prev,
                          inspectionDuration: prev.inspectionDuration - 1
                        }));
                      }
                    }}
                    className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-l"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={tempSettings.inspectionDuration || 15}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= 60) {
                        setTempSettings(prev => ({
                          ...prev,
                          inspectionDuration: value
                        }));
                      }
                    }}
                    className="w-14 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-center border-0"
                  />
                  <button 
                    onClick={() => {
                      if (tempSettings.inspectionDuration < 60) {
                        setTempSettings(prev => ({
                          ...prev,
                          inspectionDuration: prev.inspectionDuration + 1
                        }));
                      }
                    }}
                    className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-r"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <label className="flex-1">
                Sound effects
              </label>
              <div 
                onClick={() => handleToggle('useSounds')} 
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${tempSettings.useSounds ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${tempSettings.useSounds ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex-1">
                Hide UI during solves
                <span className="block text-xs text-gray-500 dark:text-gray-400">
                  Provides a distraction-free solving experience
                </span>
              </label>
              <div 
                onClick={() => handleToggle('hideDuringSolve')} 
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${tempSettings.hideDuringSolve ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${tempSettings.hideDuringSolve ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </div>
            </div>
          </TabsContent>
          
          {/* Appearance Settings Tab */}
          <TabsContent value="appearance" className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex-1">
                Dark mode
              </label>
              <div 
                onClick={() => handleToggle('darkMode')} 
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${tempSettings.darkMode ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${tempSettings.darkMode ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </div>
            </div>
            
            <div className="p-4 border rounded-md border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
              <h3 className="font-medium mb-2">Theme Preview</h3>
              <p className="text-sm mb-4">This is how the app will look with the current settings.</p>
              <div className={`w-full h-24 rounded-md ${tempSettings.darkMode ? 'bg-gray-900' : 'bg-white'} relative overflow-hidden border ${tempSettings.darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                <div className={`absolute top-2 left-2 text-xs ${tempSettings.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Timer Preview</div>
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-mono font-bold ${tempSettings.darkMode ? 'text-white' : 'text-black'}`}>
                  12.34s
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Advanced Settings Tab */}
          <TabsContent value="advanced" className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex-1">
                Debug mode
              </label>
              <div 
                onClick={() => handleToggle('debugMode')} 
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${tempSettings.debugMode ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${tempSettings.debugMode ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex-1 text-sm text-gray-500">
                (Shows debug buttons and info panel)
              </label>
            </div>
            
            <div className="mt-4 p-4 border border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 rounded-md">
              <h3 className="text-yellow-800 dark:text-yellow-300 font-medium mb-1">Data Management</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">
                Be careful: This will delete all your solve history permanently.
              </p>
              <Button variant="destructive" onClick={handleResetHistory} className="w-full">
                Reset All Solve History
              </Button>
            </div>
            
            <div className="mt-4 p-4 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md">
              <h3 className="font-medium mb-1">Reset to Defaults</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                This will reset all settings to their default values.
              </p>
              <Button variant="secondary" onClick={handleResetSettings} className="w-full">
                Reset All Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

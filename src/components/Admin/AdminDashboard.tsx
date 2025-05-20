
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Database, Settings } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-swg-blue rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold">SW</span>
            </div>
            <h1 className="text-2xl font-bold">SWGenius Admin</h1>
          </div>
          <Button variant="outline" onClick={onLogout}>Abmelden</Button>
        </div>
        
        <Tabs defaultValue="chats" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="chats" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Aktive Chats
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Wissendatenbank
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Einstellungen
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chats">
            <Card>
              <CardHeader>
                <CardTitle>Aktive Chats</CardTitle>
                <CardDescription>
                  Alle derzeit aktiven Unterhaltungen mit Benutzern
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-8 text-center text-gray-500 rounded-lg">
                  Derzeit keine aktiven Chats.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="knowledge">
            <Card>
              <CardHeader>
                <CardTitle>Wissensdatenbank</CardTitle>
                <CardDescription>
                  Verwalten Sie die QA-Paare für den Chatbot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <KnowledgeBaseItem
                    question="Wie hoch sind die aktuellen Strompreise?"
                    answer="Unsere aktuellen Strompreise finden Sie auf unserer Webseite unter 'Tarife'. Aktuell bieten wir einen Grundpreis ab 9,95€ pro Monat und einen Arbeitspreis ab 28,5 Cent pro kWh."
                    category="Tarife"
                  />
                  <KnowledgeBaseItem
                    question="Wann erhalte ich Glasfaser in meinem Wohngebiet?"
                    answer="Wir bauen das Glasfasernetz in Geesthacht schrittweise aus. Auf unserer Webseite können Sie Ihre Adresse eingeben und die Verfügbarkeit prüfen."
                    category="Glasfaser"
                  />
                  <KnowledgeBaseItem
                    question="Wie kann ich Kontakt aufnehmen?"
                    answer="Sie erreichen uns telefonisch unter 04152 / 929-0, per E-Mail an info@stadtwerke-geesthacht.de oder persönlich in unserem Kundenzentrum."
                    category="Kontakt"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Chatbot Einstellungen</CardTitle>
                <CardDescription>
                  Konfigurieren Sie das Verhalten des Chatbots
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Allgemeine Einstellungen</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name des Chatbots</label>
                        <input 
                          type="text" 
                          defaultValue="SWGenius"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Position</label>
                        <select className="w-full p-2 border rounded">
                          <option>Unten rechts</option>
                          <option>Unten links</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Sprache</label>
                        <select className="w-full p-2 border rounded">
                          <option>Deutsch</option>
                          <option>Englisch</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Ollama Server Einstellungen</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Server URL</label>
                        <input 
                          type="text" 
                          defaultValue="http://localhost:11434"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Modell</label>
                        <select className="w-full p-2 border rounded">
                          <option>Llama2</option>
                          <option>Mistral</option>
                          <option>Gemma</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Temperatur</label>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.1"
                          defaultValue="0.7"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="bg-swg-blue hover:bg-swg-blue/90">Speichern</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const KnowledgeBaseItem: React.FC<{
  question: string;
  answer: string;
  category: string;
}> = ({ question, answer, category }) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{question}</h4>
        <span className="bg-gray-100 text-xs px-2 py-1 rounded">{category}</span>
      </div>
      <p className="text-sm text-gray-600">{answer}</p>
      <div className="flex gap-2 mt-3">
        <Button size="sm" variant="outline" className="text-xs">Bearbeiten</Button>
        <Button size="sm" variant="outline" className="text-xs text-red-500">Löschen</Button>
      </div>
    </div>
  );
};

export default AdminDashboard;


import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Database, Settings } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface KnowledgeItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [crawlUrl, setCrawlUrl] = useState('');
  const [serverUrl, setServerUrl] = useState('');
  const [model, setModel] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/knowledge')
      .then(res => res.json())
      .then(setKnowledge)
      .catch(() => {});

    fetch('/api/config')
      .then(res => res.json())
      .then(cfg => {
        setServerUrl(cfg.serverUrl);
        setModel(cfg.model);
        setTemperature(cfg.temperature);
      })
      .catch(() => {});

    fetch('/api/models')
      .then(res => res.json())
      .then(setModels)
      .catch(() => {});
  }, []);

  const handleCrawl = async () => {
    if (!crawlUrl) return;
    const res = await fetch('/api/crawl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: crawlUrl })
    });
    const qa = await res.json();
    setKnowledge((prev) => [...prev, qa]);
    setCrawlUrl('');
  };

  const handleSaveConfig = async () => {
    await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverUrl, model, temperature })
    });
  };

  const grouped = knowledge.reduce<Record<string, KnowledgeItem[]>>((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});
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
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={crawlUrl}
                    onChange={(e) => setCrawlUrl(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Link zum Crawlen"
                  />
                  <Button onClick={handleCrawl}>Crawlen</Button>
                </div>
                {Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat} className="mb-6">
                    <h3 className="font-medium mb-2">{cat}</h3>
                    <div className="space-y-2">
                      {items.map((it) => (
                        <KnowledgeBaseItem
                          key={it.id}
                          item={it}
                          onUpdate={(updated) =>
                            setKnowledge((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
                          }
                          onDelete={() =>
                            setKnowledge((prev) => prev.filter((p) => p.id !== it.id))
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
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
                          value={serverUrl}
                          onChange={(e) => setServerUrl(e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Modell</label>
                        <select
                          className="w-full p-2 border rounded"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                        >
                          {models.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Temperatur</label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={temperature}
                          onChange={(e) => setTemperature(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="bg-swg-blue hover:bg-swg-blue/90" onClick={handleSaveConfig}>
                    Speichern
                  </Button>
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
  item: KnowledgeItem;
  onUpdate: (item: KnowledgeItem) => void;
  onDelete: () => void;
}> = ({ item, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [question, setQuestion] = useState(item.question);
  const [answer, setAnswer] = useState(item.answer);

  const save = async () => {
    const res = await fetch(`/api/knowledge/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer })
    });
    const updated = await res.json();
    onUpdate(updated);
    setEditing(false);
  };

  const remove = async () => {
    await fetch(`/api/knowledge/${item.id}`, { method: 'DELETE' });
    onDelete();
  };

  return (
    <div className="border rounded-lg p-4">
      {editing ? (
        <div className="space-y-2">
          <input
            className="w-full p-2 border rounded"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <textarea
            className="w-full p-2 border rounded"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={save}>Speichern</Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Abbrechen</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">{item.question}</h4>
            <span className="bg-gray-100 text-xs px-2 py-1 rounded">{item.category}</span>
          </div>
          <p className="text-sm text-gray-600">{item.answer}</p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" className="text-xs" onClick={() => setEditing(true)}>Bearbeiten</Button>
            <Button size="sm" variant="outline" className="text-xs text-red-500" onClick={remove}>Löschen</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

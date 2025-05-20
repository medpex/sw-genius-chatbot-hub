
import ChatWidget from '@/components/ChatWidget/ChatWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-swg-blue text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Stadtwerke Geesthacht</h1>
          <p className="text-white/80">Ihre zuverlässige Energieversorgung</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-6">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Willkommen bei den Stadtwerken Geesthacht</h2>
          <p className="text-gray-600 mb-6">
            Als Ihr lokaler Energieversorger bieten wir Ihnen zuverlässige Versorgung mit Strom,
            Gas, Wasser und Glasfaser. Entdecken Sie unsere kundenfreundlichen Tarife
            und profitieren Sie von unserem exzellenten Service.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              title="Strom & Gas"
              description="Unsere aktuellen Tarife für Privat- und Geschäftskunden mit attraktiven Konditionen."
            />
            <InfoCard
              title="Glasfaser"
              description="Schnelles Internet für Geesthacht mit unserer modernen Glasfaserinfrastruktur."
            />
            <InfoCard
              title="Kundenservice"
              description="Wir sind für Sie da - persönlich in unserem Kundencenter oder digital über unser Kundenportal."
            />
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Aktuelle Informationen</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-medium mb-2">Glasfaserausbau in Geesthacht</h3>
            <p className="text-gray-600">
              Wir freuen uns, bekannt geben zu können, dass der Glasfaserausbau in den Stadtteilen
              Oberstadt und Düneberg planmäßig voranschreitet. Ab Juli 2025 können die ersten
              Haushalte mit Highspeed-Internet versorgt werden.
            </p>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-100 p-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} Stadtwerke Geesthacht GmbH | Bergedorfer Str. 30-32, 21502 Geesthacht | Tel: 04152 / 929-0
        </div>
      </footer>
      
      <ChatWidget />
    </div>
  );
};

const InfoCard: React.FC<{
  title: string;
  description: string;
}> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="font-medium mb-2 text-swg-blue">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default Index;

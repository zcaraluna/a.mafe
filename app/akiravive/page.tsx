import Image from 'next/image';

export default function AkiraVive() {
  const backgroundPattern = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d3d3d3' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen text-center p-4"
      style={{ backgroundColor: '#f9fafb', backgroundImage: backgroundPattern }}
    >
      <div className="max-w-md mx-auto bg-white/70 backdrop-blur-sm p-8 rounded-lg shadow-2xl">
        <div className="mb-6">
          <Image
            src="/src/akira.jpg"
            alt="Foto de Akira"
            width={300}
            height={300}
            className="rounded-full object-cover mx-auto shadow-lg"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Akira "Kikin"
        </h1>
        <p className="text-lg text-gray-600 mb-4 italic">
          "En mi corazón, tú vivirás, desde hoy será y para siempre amor; esta fusión es irrompible"
        </p>
        <p className="text-md text-gray-500">
          25/1/2024 - 30/05/2025
        </p>
      </div>
    </div>
  );
} 
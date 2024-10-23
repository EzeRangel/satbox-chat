import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const START_OPTIONS = [
  "Pre-inscripción en el RFC",
  "Inscripción en el RFC",
  "Generar contraseña del SAT",
  "Generar e.firma",
];

interface Props {
  onPickOption: (option: string) => void;
}

export default function Start({ onPickOption }: Props) {
  return (
    <div className="flex flex-col h-full w-full p-4 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido al Asistente de Registro del SAT📋</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <p>
            Este asistente está diseñado para ayudarte a lo largo del proceso de
            registro en el SAT, ya sea que estés buscando obtener tu RFC,
            conocer los requisitos o entender mejor tus obligaciones como
            contribuyente.
          </p>
          <p className="font-semibold">¿Cómo te puedo ayudar?</p>
          <ul className="space-y-2 list-disc">
            <li>
              <strong>Guía paso a paso:</strong> Te llevaré de la mano en cada
              paso del proceso de registro.
            </li>
            <li>
              <strong>Respuestas claras:</strong> Responde a tus dudas sobre los
              trámites del SAT.
            </li>
            <li>
              <strong>Documentos y enlaces:</strong> Proporcionaré enlaces
              directos a los recursos que necesitas.
            </li>
            <li>
              <strong>Seguimiento de progreso:</strong> Te ayudaré a mantener un
              seguimiento de lo que ya has hecho y lo que aún te falta.
            </li>
          </ul>
        </CardContent>
      </Card>
      <div>
        <div className="space-y-3 mb-4">
          <h3 className="font-semibold tracking-tight">
            ¿Estás listo para comenzar?
          </h3>
          <p className="text-sm">
            Presiona la opción que prefieras para empezar un trámite o hazme una
            pregunta.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {START_OPTIONS.map((option, idx) => {
            return (
              <Button
                key={idx}
                variant="outline"
                onClick={() => {
                  onPickOption(option);
                }}
                className="h-auto py-2 px-3 text-xs md:text-sm"
              >
                {option}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

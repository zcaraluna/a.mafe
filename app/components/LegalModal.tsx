import { useLanguage } from '../../components/LanguageSelector';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const textos = {
  es: {
    titulo: "Aviso Legal",
    advertencia: "Este formulario NO reemplaza la formulación de una denuncia formal ante los órganos jurisdiccionales.",
    leyendaLegal: `Declaro haber leído y acepto que, según el <b>Código Penal Paraguayo (Ley 1160/97)</b>:<br />
      <i>
        Artículo 289.- Denuncia falsa<br />
        El que a sabiendas y con el fin de provocar o hacer continuar un procedimiento contra otro:<br />
        1. le atribuyera falsamente, ante autoridad o funcionario competente para recibir denuncias, haber realizado un hecho antijurídico o violado un deber proveniente de un cargo público;<br />
        2. le atribuyera públicamente una de las conductas señaladas en el numeral anterior; o<br />
        3. simulara pruebas contra él,<br />
        será castigado con pena privativa de libertad de hasta cinco años o con multa.
      </i>`,
    aceptar: "Acepto y continuar",
    cancelar: "Cancelar"
  },
  en: {
    titulo: "Legal Notice",
    advertencia: "This form DOES NOT replace the filing of a formal complaint before the jurisdictional bodies.",
    leyendaLegal: `I declare that I have read and accept that, according to the <b>Paraguayan Criminal Code (Law 1160/97)</b>:<br />
      <i>
        Article 289.- False complaint<br />
        Anyone who knowingly and with the purpose of provoking or continuing a procedure against another:<br />
        1. falsely attributes to them, before authority or official competent to receive complaints, having committed an unlawful act or violated a duty arising from a public office;<br />
        2. publicly attributes to them one of the conducts indicated in the previous numeral; or<br />
        3. simulates evidence against them,<br />
        shall be punished with imprisonment of up to five years or with a fine.
      </i>`,
    aceptar: "Accept and continue",
    cancelar: "Cancel"
  },
  gn: {
    titulo: "Ñe'ẽ Teéva",
    advertencia: "Ko kuatia ndoipurúi ñemomarandu teéva órganos jurisdiccionales renondépe.",
    leyendaLegal: `Amoneĩ ha aikuaa, Paraguái Léi 1160/97 he'iháicha:<br />
      <i>
        Artículo 289.- Ñemomarandu japu<br />
        Oimeraẽva oikuaáva ha oipota ojapo térã oheja ojejapo peteĩ mba'e rehe:<br />
        1. omombe'u japu peteĩ mba'e vai rehe, autoridad-pe térã funcionario-pe;<br />
        2. omombe'u japu público-pe;<br />
        3. ojapo japu mba'e rechaukaha,<br />
        oñehepyme'ẽta 5 ary peve térã multa rehe.
      </i>`,
    aceptar: "Amoneĩ ha ahasa",
    cancelar: "Ndaipotái"
  },
  pt: {
    titulo: "Aviso Legal",
    advertencia: "Este formulário NÃO substitui a apresentação de uma denúncia formal perante os órgãos jurisdicionais.",
    leyendaLegal: `Declaro que li e aceito que, de acordo com o <b>Código Penal Paraguaio (Lei 1160/97)</b>:<br />
      <i>
        Artigo 289.- Denúncia falsa<br />
        Quem, sabendo e com a intenção de provocar ou fazer continuar um procedimento contra outro:<br />
        1. atribuir falsamente, perante autoridade ou funcionário competente para receber denúncias, ter cometido um ato ilícito ou violado um dever decorrente de cargo público;<br />
        2. atribuir publicamente a ele uma das condutas indicadas no número anterior; ou<br />
        3. simular provas contra ele,<br />
        será punido com prisão de até cinco anos ou multa.
      </i>`,
    aceptar: "Aceitar e continuar",
    cancelar: "Cancelar"
  }
};

export default function LegalModal({ isOpen, onClose, onAccept }: LegalModalProps) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8 m-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {textos[language].titulo}
        </h2>

        {/* Advertencia */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700 font-medium">
            {textos[language].advertencia}
          </p>
        </div>

        {/* Aviso Legal */}
        <div className="mb-6">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: textos[language].leyendaLegal }}
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            {textos[language].cancelar}
          </button>
          <button
            onClick={onAccept}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {textos[language].aceptar}
          </button>
        </div>
      </div>
    </div>
  );
} 
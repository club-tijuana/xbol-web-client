import type { WhiteLabelConfig } from "@/config/whiteLabel";

type TermsAndConditionsContentProps = {
  whiteLabel: WhiteLabelConfig;
};

export default function TermsAndConditionsContent({
  whiteLabel,
}: TermsAndConditionsContentProps) {
  return (
    <>
      <p id="terminos"><strong>TÉRMINOS Y CONDICIONES</strong></p>
      <p><strong>{whiteLabel.legalEntityName.toUpperCase()}</strong></p>
      <p>Última actualización: {whiteLabel.legalLastUpdated}.</p>

      <p><strong>AVISO LEGAL</strong></p>
      <p>El presente documento constituye un contrato de adhesión de carácter vinculante que regula el acceso, uso y adquisición de boletos a través de la plataforma digital <a href={whiteLabel.websiteUrl}>{whiteLabel.websiteUrl}</a> (en lo sucesivo, la “Plataforma”).</p>
      <p>Al acceder, navegar, registrarse o realizar una compra, el Usuario manifiesta su consentimiento expreso mediante mecanismos electrónicos (clickwrap), reconociendo haber leído, entendido y aceptado en su totalidad los presentes Términos y Condiciones, generándose evidencia electrónica de dicha aceptación.</p>

      <p><strong>1.- DEFINICIONES</strong></p>
      <ul>
        <li><p><strong>Boletera:</strong> Persona moral denominada {whiteLabel.legalEntityName.toUpperCase()}, que opera la Plataforma y actúa exclusivamente como intermediario independiente.</p></li>
        <li><p><strong>Promotor:</strong> Responsable único de la organización, ejecución y contenido del Evento.</p></li>
        <li><p><strong>Usuario:</strong> Persona que utiliza la Plataforma.</p></li>
        <li><p><strong>Evento:</strong> Actividad organizada por el Promotor.</p></li>
        <li><p><strong>Boleto:</strong> Título de acceso en formato físico o digital.</p></li>
        <li><p><strong>Cargo por Servicio:</strong> Comisión por intermediación tecnológica.</p></li>
        <li><p><strong>Contracargo:</strong> Reversión solicitada ante institución financiera.</p></li>
        <li><p><strong>Plataforma:</strong> Infraestructura tecnológica de la Boletera, <a href={whiteLabel.websiteUrl}>{whiteLabel.websiteUrl}</a>.</p></li>
      </ul>

      <p><strong>2.- NATURALEZA DE LA RELACIÓN</strong></p>
      <p>La Boletera actúa única y exclusivamente como intermediario tecnológico independiente, por lo que:</p>
      <ol>
        <li><p>No existe relación solidaria ni subsidiaria con el Promotor.</p></li>
        <li><p>No es responsable por la ejecución, cancelación, calidad, seguridad o contenido del Evento.</p></li>
        <li><p>No asume obligaciones más allá de la correcta intermediación en la venta de boletos.</p></li>
      </ol>

      <p><strong>3.- CAPACIDAD LEGAL</strong></p>
      <p>El Usuario declara tener capacidad legal suficiente. En caso de menores, la responsabilidad recae en padres o tutores.</p>

      <p><strong>4.- REGISTRO, SEGURIDAD Y ANTIFRAUDE</strong></p>
      <p>La Boletera podrá implementar controles de validación, incluyendo:</p>
      <ol>
        <li><p>Verificación de identidad.</p></li>
        <li><p>Detección de bots o compras automatizadas.</p></li>
        <li><p>Cancelación de transacciones sospechosas.</p></li>
      </ol>
      <p>La Boletera podrá cancelar unilateralmente operaciones que considere fraudulentas.</p>

      <p><strong>5.- PROCESO DE COMPRA</strong></p>
      <ol>
        <li><p>Toda compra está sujeta a disponibilidad y validación bancaria.</p></li>
        <li><p>Una vez autorizada, la operación es definitiva e irrevocable.</p></li>
        <li><p>La Boletera podrá establecer límites de compra por Usuario.</p></li>
      </ol>

      <p><strong>6.- CARGOS POR SERVICIO</strong></p>
      <p>Los Cargos por Servicio son independientes del precio del Evento, sin embargo, la Plataforma mostrará el precio total de cada boleto, incluida la comisión de Cargos por Servicio.</p>
      <p>Los Cargos por Servicio no son reembolsables.</p>

      <p id="entrega"><strong>7.- ENTREGA Y VALIDEZ</strong></p>
      <p>El Usuario es responsable en todo momento del resguardo del Boleto o los boletos. Boletos duplicados o alterados serán inválidos.</p>

      <p><strong>8.- USO DEL BOLETO</strong></p>
      <ol>
        <li><p>Válido solo para condiciones específicas del Evento.</p></li>
        <li><p>Boletos no utilizados no generan reembolso.</p></li>
      </ol>

      <p><strong>9.- CANCELACIÓN, POSPOSICIÓN Y CAMBIOS</strong></p>
      <p><strong>Cancelación:</strong></p>
      <ol>
        <li><p>Reembolsos conforme a políticas del Promotor.</p></li>
        <li><p>Plazo máximo de gestión: 30 días naturales.</p></li>
      </ol>
      <p><strong>Posposición:</strong></p>
      <ol>
        <li><p>El boleto mantiene su validez.</p></li>
      </ol>
      <p><strong>Cambio de sede:</strong></p>
      <ol>
        <li><p>El Usuario acepta la nueva ubicación sin reembolso, salvo indicación del Promotor.</p></li>
      </ol>

      <p><strong>10.- CASO FORTUITO Y FUERZA MAYOR</strong></p>
      <p>La Boletera no será responsable por casos fortuitos y/o eventos de fuerza mayor, los cuales, a manera enunciativa, más no limitativa, se mencionan a continuación:</p>
      <ol>
        <li><p>Pandemias y/o epidemias.</p></li>
        <li><p>Actos de autoridad.</p></li>
        <li><p>Fallas tecnológicas.</p></li>
        <li><p>Ciberataques.</p></li>
      </ol>

      <p><strong>11.- DERECHO DE ADMISIÓN</strong></p>
      <p>El acceso estará sujeto a reglas objetivas del Promotor y del recinto. La negativa de acceso por incumplimiento de dichas reglas no generará reembolso.</p>

      <p><strong>12.- REGLAMENTO DEL RECINTO</strong></p>
      <p>En todo momento el Usuario deberá cumplir con las normas del inmueble. El incumplimiento podrá derivar en expulsión sin reembolso.</p>

      <p><strong>13.- EFECTOS ESPECIALES DEL EVENTO</strong></p>
      <p>El Usuario asume los riesgos derivados de los efectos especiales del Evento, tales como show de luces, pirotecnia, ruido en exceso, entre otros.</p>

      <p><strong>14.- CONTROL DE TITULARIDAD</strong></p>
      <p>El Promotor podrá establecer restricciones sobre: nombre, medio de pago y cuenta registrada.</p>

      <p><strong>15.- MERCADO SECUNDARIO</strong></p>
      <ul>
        <li><p>Solo se permite reventa autorizada dentro de la Plataforma.</p></li>
        <li><p>Boletos adquiridos fuera no están garantizados.</p></li>
      </ul>

      <p id="reembolsos"><strong>16.- REEMBOLSOS</strong></p>
      <ul>
        <li><p>Proceden únicamente en los supuestos autorizados.</p></li>
        <li><p>Se procesarán en el mismo método de pago.</p></li>
        <li><p>No incluyen cargos por servicio.</p></li>
      </ul>

      <p><strong>17.- CONTRACARGOS</strong></p>
      <p>El Usuario se obliga a no iniciar contracargos indebidos. En caso contrario:</p>
      <ul>
        <li><p>Se suspenderá la cuenta.</p></li>
        <li><p>Se podrán reclamar gastos administrativos.</p></li>
        <li><p>Se bloqueará el acceso futuro.</p></li>
      </ul>

      <p><strong>18.- FACTURACIÓN</strong></p>
      <p>En caso de que el Usuario necesite factura, deberá solicitarla a través de los medios de contacto de la Boletera, dentro de los 10 días naturales siguientes a partir de la compra.</p>

      <p><strong>19.- PROTECCIÓN DE DATOS</strong></p>
      <p>La Boletera realizará el tratamiento conforme a la legislación mexicana vigente.</p>

      <p><strong>20.- LIMITACIÓN DE RESPONSABILIDAD</strong></p>
      <p>La responsabilidad total de la Boletera se limita al Cargo por Servicio.</p>

      <p><strong>21.- AUDITORÍA Y MONITOREO</strong></p>
      <p>La Boletera podrá auditar transacciones para prevenir fraude o incumplimientos.</p>

      <p><strong>22.- ACEPTACIÓN</strong></p>
      <p>El uso de la Plataforma implica aceptación total de estos términos.</p>

      <p><strong>23.- JURISDICCIÓN</strong></p>
      <p>Las partes se someten a las leyes mexicanas y tribunales del lugar del Evento.</p>

      <p><strong>24.- CONTACTO</strong></p>
      <p>Página web: <a href={whiteLabel.websiteUrl}>{whiteLabel.websiteUrl}</a>.</p>
      <p>Correo electrónico: <a href={"mailto:" + whiteLabel.contact.email}>{whiteLabel.contact.email}</a>.</p>
      <p>WhatsApp: {whiteLabel.contact.whatsapp}</p>
      <p>Domicilio: {whiteLabel.contact.address}</p>

      <p id="privacidad"><strong>AVISO DE PRIVACIDAD INTEGRAL</strong></p>
      <p><strong>{whiteLabel.legalEntityName.toUpperCase()}</strong></p>
      <p>Última actualización: {whiteLabel.legalLastUpdated}.</p>
      <p>En {whiteLabel.legalEntityName.toUpperCase()}, valoramos la privacidad de nuestros usuarios. Por ello, ponemos a su disposición el presente Aviso de Privacidad, en cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y demás disposiciones aplicables.</p>

      <p><strong>1.- IDENTIDAD Y DOMICILIO DEL RESPONSABLE.</strong></p>
      <p>{whiteLabel.legalEntityName.toUpperCase()}, responsable del tratamiento de sus datos personales, señala como domicilio para efectos del presente Aviso el ubicado en: {whiteLabel.contact.address}</p>
      <p>Correo electrónico para asuntos de privacidad: <a href={"mailto:" + whiteLabel.contact.email}>{whiteLabel.contact.email}</a>.</p>

      <p><strong>2.- DATOS PERSONALES QUE PODRÍAN RECABARSE.</strong></p>
      <p>Dependiendo del servicio solicitado, podremos recabar las siguientes categorías de datos personales:</p>

      <p><strong>Datos de identificación.</strong></p>
      <ul>
        <li><p>Nombre completo.</p></li>
        <li><p>Fecha de nacimiento (cuando resulte necesaria).</p></li>
        <li><p>Nacionalidad (en casos específicos).</p></li>
        <li><p>CURP, cuando legalmente proceda.</p></li>
      </ul>

      <p><strong>Datos de contacto.</strong></p>
      <ul>
        <li><p>Correo electrónico.</p></li>
        <li><p>Número telefónico.</p></li>
        <li><p>Domicilio para facturación, en su caso.</p></li>
      </ul>

      <p><strong>Datos fiscales.</strong></p>
      <p>Cuando el Usuario solicite factura:</p>
      <ul>
        <li><p>RFC.</p></li>
        <li><p>Razón social.</p></li>
        <li><p>Régimen fiscal.</p></li>
        <li><p>Código Postal.</p></li>
        <li><p>Uso de CFDI.</p></li>
        <li><p>Información fiscal requerida por la legislación aplicable.</p></li>
      </ul>

      <p><strong>Datos financieros.</strong></p>
      <p>Para efectos del procesamiento de pagos:</p>
      <ul>
        <li><p>Información parcial del medio de pago.</p></li>
        <li><p>Identificador de la transacción.</p></li>
        <li><p>Institución bancaria emisora.</p></li>
      </ul>
      <p>{whiteLabel.legalEntityName.toUpperCase()} no almacena los números completos de tarjetas bancarias ni códigos de seguridad, cuando dichos pagos sean procesados mediante proveedores especializados de servicios de pago.</p>

      <p><strong>Datos electrónicos.</strong></p>
      <ul>
        <li><p>Dirección IP.</p></li>
        <li><p>Cookies.</p></li>
        <li><p>Identificadores del dispositivo.</p></li>
        <li><p>Navegador.</p></li>
        <li><p>Sistema operativo.</p></li>
        <li><p>Geolocalización aproximada derivada de la conexión.</p></li>
        <li><p>Historial de navegación dentro de la Plataforma.</p></li>
      </ul>

      <p><strong>Información relacionada con las compras.</strong></p>
      <ul>
        <li><p>Eventos adquiridos.</p></li>
        <li><p>Número de boletos.</p></li>
        <li><p>Historial de compras.</p></li>
        <li><p>Métodos de entrega.</p></li>
        <li><p>Incidencias.</p></li>
        <li><p>Reembolsos.</p></li>
        <li><p>Contracargos.</p></li>
      </ul>

      <p><strong>3.- DATOS PERSONALES SENSIBLES.</strong></p>
      <p>El Responsable no recaba ni trata datos personales sensibles de manera ordinaria.</p>
      <p>En caso de que excepcionalmente resulte necesario tratarlos para un servicio específico, se solicitará previamente el consentimiento expreso del titular en términos de la legislación aplicable.</p>

      <p><strong>4.- FINALIDADES DEL TRATAMIENTO.</strong></p>
      <p>Los datos personales serán utilizados para las siguientes finalidades primarias:</p>
      <p><strong>A) Finalidades necesarias.</strong></p>
      <ul>
        <li><p>Crear y administrar la cuenta del Usuario.</p></li>
        <li><p>Identificar al Usuario.</p></li>
        <li><p>Procesar la compra de boletos.</p></li>
        <li><p>Validar operaciones.</p></li>
        <li><p>Emitir boletos electrónicos.</p></li>
        <li><p>Administrar accesos al Evento.</p></li>
        <li><p>Prevenir fraudes.</p></li>
        <li><p>Detectar operaciones inusuales.</p></li>
        <li><p>Validar identidad.</p></li>
        <li><p>Atender aclaraciones.</p></li>
        <li><p>Gestionar cancelaciones y reembolsos.</p></li>
        <li><p>Atender solicitudes relacionadas con contracargos.</p></li>
        <li><p>Emitir comprobantes fiscales digitales (CFDI).</p></li>
        <li><p>Dar cumplimiento a obligaciones legales.</p></li>
        <li><p>Cumplir requerimientos de autoridades competentes.</p></li>
        <li><p>Dar seguimiento a quejas y reclamaciones.</p></li>
      </ul>

      <p><strong>B) Finalidades secundarias.</strong></p>
      <p>Adicionalmente, con su consentimiento, podremos utilizar sus datos para:</p>
      <ul>
        <li><p>Enviar promociones.</p></li>
        <li><p>Informar sobre nuevos eventos.</p></li>
        <li><p>Realizar encuestas de satisfacción.</p></li>
        <li><p>Elaborar estadísticas comerciales.</p></li>
        <li><p>Realizar campañas de mercadotecnia.</p></li>
        <li><p>Analizar hábitos de consumo.</p></li>
        <li><p>Personalizar la experiencia del Usuario.</p></li>
      </ul>
      <p>El Usuario podrá oponerse al tratamiento de sus datos para estas finalidades secundarias mediante el procedimiento previsto en este Aviso.</p>

      <p><strong>5.- TRANSFERENCIA DE DATOS PERSONALES.</strong></p>
      <p>Sus datos personales podrán ser transferidos, sin requerir su consentimiento cuando así lo permita la legislación aplicable, a:</p>
      <ul>
        <li><p>Promotores de los eventos.</p></li>
        <li><p>Recintos sede.</p></li>
        <li><p>Instituciones financieras.</p></li>
        <li><p>Pasarelas de pago.</p></li>
        <li><p>Proveedores tecnológicos.</p></li>
        <li><p>Empresas encargadas de prevención de fraude.</p></li>
        <li><p>Autoridades competentes.</p></li>
        <li><p>Autoridades fiscales.</p></li>
        <li><p>Autoridades judiciales.</p></li>
      </ul>
      <p>Asimismo, podrán realizarse aquellas transferencias previstas en el artículo 37 de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.</p>
      <p>En los demás casos se solicitará el consentimiento correspondiente.</p>

      <p><strong>6.- USO DE COOKIES Y TECNOLOGÍAS SIMILARES.</strong></p>
      <p>La Plataforma podrá utilizar:</p>
      <ul>
        <li><p>Cookies.</p></li>
        <li><p>Web Beacons.</p></li>
        <li><p>Etiquetas de seguimiento.</p></li>
        <li><p>Tecnologías similares.</p></li>
      </ul>
      <p>Estas tecnologías permiten:</p>
      <ul>
        <li><p>Recordar preferencias.</p></li>
        <li><p>Facilitar el inicio de sesión.</p></li>
        <li><p>Analizar navegación.</p></li>
        <li><p>Detectar fraudes.</p></li>
        <li><p>Medir desempeño de la Plataforma.</p></li>
        <li><p>Mejorar la experiencia del Usuario.</p></li>
      </ul>
      <p>El Usuario puede deshabilitar dichas tecnologías desde la configuración de su navegador, considerando que ello podría afectar el funcionamiento de algunos servicios.</p>

      <p><strong>7.- MEDIDAS DE SEGURIDAD.</strong></p>
      <p>El Responsable implementa medidas administrativas, técnicas y físicas razonables para proteger los datos personales contra:</p>
      <ul>
        <li><p>daño;</p></li>
        <li><p>pérdida;</p></li>
        <li><p>alteración;</p></li>
        <li><p>destrucción;</p></li>
        <li><p>uso no autorizado;</p></li>
        <li><p>acceso indebido;</p></li>
        <li><p>divulgación.</p></li>
      </ul>
      <p>No obstante, ningún sistema informático puede garantizar seguridad absoluta.</p>

      <p><strong>8.- CONSERVACIÓN DE LOS DATOS.</strong></p>
      <p>Los datos personales serán conservados durante el tiempo necesario para:</p>
      <ul>
        <li><p>cumplir las finalidades descritas;</p></li>
        <li><p>cumplir obligaciones legales;</p></li>
        <li><p>resolver controversias;</p></li>
      </ul>
      <p>Posteriormente serán eliminados o anonimizados conforme a la legislación aplicable.</p>

      <p><strong>9.- DERECHOS ARCO</strong></p>
      <p>Usted tiene derecho a conocer qué datos personales tenemos de usted, solicitar su corrección cuando sean inexactos, pedir su eliminación cuando sea procedente u oponerse a determinados tratamientos (Derechos ARCO). En consecuencia, el titular podrá ejercer sus derechos de:</p>
      <ul>
        <li><p>Acceso;</p></li>
        <li><p>Rectificación;</p></li>
        <li><p>Cancelación;</p></li>
        <li><p>Oposición,</p></li>
      </ul>
      <p>mediante solicitud dirigida al Responsable a través de los siguientes medios de contacto:</p>
      <p>Página web: <a href={whiteLabel.websiteUrl}>{whiteLabel.websiteUrl}</a>.</p>
      <p>Correo electrónico: <a href={"mailto:" + whiteLabel.contact.email}>{whiteLabel.contact.email}</a>.</p>
      <p>WhatsApp: {whiteLabel.contact.whatsapp}</p>
      <p>Domicilio: {whiteLabel.contact.address}</p>
      <p>La solicitud deberá contener:</p>
      <ul>
        <li><p>nombre del titular;</p></li>
        <li><p>documentos que acrediten identidad;</p></li>
        <li><p>descripción clara del derecho que pretende ejercer;</p></li>
        <li><p>documentación que sustente la solicitud cuando corresponda.</p></li>
      </ul>
      <p>El Responsable dará respuesta dentro de los plazos establecidos por la legislación aplicable.</p>

      <p><strong>10.- REVOCACIÓN DEL CONSENTIMIENTO.</strong></p>
      <p>El titular podrá revocar el consentimiento otorgado para el tratamiento de sus datos personales cuando ello sea legalmente procedente, mediante solicitud enviada al correo electrónico señalado para el ejercicio de derechos ARCO.</p>
      <p>La revocación no tendrá efectos retroactivos ni impedirá el tratamiento necesario para el cumplimiento de obligaciones legales o contractuales.</p>

      <p><strong>11.- LIMITACIÓN DEL USO O DIVULGACIÓN.</strong></p>
      <p>El titular podrá solicitar la limitación del uso o divulgación de sus datos personales mediante comunicación enviada al correo electrónico señalado en este Aviso.</p>
      <p>Asimismo, podrá manifestar su negativa para recibir publicidad o información comercial.</p>

      <p><strong>12.- CAMBIOS AL AVISO DE PRIVACIDAD.</strong></p>
      <p>El Responsable podrá modificar el presente Aviso de Privacidad en cualquier momento para adecuarlo a reformas legales, criterios de autoridades, cambios en sus operaciones o nuevos servicios.</p>
      <p>Las modificaciones serán publicadas en: <a href={whiteLabel.websiteUrl}>{whiteLabel.websiteUrl}</a>.</p>
      <p>La versión publicada en la Plataforma será la vigente.</p>

      <p><strong>13.- CONSENTIMIENTO.</strong></p>
      <p>Al registrarse, utilizar la Plataforma, adquirir boletos o proporcionar sus datos personales por cualquier medio autorizado, el Usuario reconoce haber leído el presente Aviso de Privacidad y acepta el tratamiento de sus datos personales conforme a los términos aquí establecidos.</p>
    </>
  );
}

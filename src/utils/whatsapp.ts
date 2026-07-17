const WHATSAPP_NUMBER = "523319027014";

export function buildGeneralWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

interface WhatsAppProduct {
  name: string;
}

interface WhatsAppPresentation {
  label: string;
}

export function buildWhatsAppLink(
  product: WhatsAppProduct,
  presentation?: WhatsAppPresentation,
  isSobrePedido = false,
): string {
  let message: string;

  if (isSobrePedido) {
    message = `Hola, me interesa el producto "${product.name}" que vi en su catálogo. Entiendo que es sobre pedido.`;
  } else if (presentation) {
    message = `Hola, me interesa el producto "${product.name}" (${presentation.label}) que vi en su catálogo.`;
  } else {
    message = `Hola, me interesa el producto "${product.name}" que vi en su catálogo.`;
  }

  return buildGeneralWhatsAppLink(message);
}

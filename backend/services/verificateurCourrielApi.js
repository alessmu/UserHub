export async function verifierCourriel(courriel) {
    const api_key = process.env.ZERUH_API_KEY;

    const url = `https://api.zeruh.com/v1/verify?api_key=${api_key}&email_address=${encodeURIComponent(
        courriel
    )}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Si la vérification a fonctionné et le courriel est valide
        return data.result?.status === "deliverable";
    } catch (erreur) {
        console.error("Erreur API courriel:", erreur);
        return false;
    }
}

export async function saveEmailToDatabase(
  email: string,
  name: string,
): Promise<void> {
  try {
    const response = await fetch(
      `https://www.schola.space/api/add-lead?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`,
      {
        method: "GET", // Asegúrate de que este método coincide con el esperado por tu API route
      },
    );
    if (!response.ok) {
      throw new Error("Error al guardar el email en la base de datos");
    }
    // Procesa la respuesta de tu API aquí, por ejemplo, mostrando un mensaje de éxito
    console.log("Email guardado con éxito");
  } catch (error) {
    console.error("Error al guardar el email:", error);
    // Maneja el error aquí, por ejemplo, mostrando un mensaje de error
  }
}
